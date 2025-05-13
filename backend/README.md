# backend

The backend is written in FastAPI and connects to a MariaDB database. If the database tables do not exist, they will be created on the first launch of the server.

## Backend Errata

The backend uses a models and schemas to define object models.

---

**Models** - Define API JSON input types via Pydantic

**Schemas** - Define database table models via SQLAlchemy

---

For example, the `User` Schema for the database is defined as:

```
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
```

In contrast, the Pydantic models define how the API will recieve data via an HTTP request's JSON body.

For example UserBase Pydantic model is defined as:

```
class UserBase(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    role: int = 0
    disabled: bool = False
```

This is the base model of a user, and other calls such as `UserCreate` or `UserShow` add additional fields for their respective calls. In example, `UserCreate` adds a password field to the UserBase model.

## Authentication

Authentication is done using JWT authentication tokens. All API calls should be authenticated with the `Authorization` HTTP header, of type `Bearer`.

## Backend environment

The backend environemnt should be established using a python3 virtual environment, like `python3 -m venv backend`.

See `requirements.txt` for the list of required packages.

## Running The Backend

The production server is run using the following systemd service unit at `/etc/systemd/system/autonav-backend.service`

```
[Unit]
Description=Autonav Backend Service
After=network.target

[Service]
User=autonav
Group=autonav

WorkingDirectory={Backend VENV Directory here}

ExecStart={Backend VENV Directory here}/bin/python3 -m fastapi run

Restart=on-failure

StandardOutput=file:{AUTONAV LOG DIRECTORY}backend_latest.log
StandardError=file:{AUTONAV LOG DIRECTORY}/backend_error.log

[Install]
WantedBy=multi-user.target
```

Note that the working directory and log directory depend on your setup. In our case, it was `/opt/autonav/backend` and `/opt/autonav/logs`, respectively.

## Secrets File

The secrets file contains secrets and should ALWAYS be added to the .gitignore if running on a local machine. It was included in this repository to provide an example layout, but the sensitive information has been taken out. Take a look at that file for what information is required.
