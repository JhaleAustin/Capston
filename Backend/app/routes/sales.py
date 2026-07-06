from fastapi import APIRouter, Depends

from app.core.security import admin_or_staff
from app.schemas.sales_schema import SaleCreateSchema

from app.services.sales_service import (
    create_sale,
    get_all_sales,
    get_sale,
    delete_sale,
    daily_sales,
    monthly_sales,
    best_selling
)

router = APIRouter()


@router.post("/")
def create(
    data: SaleCreateSchema,
    current_user=Depends(admin_or_staff)
):
    return create_sale(data)


@router.get("/")
def get_all(
    current_user=Depends(admin_or_staff)
):
    return get_all_sales()


@router.get("/{sale_id}")
def get_one(
    sale_id: str,
    current_user=Depends(admin_or_staff)
):
    return get_sale(sale_id)


@router.delete("/{sale_id}")
def delete(
    sale_id: str,
    current_user=Depends(admin_or_staff)
):
    return delete_sale(sale_id)


@router.get("/daily/report")
def daily(
    current_user=Depends(admin_or_staff)
):
    return daily_sales()


@router.get("/monthly/report")
def monthly(
    current_user=Depends(admin_or_staff)
):
    return monthly_sales()


@router.get("/best-selling")
def best(
    current_user=Depends(admin_or_staff)
):
    return best_selling()