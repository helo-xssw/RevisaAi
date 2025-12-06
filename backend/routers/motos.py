from fastapi import APIRouter, Depends, Header, status
from fastapi.responses import JSONResponse, Response
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas.moto_schema import MotoCreate
from services.moto_service import create_moto, fetch_motos_by_owner, get_moto_by_id, delete_moto
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


@router.put("/{moto_id}", status_code=status.HTTP_200_OK)
def update_moto_endpoint(moto_id: int, payload: dict, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})

    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        logger.warning("Token inválido ou expirado")
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})

    moto = get_moto_by_id(db, moto_id)
    if not moto:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"message": "Moto não encontrada."})

    if moto.owner_id != int(user.get("id")):
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})

    from services.moto_service import update_moto
    updated = update_moto(db, moto, payload)
    return JSONResponse(status_code=status.HTTP_200_OK, content=updated.to_dict())


@router.delete("/{moto_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_moto_endpoint(moto_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})

    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        logger.warning("Token inválido ou expirado")
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})

    moto = get_moto_by_id(db, moto_id)
    if not moto:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"message": "Moto não encontrada."})

    # verificar propriedade
    if moto.owner_id != int(user.get("id")):
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})

    delete_moto(db, moto)
    return Response(status_code=status.HTTP_204_NO_CONTENT, content=None)
