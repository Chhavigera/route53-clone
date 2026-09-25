import secrets
from typing import Optional, Tuple

from sqlalchemy.orm import Session as DBSession

from app.models.user import User
from app.models.session import Session
from app.schemas.user import LoginRequest


def login_user(
    db: DBSession,
    login_data: LoginRequest
) -> Optional[Tuple[User, str]]:

    user = db.query(User).filter(
        User.email == login_data.email,
        User.password == login_data.password
    ).first()

    if user is None:
        return None

    token = secrets.token_urlsafe(32)

    new_session = Session(
        token=token,
        user_id=user.id
    )

    db.add(new_session)
    db.commit()

    return user, token


def get_user_from_token(
    db: DBSession,
    token: str
) -> Optional[User]:

    session = db.query(Session).filter(
        Session.token == token
    ).first()

    if session is None:
        return None

    user = db.query(User).filter(
        User.id == session.user_id
    ).first()

    return user


def logout_user(
    db: DBSession,
    token: str
) -> bool:

    session = db.query(Session).filter(
        Session.token == token
    ).first()

    if session is None:
        return False

    db.delete(session)
    db.commit()

    return True