from pydantic import BaseModel
from typing import List


class SaleItem(BaseModel):
    itemId: str
    quantity: int


class SaleCreateSchema(BaseModel):
    customerName: str
    cashierId: str
    cashierName: str
    paymentMethod: str
    amountPaid: float
    discount: float = 0
    tax: float = 0
    items: List[SaleItem]