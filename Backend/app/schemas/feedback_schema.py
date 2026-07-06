from pydantic import BaseModel
from typing import Optional


class FeedbackCreateSchema(BaseModel):
    customerName: str
    email: str
    rating: int
    comment: str


class FeedbackUpdateSchema(BaseModel):
    status: Optional[str] = None