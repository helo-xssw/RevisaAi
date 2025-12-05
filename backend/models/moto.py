from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime


class Moto(Base):
    __tablename__ = "motos"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    km = Column(Integer, nullable=False)
    nextRevisionDate = Column(DateTime, nullable=True)
    owner_id = Column(Integer, ForeignKey('users.id'))

    owner = relationship('User', back_populates='motos')

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'brand': self.brand,
            'year': self.year,
            'km': self.km,
            'nextRevisionDate': self.nextRevisionDate.isoformat() if self.nextRevisionDate else None
        }
