from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from uuid import UUID

class Token(BaseModel):
    access_token: str
    token_type: str

class VersionBase(BaseModel):
    version: str

class VersionGet(VersionBase):
    pass

###### USERS

class UserBase(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    role: int = 0
    disabled: bool = False

class UserCreate(UserBase):
    password: str

class UserShow(UserBase):
    id: UUID

class UserUpdateMe(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr

class UserUpdatePasswordMe(BaseModel):
    current_password: str
    new_password: str

class UserUpdatePassword(BaseModel):
    new_password: str

###### TAGS

class TagBase(BaseModel):
    name: str
    address: str
    
class TagShow(TagBase):
    id: UUID
    pos_x: Optional[float] = None
    pos_y: Optional[float] = None
    last_contact: Optional[datetime] = None


###### ANCHORS

class AnchorBase(BaseModel):
    name: str
    address: str
    height: float
    pos_x: float
    pos_y: float

class AnchorShow(AnchorBase):
    id: UUID

class AnchorPosition(BaseModel):
    pos_x: float
    pos_y: float


###### WAYPOINTS

class WaypointBase(BaseModel):
    name: Optional[str] = None
    pos_x: float
    pos_y: float

class WaypointShow(WaypointBase):
    id: UUID

class WaypointPosition(BaseModel):
    pos_x: float
    pos_y: float


#### POSITION
class TagPosition(BaseModel):
    address: str
    pos_x: float
    pos_y: float