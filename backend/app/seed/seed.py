from app.core.database import SessionLocal
from app.models.user import User


def seed_user():
    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == "admin@example.com"
    ).first()

    if existing_user:
        db.close()
        return

    user = User(
        name="Admin User",
        email="admin@example.com",
        password="password123"
    )

    db.add(user)
    db.commit()
    db.close()


if __name__ == "__main__":
    seed_user()
    print("Seed user created successfully.")