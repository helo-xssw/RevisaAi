from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import SessionLocal
from schemas.user_schema import UserCreate, UserLogin
from services.user_service import create_user, authenticate_user, email_exists
from utils.jwt_handler import create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):

    # Validações exigidas pelo mock
    if not user.name or len(user.name.strip()) < 3:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "O nome deve ter no mínimo 3 caracteres."})

    if email_exists(db, user.email):
        return JSONResponse(status_code=status.HTTP_409_CONFLICT, content={"message": "Este e-mail já está cadastrado."})

    if len(user.password) < 4:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "A senha deve ter pelo menos 4 caracteres."})

    # Criar usuário
    new_user = create_user(db, user)
    token = create_token({"id": new_user.id, "email": new_user.email})

    return JSONResponse(status_code=status.HTTP_201_CREATED, content={
        "user": {
            "id": str(new_user.id),
            "name": new_user.name,
            "email": new_user.email,
        },
        "token": token
    })


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
