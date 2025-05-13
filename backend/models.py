import uuid
from sqlalchemy import Column
from sqlalchemy.types import UUID, Integer, VARCHAR, Boolean, DateTime, FLOAT
import database

class User(database.Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, default=lambda: uuid.uuid4())
    username = Column(VARCHAR(50), unique=True, index=True, nullable=False)
    hashed_password = Column(VARCHAR(128), nullable=False)
    first_name = Column(VARCHAR(50), nullable=False)
    last_name = Column(VARCHAR(50), nullable=False)
    email = Column(VARCHAR(100), unique=True, index=True, nullable=False)
    role = Column(Integer, default=0, nullable=False) # 0 Default, 1=admin
    disabled = Column(Boolean, nullable=False, default=False)

class Tag(database.Base):
    __tablename__ = "tags"
    id = Column(UUID, primary_key=True, default=lambda: uuid.uuid4())
    name = Column(VARCHAR(50), unique=True, nullable=False)
    address = Column(VARCHAR(23), unique=True, nullable=False)
    pos_x = Column(FLOAT, nullable=True)
    pos_y = Column(FLOAT, nullable=True)
    last_contact = Column(DateTime(timezone=True), nullable=True)

class Anchor(database.Base):
    __tablename__ = "anchors"
    id = Column(UUID, primary_key=True, default=lambda: uuid.uuid4())
    name = Column(VARCHAR(50), unique=True, nullable=True)
    address = Column(VARCHAR(30), unique=True, nullable=False)
    height = Column(FLOAT, nullable=False, default=0.0)
    pos_x = Column(FLOAT, nullable=False, default=0.0)
    pos_y = Column(FLOAT, nullable=False, default=0.0)

class Waypoint(database.Base):
    __tablename__ = "waypoints"
    id = Column(UUID, primary_key=True, default=lambda: uuid.uuid4())
    name = Column(VARCHAR(50), unique=True, nullable=True)
    pos_x = Column(FLOAT, nullable=False, default=0.0)
    pos_y = Column(FLOAT, nullable=False, default=0.0)
