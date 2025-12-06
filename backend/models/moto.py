from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime


class Moto(Base):
    __tablename__ = "motos"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    km = Column(Integer, nullable=True)
    plate = Column(String, nullable=True)
    color = Column(String, nullable=True)
    nextRevisionDate = Column(DateTime, nullable=True)
    owner_id = Column(Integer, ForeignKey('users.id'))

    owner = relationship('User', back_populates='motos')

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'brand': self.brand,
            'model': self.model,
            'year': self.year,
            'km': self.km,
            'plate': self.plate,
            'color': self.color,
            'nextRevisionDate': self.nextRevisionDate.isoformat() if self.nextRevisionDate else None
        }
