from typing import Optional
from pydantic import BaseModel


class HostedZoneCreate(BaseModel):
    name: str
    type: str
    description: Optional[str] = None


class HostedZoneResponse(BaseModel):
    id: int
    name: str
    type: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class HostedZoneUpdate(BaseModel):
    name: str
    type: str
    description: Optional[str] = None