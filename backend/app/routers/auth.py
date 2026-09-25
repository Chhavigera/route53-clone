from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.user import LoginRequest, LoginResponse, UserResponse

from app.services.auth_service import (
    login_user,
    get_user_from_token,
    logout_user
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/login", response_model=LoginResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    result = login_user(db, login_data)

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    user, token = result

    return {
        "user": user,
        "token": token
    }


@router.get("/me", response_model=UserResponse)
def get_current_user(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = authorization.replace("Bearer ", "", 1)

    user = get_user_from_token(db, token)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session"
        )

    return user


@router.post("/logout")
def logout(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = authorization.replace("Bearer ", "", 1)

    logged_out = logout_user(db, token)

    if not logged_out:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session"
        )

    return {
        "message": "Logged out successfully"
    }