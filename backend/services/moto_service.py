from sqlalchemy.orm import Session
from models.moto import Moto
import datetime


def create_moto(db: Session, owner_id: int, moto_data):
    next_rev = None
    if moto_data.nextRevisionDate:
        try:
            # support ISO format
            next_rev = datetime.datetime.fromisoformat(moto_data.nextRevisionDate.replace('Z', '+00:00'))
        except Exception:
            next_rev = None

    moto = Moto(
        name=moto_data.name,
        brand=moto_data.brand,
        year=moto_data.year,
        km=moto_data.km,
        nextRevisionDate=next_rev,
        owner_id=owner_id
    )

    db.add(moto)
    db.commit()
    db.refresh(moto)
    return moto


def fetch_motos_by_owner(db: Session, owner_id: int):
    return db.query(Moto).filter(Moto.owner_id == owner_id).all()
