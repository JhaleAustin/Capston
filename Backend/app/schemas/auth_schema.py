from pydantic import BaseModel, EmailStr
from typing import Optional

class ProfileUpdateSchema(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    role: str


class LoginSchema(BaseModel):
    email: EmailStr
    password: str