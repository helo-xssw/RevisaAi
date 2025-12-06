from sqlalchemy.orm import Session
from models.moto import Moto
import datetime


def create_moto(db: Session, owner_id: int, moto_data):
    next_rev = None
    if getattr(moto_data, 'nextRevisionDate', None):
        try:
            # support ISO format
            next_rev = datetime.datetime.fromisoformat(moto_data.nextRevisionDate.replace('Z', '+00:00'))
        except Exception:
            next_rev = None

    moto = Moto(
        name=moto_data.name,
        brand=moto_data.brand,
        model=getattr(moto_data, 'model', None),
        year=getattr(moto_data, 'year', None) or None,
        km=getattr(moto_data, 'km', None) or 0,
        plate=getattr(moto_data, 'plate', None),
        color=getattr(moto_data, 'color', None),
        nextRevisionDate=next_rev,
        owner_id=owner_id
    )

    db.add(moto)
    db.commit()
    db.refresh(moto)
    return moto


def update_moto(db: Session, moto: Moto, data: dict):
    # apply partial updates
    for k, v in data.items():
        if k == 'nextRevisionDate' and v:
            try:
                setattr(moto, k, datetime.datetime.fromisoformat(v.replace('Z', '+00:00')))
            except Exception:
                continue
        elif hasattr(moto, k):
            setattr(moto, k, v)

    db.commit()
    db.refresh(moto)
    return moto


def fetch_motos_by_owner(db: Session, owner_id: int):
    return db.query(Moto).filter(Moto.owner_id == owner_id).all()


def get_moto_by_id(db: Session, moto_id: int):
    return db.query(Moto).filter(Moto.id == moto_id).first()


def delete_moto(db: Session, moto: Moto):
    db.delete(moto)
    db.commit()
