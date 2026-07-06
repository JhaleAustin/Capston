from pydantic import BaseModel
from typing import Optional


class InventoryCreateSchema(BaseModel):
    itemName: str
    categoryId: str
    supplierId: str
    barcode: str
    description: str
    costPrice: float
    sellingPrice: float
    quantity: int
    minimumStock: int
    unit: str
    expirationDate: Optional[str] = None
    imageUrl: Optional[str] = ""


class InventoryUpdateSchema(BaseModel):
    itemName: Optional[str] = None
    categoryId: Optional[str] = None
    supplierId: Optional[str] = None
    barcode: Optional[str] = None
    description: Optional[str] = None
    costPrice: Optional[float] = None
    sellingPrice: Optional[float] = None
    quantity: Optional[int] = None
    minimumStock: Optional[int] = None
    unit: Optional[str] = None
    expirationDate: Optional[str] = None
    imageUrl: Optional[str] = None
    status: Optional[str] = None