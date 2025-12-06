from sqlalchemy.orm import Session
from models.notification import Notification


def create_notification(db: Session, owner_id: int, data: dict):
    notif = Notification(
        moto_id=data.get('motoId'),
        revision_id=data.get('revisionId'),
        title=data.get('title'),
        description=data.get('description'),
        status=data.get('status', 'pending'),
        owner_id=owner_id
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def fetch_notifications_by_owner(db: Session, owner_id: int):
    return db.query(Notification).filter(Notification.owner_id == owner_id).all()


def get_notification_by_id(db: Session, notif_id: int):
    return db.query(Notification).filter(Notification.id == notif_id).first()


def update_notification(db: Session, notif: Notification, data: dict):
    for k, v in data.items():
        if hasattr(notif, k):
            setattr(notif, k, v)
    db.commit()
    db.refresh(notif)
    return notif


def delete_notification(db: Session, notif: Notification):
    db.delete(notif)
    db.commit()


def delete_notifications_by_revision(db: Session, revision_id: int):
    db.query(Notification).filter(Notification.revision_id == revision_id).delete()
    db.commit()


def update_status_by_revision(db: Session, revision_id: int, status: str):
    db.query(Notification).filter(Notification.revision_id == revision_id).update({"status": status})
    db.commit()