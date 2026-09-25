from pathlib import Path
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = Path(__file__).resolve().parent.parent.parent

volume_path = os.getenv("RAILWAY_VOLUME_MOUNT_PATH")

if volume_path:
    DATABASE_PATH = Path(volume_path) / "route53.db"
else:
    DATABASE_PATH = BASE_DIR / "route53.db"

DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()
