#@@@@@ Library Imports
from autonav_secrets import JWT_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import Annotated, List
import routers.waypoints
import schemas
import database
import routers.auth
import routers.users
import routers.tags
import routers.anchors
import routers.waypoints
import routers.position
import models
import uuid

#@@@@@ Application Setup
# Create database tables
database.Base.metadata.create_all(bind=database.engine)

# Set Global Version Identifiers
version = schemas.VersionBase(version="v1")

# Create FastAPI Application
app = FastAPI()

# CORS Middleware
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(routers.auth.router)

app.include_router(
    routers.users.router,
    prefix="/users"
)
app.include_router(
    routers.tags.router,
    prefix="/tags"
)
app.include_router(
    routers.anchors.router,
    prefix="/anchors"
)
app.include_router(
    routers.waypoints.router,
    prefix="/waypoints"
)
app.include_router(
    routers.position.router,
    prefix="/position"
)

@app.get("/version", response_model=schemas.VersionGet)
async def get_version():
    return version
