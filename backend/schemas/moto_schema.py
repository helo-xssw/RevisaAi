from pydantic import BaseModel
from typing import Optional

class MotoCreate(BaseModel):
    name: str
    brand: str
    year: int
    km: int
    nextRevisionDate: Optional[str] = None

class MotoResponse(BaseModel):
    id: str
    name: str
    brand: str
    year: int
    km: int
    nextRevisionDate: Optional[str] = None

    class Config:
        from_attributes = True
