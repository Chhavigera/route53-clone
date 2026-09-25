from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine, SessionLocal
from app.models.user import User
from app.routers import auth, hosted_zones, dns_records


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Route 53 Clone API",
    version="1.0.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://route53-clone-iota.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routers
app.include_router(auth.router)
app.include_router(hosted_zones.router)
app.include_router(dns_records.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/")
def root():
    return {
        "message": "Route 53 Clone API is running"
    }