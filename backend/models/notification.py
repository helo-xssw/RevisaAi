from sqlalchemy import Column, Integer, String, DateTime
from database import Base
import datetime

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    moto_id = Column(Integer, nullable=True)
    revision_id = Column(Integer, nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, nullable=False, default='pending')
    owner_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'motoId': self.moto_id,
            'revisionId': self.revision_id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }