from pydantic import BaseModel
from typing import Optional


class NotificationCreateSchema(BaseModel):
    title: str
    message: str
    type: str


class NotificationUpdateSchema(BaseModel):
    isRead: Optional[bool] = None