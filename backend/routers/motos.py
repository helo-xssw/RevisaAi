from fastapi import APIRouter, Depends, Header, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas.moto_schema import MotoCreate
from services.moto_service import create_moto, fetch_motos_by_owner
from utils.jwt_handler import decode_token
import logging

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/motos", tags=["Motos"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_moto_endpoint(moto: MotoCreate, db: Session = Depends(get_db), authorization: str = Header(None)):
    # Autenticação: espera um header Authorization: Bearer <token>
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})

    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        logger.warning("Token inválido ou expirado")
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})

    new_moto = create_moto(db, int(user.get("id")), moto)

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=new_moto.to_dict())


@router.get("", status_code=status.HTTP_200_OK)
def list_motos_endpoint(db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})

    token = authorization.split(" ")[-1]
    logger.info(f"Authorization header = {authorization}")
    logger.info(f"Extracted token = {token}")
    user = decode_token(token)
    logger.info(f"Decoded token = {user}")
    if not user:
        logger.warning("Token inválido ou expirado")
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})

    owner_id = int(user.get("id"))
    motos = fetch_motos_by_owner(db, owner_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=[m.to_dict() for m in motos])
