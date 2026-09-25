from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.hosted_zone import (
    HostedZoneCreate,
    HostedZoneResponse,
    HostedZoneUpdate
)
from app.services.hosted_zone_service import (
    create_hosted_zone,
    get_hosted_zones,
    get_hosted_zone,
    update_hosted_zone,
    delete_hosted_zone
)


router = APIRouter(
    prefix="/hosted-zones",
    tags=["Hosted Zones"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "",
    response_model=HostedZoneResponse,
    status_code=201
)
def create_zone(
    zone_data: HostedZoneCreate,
    db: Session = Depends(get_db)
):
    return create_hosted_zone(db, zone_data)


@router.get(
    "",
    response_model=List[HostedZoneResponse]
)
def list_hosted_zones(
    db: Session = Depends(get_db)
):
    return get_hosted_zones(db)


@router.get(
    "/{zone_id}",
    response_model=HostedZoneResponse
)
def get_zone(
    zone_id: int,
    db: Session = Depends(get_db)
):
    zone = get_hosted_zone(db, zone_id)

    if zone is None:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found"
        )

    return zone


@router.put(
    "/{zone_id}",
    response_model=HostedZoneResponse
)
def update_zone(
    zone_id: int,
    zone_data: HostedZoneUpdate,
    db: Session = Depends(get_db)
):
    zone = update_hosted_zone(
        db,
        zone_id,
        zone_data
    )

    if zone is None:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found"
        )

    return zone


@router.delete(
    "/{zone_id}"
)
def delete_zone(
    zone_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_hosted_zone(
        db,
        zone_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found"
        )

    return {
        "message": "Hosted zone deleted successfully"
    }