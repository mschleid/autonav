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

# User ============== GET Waypoint: All
@router.get("/all", response_model=List[schemas.WaypointShow])
async def waypoints_get_all(
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    waypoints = []

    try:
        waypoints = db.query(models.Waypoint).all()
    except:
        raise HTTPException(status_code=500)

    return waypoints

# User ============== GET Waypoint: Single by UUID
@router.get("/{waypoint_id}", response_model=schemas.WaypointShow)
async def waypoints_get_single(
    waypoint_id: str,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    waypoint = None

    # Check for waypoint by UUID
    waypoint = db.query(models.Waypoint).filter(models.Waypoint.id == uuid.UUID(waypoint_id)).first()


    if waypoint is None:
        raise HTTPException(status_code=404, detail="A waypoint with that ID does not exist.")
    
    return waypoint

###############################################
#                                             
#               POST Operations               
#                                             
###############################################

# Admin ============= POST Waypoint: Create
@router.post("", response_model=schemas.WaypointShow, status_code=201)
async def waypoints_post_create(
    waypoint_in: schemas.WaypointBase,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Must be administrator to perform this action
    if requester.role != 1:
        raise HTTPException(status_code=403)
    
    db_waypoint = models.Waypoint(
        id = uuid.uuid4(),
        pos_x = waypoint_in.pos_x,
        pos_y = waypoint_in.pos_y,
        name = waypoint_in.name
    )

    db.add(db_waypoint)

    try:
        db.commit()
    except IntegrityError:
        raise HTTPException(status_code=409, detail="A waypoint with this name already exists.")
    except:
        raise HTTPException(status_code=500)

    db.refresh(db_waypoint)

    return db_waypoint

###############################################
#                                             
#              PATCH Operations               
#                                             
###############################################

# Admin ============= PATCH Waypoint: Single
@router.patch("/{waypoint_id}", response_model=schemas.WaypointShow)
async def waypoints_patch_single(
    waypoint_id: str,
    waypoint_in: schemas.WaypointBase,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Requires Admin
    if requester.role != 1:
        raise HTTPException(status_code=403)

    waypoint = None

    # Check for waypoint by UUID
    try:
        waypoint = db.query(models.Waypoint).filter(models.Waypoint.id == uuid.UUID(waypoint_id)).first()
    except:
        pass

    if waypoint is None:
        raise HTTPException(status_code=404, detail="A waypoint with that ID does not exist.")
    
    try:
        waypoint.name = waypoint_in.name
        waypoint.pos_x = waypoint_in.pos_x
        waypoint.pos_y = waypoint_in.pos_y
        db.commit()
    except:
        raise HTTPException(status_code=500)

    return waypoint

# Admin ============= PATCH Waypoint: Single Position Only
@router.patch("/{waypoint_id}/position", response_model=schemas.AnchorShow)
async def waypoints_patch_single_position(
    waypoint_id: str,
    waypoint_in: schemas.WaypointPosition,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Requires Admin
    if requester.role != 1:
        raise HTTPException(status_code=403)

    waypoint = None

    # Check for anchor by UUID
    try:
        waypoint = db.query(models.Waypoint).filter(models.Waypoint.id == uuid.UUID(waypoint_id)).first()
    except:
        pass

    if waypoint is None:
        raise HTTPException(status_code=404, detail="A waypoint with that ID does not exist.")
    
    try:
        waypoint.pos_x = waypoint_in.pos_x
        waypoint.pos_y = waypoint_in.pos_y
        db.commit()
    except:
        raise HTTPException(status_code=500)

    return waypoint

###############################################
#                                             
#              DELETE Operations              
#                                             
###############################################

# Admin ============= Delete Waypoint: Single
@router.delete("/{waypoint_id}", response_model=schemas.WaypointShow)
async def waypoints_delete_single(
    waypoint_id: str,
    requester: Annotated[schemas.UserShow, Depends(auth.authenticate_token)],
    db: Session = Depends(database.get)
):
    # Must be administrator to perform this action
    if requester.role != 1:
        raise HTTPException(status_code=403)

    waypoint = None

    # Check for waypoint by UUID
    try:
        waypoint = db.query(models.Waypoint).filter(models.Waypoint.id == uuid.UUID(waypoint_id)).first()
    except:
        pass

    # A waypoint is not found with the given uuid
    if waypoint is None:
        raise HTTPException(status_code=404, detail="A waypoint with that ID does not exist.")
    
    try:
        db.delete(waypoint)
        db.commit()
    except:
        raise HTTPException(status_code=500)

    return waypoint