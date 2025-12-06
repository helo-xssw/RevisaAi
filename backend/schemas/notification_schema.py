from pydantic import BaseModel
from typing import Optional

class NotificationCreate(BaseModel):
    motoId: Optional[int] = None
    revisionId: Optional[int] = None
    title: str
    description: Optional[str] = None
    status: Optional[str] = None

class NotificationUpdate(BaseModel):
    motoId: Optional[int] = None
    revisionId: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
