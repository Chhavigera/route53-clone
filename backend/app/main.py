from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

from app.models.hosted_zone import HostedZone
from app.models.dns_record import DNSRecord
from app.models.user import User
from app.models.session import Session

from app.routers.hosted_zones import router as hosted_zones_router
from app.routers.dns_records import router as dns_records_router
from app.routers.auth import router as auth_router


Base.metadata.create_all(bind=engine)


app = FastAPI(title="AWS Route53 Clone")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(hosted_zones_router)
app.include_router(dns_records_router)
app.include_router(auth_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}