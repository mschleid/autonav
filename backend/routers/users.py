from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import Annotated, List
import schemas
import database
from . import auth
import models
import uuid


router = APIRouter()
###############################################
#                                             
#              Helper Functions               
#                                             
###############################################
async def validate_format_user(data: schemas.UserCreate):
    if len(data.username) > 50:
        raise HTTPException(status_code=413, detail="Field 'username' has maximum length of 50.")

    if len(data.password) > 64:
        raise HTTPException(status_code=413, detail="Field 'password' has maximum length of 64.")

    if len(data.first_name) > 50:
        raise HTTPException(status_code=413, detail="Field 'first_name' has maximum length of 50.")

    if len(data.last_name) > 50:
        raise HTTPException(status_code=413, detail="Field 'last_name' has maximum length of 50.")

    if len(data.email) > 100:
        raise HTTPException(status_code=413, detail="Field 'email' has maximum length of 100.")

    if data.role != 0 or data.role != 1:
        raise HTTPException(status_code=413, detail="Invalid data for 'role'.")

###############################################
#                                             
#               GET Operations                
#                                             
###############################################

# User ============== GET User: Me
@router.get("/me", response_model=schemas.UserShow)
async def users_get_me(
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)]
):
    return requester

# Admin ============= GET User: All
@router.get("/all", response_model=List[schemas.UserShow])
async def users_get_all(
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    if requester.role != 1:
        raise HTTPException(status_code=403)

    users = []

    try:
        users = db.query(models.User).all()
    except:
        raise HTTPException(status_code=500)

    return users

# Admin ============= GET User: Single by UUID
@router.get("/{user_id}", response_model=schemas.UserShow)
async def users_get_single(
    user_id: str,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Must be administrator to perform this action
    if requester.role != 1:
        raise HTTPException(status_code=403)

    user = None

    user = db.query(models.User).filter(models.User.id == uuid.UUID(user_id)).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist.")
    
    return user

###############################################
#                                             
#               POST Operations               
#                                             
###############################################

# Admin ============= POST User: Create
@router.post("", response_model=schemas.UserShow, status_code=201)
async def users_post_create(
    user_in: schemas.UserCreate, 
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Must be administrator to perform this action
    if requester.role != 1:
        raise HTTPException(status_code=403)
    
    validate_format_user(user_in)
    
    db_user = models.User(
        id = uuid.uuid4(),
        username = user_in.username,
        hashed_password = auth.hash_password(user_in.password),
        first_name = user_in.first_name,
        last_name = user_in.last_name,
        email = user_in.email,
        role = user_in.role
    )

    db.add(db_user)

    try:
        db.commit()
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Username or email already exists.")
    except:
        raise HTTPException(status_code=500)

    db.refresh(db_user)

    return db_user

# User ============== POST User: Me New Password
@router.post("/me/password", response_model=schemas.UserShow)
async def users_post_newpassword_self(
    passwords_in: schemas.UserUpdatePasswordMe,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):

    user = db.query(models.User).filter(models.User.id == requester.id).first()

    if user is None:
        raise HTTPException(status_code=500, detail="Unknown error.")
        
    if not auth.verify_password(passwords_in.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials.", headers={"WWW_Authenticate": "Bearer"})
    
    try:
        user.hashed_password = auth.hash_password(passwords_in.new_password)
        db.commit()
    except:
        raise HTTPException(status_code=500)
    
    return user
    
# Admin ============= POST User: Single New Password
@router.post("/{user_id}/password", response_model=schemas.UserShow)
async def users_post_newpassword_single(
    user_id: str,
    passwords_in: schemas.UserUpdatePassword,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):

    # Must be administrator to perform this action
    if requester.role != 1:
        raise HTTPException(status_code=403)

    user = None

    # Check for user by UUID
    user = db.query(models.User).filter(models.User.id == uuid.UUID(user_id)).first()

    # A user is not found with the given id/username
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist.")
    
    try:
        user.hashed_password = auth.hash_password(passwords_in.new_password)
        db.commit()
    except:
        raise HTTPException(status_code=500)

    return user

###############################################
#                                             
#              PATCH Operations               
#                                             
###############################################

# User ============== PATCH User: Me
@router.patch("/me", response_model=schemas.UserShow)
async def users_patch_self(
    user_in: schemas.UserUpdateMe,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    validate_format_user(user_in)

    try:
        requester.first_name = user_in.first_name
        requester.last_name = user_in.last_name
        requester.email = user_in.email
        db.commit()
    except:
        db.rollback()
        raise HTTPException(status_code=500)

    return requester

# Admin ============= PATCH User: Single
@router.patch("/{user_id}", response_model=schemas.UserShow)
async def users_patch_single(
    user_id: str,
    user_in: schemas.UserBase,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    validate_format_user(user_in)

    # Must be administrator to perform this action
    if requester.role != 1:
        raise HTTPException(status_code=403)

    user = None

    # Check for user by UUID
    user = db.query(models.User).filter(models.User.id == uuid.UUID(user_id)).first()

    # A user is not found with the given id/username
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist.")

    try:
        user.first_name = user_in.first_name
        user.last_name = user_in.last_name
        user.username = user_in.username
        user.email = user_in.email
        user.role = user_in.role
        user.disabled = user_in.disabled
        db.commit()
    except:
        db.rollback()
        raise HTTPException(status_code=500)

    return user

###############################################
#                                             
#              DELETE Operations              
#                                             
###############################################

# Admin ============= DELETE User: Single
@router.delete("/{user_id}", response_model=schemas.UserShow)
async def users_delete_single(
    user_id: str,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Must be administrator to perform this action
    if requester.role != 1:
        raise HTTPException(status_code=403)

    user = None

    # Check for user by UUID
    user = db.query(models.User).filter(models.User.id == uuid.UUID(user_id)).first()

    # A user is not found with the given id/username
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist.")
    
    # User tries to delete their own account
    if user.id == requester.id:
        raise HTTPException(status_code=400, detail="You cannot delete your own account.")
    
    try:
        db.delete(user)
        db.commit()
    except:
        db.rollback()
        raise HTTPException(status_code=500)

    return user