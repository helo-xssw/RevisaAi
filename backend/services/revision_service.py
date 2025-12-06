from sqlalchemy.orm import Session
from models.revision import Revision
from models.moto import Moto
import datetime


def create_revision(db: Session, owner_id: int, data: dict):
    # ensure moto belongs to owner
    moto = db.query(Moto).filter(Moto.id == data.get('motoId')).first()
    if not moto or moto.owner_id != owner_id:
        raise Exception('Moto nao encontrada ou sem permissao')

    date = None
    try:
        if data.get('date'):
            date = datetime.datetime.fromisoformat(data.get('date').replace('Z', '+00:00'))
    except Exception:
        date = None

    time = None
    try:
        if data.get('time'):
            time = data.get('time')
    except Exception:
        time = None

    rev = Revision(
        moto_id=data.get('motoId'),
        title=data.get('title'),
        service=data.get('service'),
        details=data.get('details'),
        date=date,
        time=time,
        km=data.get('km', 0),
        autoReminderEnabled=data.get('autoReminderEnabled', False),
        autoReminderInterval=data.get('autoReminderInterval'),
        status='pending',
        owner_id=owner_id
    )

    db.add(rev)
    db.commit()
    db.refresh(rev)
    return rev


def fetch_revisions_by_owner(db: Session, owner_id: int):
    return db.query(Revision).filter(Revision.owner_id == owner_id).all()


def get_revision_by_id(db: Session, rev_id: int):
    return db.query(Revision).filter(Revision.id == rev_id).first()


def update_revision(db: Session, rev: Revision, data: dict):
    for k, v in data.items():
        if hasattr(rev, k):
            setattr(rev, k, v)
    db.commit()
    db.refresh(rev)
    return rev


def delete_revision(db: Session, rev: Revision):
    db.delete(rev)
    db.commit()
