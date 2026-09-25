from typing import Optional

from pydantic import BaseModel


class DNSRecordCreate(BaseModel):
    hosted_zone_id: int
    name: str
    type: str
    value: str
    ttl: int = 300


class DNSRecordResponse(BaseModel):
    id: int
    hosted_zone_id: int
    name: str
    type: str
    value: str
    ttl: int

    class Config:
        from_attributes = True


class DNSRecordUpdate(BaseModel):
    name: str
    type: str
    value: str
    ttl: int = 300