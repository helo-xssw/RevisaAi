from sqlalchemy.orm import Session
from models.user import User
import bcrypt

def email_exists(db: Session, email: str):
    return db.query(User).filter(User.email == email).first() is not None

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return None

    return user
