from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base


class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(Integer, primary_key=True, index=True)
    hosted_zone_id = Column(
        Integer,
        ForeignKey("hosted_zones.id"),
        nullable=False,
        index=True
    )
    name = Column(String, nullable=False, index=True)
    type = Column(String, nullable=False)
    value = Column(String, nullable=False)
    ttl = Column(Integer, nullable=False, default=300)