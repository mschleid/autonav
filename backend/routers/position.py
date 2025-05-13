from fastapi import Depends, HTTPException, APIRouter, Request
from sqlalchemy.orm import Session
from typing import Annotated, List
import schemas
import database
import models
import time


router = APIRouter()

# POST position
@router.post("")
async def post_position(
    data_in: schemas.TagPosition,
    db: Session = Depends(database.get)
):
    tag = None

    # Check for tag by UUID
    try:
        tag = db.query(models.Tag).filter(models.Tag.address == data_in.address).first()
    except:
        pass

    # A tag is not found with the given uuid
    if tag is None:
        raise HTTPException(status_code=404, detail="A tag with that ID does not exist.")

    try:
        tag.pos_x = data_in.pos_x
        tag.pos_y = data_in.pos_y
        tag.last_contact = time.strftime('%Y-%m-%d %H:%M:%S')
        db.commit()
    except:
        raise HTTPException(status_code=500)

    return tag