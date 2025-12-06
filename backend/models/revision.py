from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Revision(Base):
    __tablename__ = "revisions"

    id = Column(Integer, primary_key=True, index=True)
    moto_id = Column(Integer, ForeignKey('motos.id'))
    title = Column(String, nullable=False)
    service = Column(String, nullable=False)
    details = Column(String, nullable=True)
    date = Column(DateTime, nullable=True)
    time = Column(String, nullable=True)
    km = Column(Integer, nullable=True)
    autoReminderEnabled = Column(Boolean, default=False)
    autoReminderInterval = Column(String, nullable=True)
    status = Column(String, nullable=False)
    owner_id = Column(Integer, nullable=False)

    def to_dict(self):
        return {
            'id': str(self.id),
            'motoId': self.moto_id,
            'title': self.title,
            'service': self.service,
            'details': self.details,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time,
            'km': self.km,
            'autoReminderEnabled': self.autoReminderEnabled,
            'autoReminderInterval': self.autoReminderInterval,
            'status': self.status
        }