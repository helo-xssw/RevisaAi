from fastapi import APIRouter, Depends, Header, status
from fastapi.responses import JSONResponse, Response
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas.user_schema import UserCreate
from services.user_service import create_user, get_user_by_id, delete_user, update_user
from utils.jwt_handler import decode_token

router = APIRouter(prefix="/users", tags=["Users"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.put("/{user_id}", status_code=status.HTTP_200_OK)
def update_user_endpoint(user_id: int, payload: dict, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user or int(user.get("id")) != user_id:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"message": "Usu\u00e1rio n\u00e3o encontrado."})

    updated = update_user(db, db_user, payload)
    return JSONResponse(status_code=status.HTTP_200_OK, content={
        "id": str(updated.id),
        "name": updated.name,
        "email": updated.email,
        "avatarUrl": getattr(updated, 'avatarUrl', None)
    })


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_endpoint(user_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user or int(user.get("id")) != user_id:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"message": "Usu\u00e1rio n\u00e3o encontrado."})

    delete_user(db, db_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT, content=None)
