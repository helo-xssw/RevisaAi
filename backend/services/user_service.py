from sqlalchemy.orm import Session
from models.user import User
import bcrypt

def email_exists(db: Session, email: str):
    return db.query(User).filter(User.email == email).first() is not None


def create_user(db: Session, user_data):
    hashed = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())

    user = User(
        name=user_data.name,
        email=user_data.email.lower(),
        password=hashed.decode('utf-8')
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return None

    return user
