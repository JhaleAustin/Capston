from pydantic import BaseModel, EmailStr
from typing import Optional


class SupplierCreateSchema(BaseModel):
    companyName: str
    contactPerson: str
    email: EmailStr
    phone: str
    address: str


class SupplierUpdateSchema(BaseModel):
    companyName: Optional[str] = None
    contactPerson: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    status: Optional[str] = None