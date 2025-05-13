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

###############################################
#                                             
#               GET Operations                
#                                             
###############################################

# User ============== GET Tag: All
@router.get("/all", response_model=List[schemas.TagShow])
async def tags_get_all(
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    tags = []

    try:
        tags = db.query(models.Tag).all()
    except:
        raise HTTPException(status_code=500)

    return tags

# User ============== GET Tag: Single by UUID
@router.get("/{tag_id}", response_model=schemas.TagShow)
async def tags_get_single(
    tag_id: str,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    tag = None

    # Check for tag by UUID
    tag = db.query(models.Tag).filter(models.Tag.id == uuid.UUID(tag_id)).first()


    if tag is None:
        raise HTTPException(status_code=404, detail="A tag with that ID does not exist.")
    
    return tag

###############################################
#                                             
#               POST Operations               
#                                             
###############################################

# Admin ============= POST Tag: Create
@router.post("", response_model=schemas.TagShow, status_code=201)
async def tags_post_create(
    tag_in: schemas.TagBase,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Must be administrator to perform this action
    if requester.role != 1:
        raise HTTPException(status_code=403)
    
    db_tag = models.Tag(
        id = uuid.uuid4(),
        name = tag_in.name,
        address = tag_in.address,
        pos_x = None,
        pos_y = None,
        last_contact = None
    )

    db.add(db_tag)

    try:
        db.commit()
    except IntegrityError:
        raise HTTPException(status_code=409, detail="A tag with this name or address already exists.")
    except:
        raise HTTPException(status_code=500)

    db.refresh(db_tag)

    return db_tag

###############################################
#                                             
#              PATCH Operations               
#                                             
###############################################

# Admin ============= PATCH Tag: Single
@router.patch("/{tag_id}", response_model=schemas.TagShow)
async def tags_patch_single(
    tag_id: str,
    tag_in: schemas.TagBase,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Requires Admin
    if requester.role != 1:
        raise HTTPException(status_code=403)

    tag = None
    # Check for tag by UUID
    try:
        tag = db.query(models.Tag).filter(models.Tag.id == uuid.UUID(tag_id)).first()
    except:
        pass

    if tag is None:
        raise HTTPException(status_code=404, detail="A tag with that ID does not exist.")
    
    try:
        tag.name = tag_in.name
        tag.address = tag_in.address
        db.commit()
    except:
        raise HTTPException(status_code=500)

    return tag


###############################################
#                                             
#              DELETE Operations              
#                                             
###############################################

# Admin ============= Delete Tag: Single
@router.delete("/{tag_id}", response_model=schemas.TagShow)
async def tags_delete_single(
    tag_id: str,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Must be administrator to perform this action
    if requester.role != 1:
        raise HTTPException(status_code=403)

    tag = None

    # Check for tag by UUID
    try:
        tag = db.query(models.Tag).filter(models.Tag.id == uuid.UUID(tag_id)).first()
    except:
        pass

    # A tag is not found with the given uuid
    if tag is None:
        raise HTTPException(status_code=404, detail="A tag with that ID does not exist.")
    
    try:
        db.delete(tag)
        db.commit()
    except:
        raise HTTPException(status_code=500)

    return tag