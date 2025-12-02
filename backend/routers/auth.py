from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from schemas.user_schema import UserLogin
from services.user_service import authenticate_user
from utils.jwt_handler import create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):

    if not credentials.email or not credentials.password:
        return {"success": False, "error": "Email e senha são obrigatórios."}

    if len(credentials.password) < 4:
        return {"success": False, "error": "A senha deve ter no mínimo 4 caracteres."}

    user = authenticate_user(db, credentials.email, credentials.password)

    if not user:
        return {"success": False, "error": "E-mail ou senha incorretos."}

    token = create_token({"id": user.id, "email": user.email})

    return {
        "success": True,
        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
        },
        "token": token
    }
