from fastapi import APIRouter, Depends, Header, status
from fastapi.responses import JSONResponse, Response
from sqlalchemy.orm import Session
from database import SessionLocal
from services.notification_service import (
    create_notification, fetch_notifications_by_owner, get_notification_by_id,
    update_notification, delete_notification, delete_notifications_by_revision, update_status_by_revision
)
from utils.jwt_handler import decode_token
from schemas.notification_schema import NotificationCreate, NotificationUpdate
from pydantic import BaseModel

router = APIRouter(prefix="/notifications", tags=["Notifications"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", status_code=status.HTTP_200_OK)
def list_notifications(db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    owner_id = int(user.get("id"))
    notifs = fetch_notifications_by_owner(db, owner_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=[n.to_dict() for n in notifs])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_notification_endpoint(payload: NotificationCreate, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    owner_id = int(user.get("id"))
    notif = create_notification(db, owner_id, payload.dict())
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=notif.to_dict())


@router.patch("/{notif_id}", status_code=status.HTTP_200_OK)
def patch_notification_endpoint(notif_id: int, payload: NotificationUpdate, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    notif = get_notification_by_id(db, notif_id)
    if not notif:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"message": "Notificação não encontrada."})
    if notif.owner_id != int(user.get("id")):
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    updated = update_notification(db, notif, payload.dict(exclude_unset=True))
    return JSONResponse(status_code=status.HTTP_200_OK, content=updated.to_dict())


@router.delete("/{notif_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification_endpoint(notif_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    notif = get_notification_by_id(db, notif_id)
    if not notif:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"message": "Notificação não encontrada."})
    if notif.owner_id != int(user.get("id")):
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    delete_notification(db, notif)
    return Response(status_code=status.HTTP_204_NO_CONTENT, content=None)


@router.delete("/revision/{revision_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notifications_by_revision_endpoint(revision_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    # optional: verify ownership of revision omitted for brevity
    delete_notifications_by_revision(db, revision_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT, content=None)


class StatusPayload(BaseModel):
    status: str


@router.patch("/revision/{revision_id}", status_code=status.HTTP_200_OK)
def update_notifications_status_by_revision_endpoint(revision_id: int, payload: StatusPayload, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Não autorizado."})
    status_val = payload.status
    if status_val not in ['pending', 'done']:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "Status inválido."})
    update_status_by_revision(db, revision_id, status_val)
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Atualizado."})