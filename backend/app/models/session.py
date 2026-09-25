from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

from app.core.database import Base


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)

    token = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )