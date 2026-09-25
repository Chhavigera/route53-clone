from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.dns_record import (
    DNSRecordCreate,
    DNSRecordResponse,
    DNSRecordUpdate
)
from app.services.dns_record_service import (
    create_dns_record,
    get_dns_records,
    get_dns_record,
    update_dns_record,
    delete_dns_record
)


router = APIRouter(
    prefix="/dns-records",
    tags=["DNS Records"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "",
    response_model=DNSRecordResponse,
    status_code=201
)
def create_record(
    record_data: DNSRecordCreate,
    db: Session = Depends(get_db)
):
    return create_dns_record(db, record_data)


@router.get(
    "/zone/{hosted_zone_id}",
    response_model=List[DNSRecordResponse]
)
def list_records(
    hosted_zone_id: int,
    db: Session = Depends(get_db)
):
    return get_dns_records(db, hosted_zone_id)


@router.get(
    "/{record_id}",
    response_model=DNSRecordResponse
)
def get_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    record = get_dns_record(db, record_id)

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found"
        )

    return record


@router.put(
    "/{record_id}",
    response_model=DNSRecordResponse
)
def update_record(
    record_id: int,
    record_data: DNSRecordUpdate,
    db: Session = Depends(get_db)
):
    record = update_dns_record(
        db,
        record_id,
        record_data
    )

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found"
        )

    return record


@router.delete(
    "/{record_id}"
)
def delete_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_dns_record(
        db,
        record_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found"
        )

    return {
        "message": "DNS record deleted successfully"
    }