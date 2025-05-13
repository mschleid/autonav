import bcrypt
import jwt
from typing import Annotated
from datetime import datetime, timedelta, timezone
from autonav_secrets import JWT_SECRET, JWT_ALGORITHM, JWT_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestFormStrict
from sqlalchemy.orm import Session
from typing import Annotated
import database
import schemas
import models

router = APIRouter()

# Define OAuth2 Parameters
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/token")

def str_to_bits(*args):
    return tuple(s.encode('utf-8') for s in args)

def bits_to_str(*args):
  return tuple(b.decode('utf-8') for b in args)

def hash_password(plaintext_password: str) -> str:
  salt = bcrypt.gensalt()
  return bits_to_str(bcrypt.hashpw(*str_to_bits(plaintext_password), salt))[0]

def verify_password(plaintext_password: str, hashed_password: str) -> bool:
  return bcrypt.checkpw(*str_to_bits(plaintext_password, hashed_password))

def create_token(data: dict, expires_delta: timedelta | None = None):
  to_encode = data.copy()

  if expires_delta:
    expire = datetime.now(timezone.utc) + expires_delta
  else:
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
  
  to_encode.update({"exp": expire})
  encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
  
  return encoded_jwt
    
def decode_token(token: str):
  try:
    payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    return payload
  except:
    return None
  
@router.post("/token", response_model=schemas.Token)
async def token_get(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestFormStrict, Depends()],
    db: Session = Depends(database.get)
): 
    # Check for user by username
    user = db.query(models.User).filter(models.User.username == form_data.username).first()

    # If no results, try looking up user by email
    if user is None:
        user = db.query(models.User).filter(models.User.email == form_data.username).first()


    if user is None:
        raise HTTPException(status_code=400, detail="Invalid credentials.", headers={"WWW_Authenticate": "Bearer"})
    
    if user.disabled:
        raise HTTPException(status_code=403, detail="This account is disabled.", headers={"WWW_Authenticate": "Bearer"})

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials.", headers={"WWW_Authenticate": "Bearer"})

    expiration = timedelta(minutes=JWT_TOKEN_EXPIRE_MINUTES)

    token = create_token(
        data={"sub":user.username},
        expires_delta=expiration
        )

    ret = schemas.Token(
        access_token = token,
        token_type = "bearer"
    )

    response.set_cookie(
        "bt",
        value={token},
        httponly=True,
        secure=True,
        samesite="none",
        max_age=1800,
        expires=1800
    )

    return ret

async def authenticate_token(
    token: Annotated[str, Depends(oauth2_scheme)], 
    db: Session = Depends(database.get)
):
    creds_exception = HTTPException(
        status_code=401,
        detail="Missing, invalid, or expired token.",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = decode_token(str(token))
        username: str = payload.get("sub")
        if username is None:
            raise creds_exception
    except:
        raise creds_exception
    
    user = db.query(models.User).filter(models.User.username == username).first()

    if user is None:
        raise creds_exception

    if user.disabled:
        raise HTTPException(status_code=400, detail="This account is disabled.", headers={"WWW_Authenticate": "Bearer"})
    
    return user