from fastapi import APIRouter, Depends, Header, status
from fastapi.responses import JSONResponse, Response
from sqlalchemy.orm import Session
from database import SessionLocal
from services.revision_service import create_revision, fetch_revisions_by_owner, get_revision_by_id, update_revision, delete_revision
from utils.jwt_handler import decode_token

router = APIRouter(prefix="/revisions", tags=["Revisions"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", status_code=status.HTTP_200_OK)
def list_revisions(db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    owner_id = int(user.get("id"))
    revs = fetch_revisions_by_owner(db, owner_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=[r.to_dict() for r in revs])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_revision_endpoint(payload: dict, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    owner_id = int(user.get("id"))
    rev = create_revision(db, owner_id, payload)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=rev.to_dict())


@router.patch("/{rev_id}", status_code=status.HTTP_200_OK)
def patch_revision_endpoint(rev_id: int, payload: dict, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    rev = get_revision_by_id(db, rev_id)
    if not rev:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"message": "Revis\u00e3o n\u00e3o encontrada."})

    if rev.owner_id != int(user.get("id")):
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    updated = update_revision(db, rev, payload)
    return JSONResponse(status_code=status.HTTP_200_OK, content=updated.to_dict())


@router.delete("/{rev_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_revision_endpoint(rev_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    if not authorization:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    token = authorization.split(" ")[-1]
    user = decode_token(token)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    rev = get_revision_by_id(db, rev_id)
    if not rev:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"message": "Revis\u00e3o n\u00e3o encontrada."})

    if rev.owner_id != int(user.get("id")):
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "N\u00e3o autorizado."})

    delete_revision(db, rev)
    return Response(status_code=status.HTTP_204_NO_CONTENT, content=None)
