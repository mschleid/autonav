from autonav_secrets import MYSQL_DB, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_USERNAME
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Create a database connection
# Connect to MySQL database using pymysql
# In our case, it is MariaDB
DATABASE_URL = "mysql+pymysql://" + MYSQL_USERNAME + ":" + MYSQL_PASSWORD + "@" + MYSQL_HOST + "/" + MYSQL_DB

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get DB session
def get():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()