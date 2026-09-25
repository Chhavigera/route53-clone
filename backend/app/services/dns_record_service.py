from typing import Optional

from sqlalchemy.orm import Session

from app.models.dns_record import DNSRecord
from app.schemas.dns_record import (
    DNSRecordCreate,
    DNSRecordUpdate
)


def create_dns_record(
    db: Session,
    record_data: DNSRecordCreate
) -> DNSRecord:
    record = DNSRecord(
        hosted_zone_id=record_data.hosted_zone_id,
        name=record_data.name,
        type=record_data.type,
        value=record_data.value,
        ttl=record_data.ttl
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


def get_dns_records(
    db: Session,
    hosted_zone_id: int
):
    return db.query(DNSRecord).filter(
        DNSRecord.hosted_zone_id == hosted_zone_id
    ).all()


def get_dns_record(
    db: Session,
    record_id: int
) -> Optional[DNSRecord]:
    return db.query(DNSRecord).filter(
        DNSRecord.id == record_id
    ).first()


def update_dns_record(
    db: Session,
    record_id: int,
    record_data: DNSRecordUpdate
) -> Optional[DNSRecord]:
    record = db.query(DNSRecord).filter(
        DNSRecord.id == record_id
    ).first()

    if record is None:
        return None

    record.name = record_data.name
    record.type = record_data.type
    record.value = record_data.value
    record.ttl = record_data.ttl

    db.commit()
    db.refresh(record)

    return record


def delete_dns_record(
    db: Session,
    record_id: int
) -> bool:
    record = db.query(DNSRecord).filter(
        DNSRecord.id == record_id
    ).first()

    if record is None:
        return False

    db.delete(record)
    db.commit()

    return True