from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base


class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    type = Column(String, nullable=False)
    description = Column(Text, nullable=True)