from typing import Optional

from sqlalchemy.orm import Session

from app.models.hosted_zone import HostedZone
from app.models.dns_record import DNSRecord
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate


def create_hosted_zone(
    db: Session,
    zone_data: HostedZoneCreate
) -> HostedZone:

    zone = HostedZone(
        name=zone_data.name,
        type=zone_data.type,
        description=zone_data.description
    )

    db.add(zone)
    db.commit()
    db.refresh(zone)

    return zone


def get_hosted_zones(db: Session) -> list[HostedZone]:
    return db.query(HostedZone).all()


def get_hosted_zone(
    db: Session,
    zone_id: int
) -> Optional[HostedZone]:

    return (
        db.query(HostedZone)
        .filter(HostedZone.id == zone_id)
        .first()
    )


def update_hosted_zone(
    db: Session,
    zone_id: int,
    zone_data: HostedZoneUpdate
) -> Optional[HostedZone]:

    zone = (
        db.query(HostedZone)
        .filter(HostedZone.id == zone_id)
        .first()
    )

    if zone is None:
        return None

    zone.name = zone_data.name
    zone.type = zone_data.type
    zone.description = zone_data.description

    db.commit()
    db.refresh(zone)

    return zone


def delete_hosted_zone(
    db: Session,
    zone_id: int
) -> bool:

    zone = (
        db.query(HostedZone)
        .filter(HostedZone.id == zone_id)
        .first()
    )

    if zone is None:
        return False

    # Delete all DNS records belonging to this hosted zone first.
    db.query(DNSRecord).filter(
        DNSRecord.hosted_zone_id == zone_id
    ).delete(
        synchronize_session=False
    )

    # Then delete the hosted zone.
    db.delete(zone)

    db.commit()

    return True