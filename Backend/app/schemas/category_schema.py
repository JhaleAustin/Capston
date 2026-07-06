from pydantic import BaseModel
from typing import Optional


class CategoryCreateSchema(BaseModel):
    name: str
    description: str


class CategoryUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None