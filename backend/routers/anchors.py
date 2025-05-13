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

# User ============== GET Anchor: All
@router.get("/all", response_model=List[schemas.AnchorShow])
async def anchors_get_all(
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    anchors = []

    try:
        anchors = db.query(models.Anchor).all()
    except:
        raise HTTPException(status_code=500)

    return anchors

# User ============== GET Anchor: Single by UUID
@router.get("/{anchor_id}", response_model=schemas.AnchorShow)
async def anchors_get_single(
    anchor_id: str,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    anchor = None

    # Check for anchor by UUID
    anchor = db.query(models.Anchor).filter(models.Anchor.id == uuid.UUID(anchor_id)).first()


    if anchor is None:
        raise HTTPException(status_code=404, detail="An anchor with that ID does not exist.")
    
    return anchor

###############################################
#                                             
#               POST Operations               
#                                             
###############################################

# Admin ============= POST Anchor: Create
@router.post("", response_model=schemas.AnchorShow, status_code=201)
async def anchors_post_create(
    anchor_in: schemas.AnchorBase,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Must be administrator to perform this action
    if requester.role != 1:
        raise HTTPException(status_code=403)
    
    db_anchor = models.Anchor(
        id = uuid.uuid4(),
        address = anchor_in.address,
        name = anchor_in.name,
        height = anchor_in.height,
        pos_x = anchor_in.pos_x,
        pos_y = anchor_in.pos_y,
    )

    db.add(db_anchor)

    try:
        db.commit()
    except IntegrityError:
        raise HTTPException(status_code=409, detail="An anchor with this name or address already exists.")
    except:
        raise HTTPException(status_code=500)

    db.refresh(db_anchor)

    return db_anchor

###############################################
#                                             
#              PATCH Operations               
#                                             
###############################################

# Admin ============= PATCH Anchor: Single ALL data
@router.patch("/{anchor_id}", response_model=schemas.AnchorShow)
async def anchors_patch_single(
    anchor_id: str,
    anchor_in: schemas.AnchorBase,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Requires Admin
    if requester.role != 1:
        raise HTTPException(status_code=403)

    anchor = None

    # Check for anchor by UUID
    try:
        anchor = db.query(models.Anchor).filter(models.Anchor.id == uuid.UUID(anchor_id)).first()
    except:
        pass

    if anchor is None:
        raise HTTPException(status_code=404, detail="An anchor with that ID does not exist.")
    
    try:
        anchor.address = anchor_in.address
        anchor.name = anchor_in.name
        anchor.height = anchor_in.height
        anchor.pos_x = anchor_in.pos_x
        anchor.pos_y = anchor_in.pos_y
        db.commit()
    except:
        raise HTTPException(status_code=500)

    return anchor

# Admin ============= PATCH Anchor: Single Position Only
@router.patch("/{anchor_id}/position", response_model=schemas.AnchorShow)
async def anchors_patch_single_position(
    anchor_id: str,
    anchor_in: schemas.AnchorPosition,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Requires Admin
    if requester.role != 1:
        raise HTTPException(status_code=403)

    anchor = None

    # Check for anchor by UUID
    try:
        anchor = db.query(models.Anchor).filter(models.Anchor.id == uuid.UUID(anchor_id)).first()
    except:
        pass

    if anchor is None:
        raise HTTPException(status_code=404, detail="An anchor with that ID does not exist.")
    
    try:
        anchor.pos_x = anchor_in.pos_x
        anchor.pos_y = anchor_in.pos_y
        db.commit()
    except:
        raise HTTPException(status_code=500)

    return anchor

###############################################
#                                             
#              DELETE Operations              
#                                             
###############################################

# Admin ============= Delete Anchor: Single
@router.delete("/{anchor_id}", response_model=schemas.AnchorShow)
async def anchors_delete_single(
    anchor_id: str,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Must be administrator to perform this action
    if requester.role != 1:
        raise HTTPException(status_code=403)

    anchor = None

    # Check for anchor by UUID
    try:
        anchor = db.query(models.Anchor).filter(models.Anchor.id == uuid.UUID(anchor_id)).first()
    except:
        pass

    # An anchor is not found with the given uuid
    if anchor is None:
        raise HTTPException(status_code=404, detail="An anchor with that ID does not exist.")
    
    try:
        db.delete(anchor)
        db.commit()
    except:
        raise HTTPException(status_code=500)

    return anchor