from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from app.config import Config


Base = declarative_base()
engine = create_engine(Config["Env"].database_uri)


def get_db():
    db = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    try:
        yield db()
    finally:
        db().close()
