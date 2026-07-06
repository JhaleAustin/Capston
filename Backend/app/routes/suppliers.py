from fastapi import APIRouter, Depends

from app.core.security import admin_or_staff

from app.schemas.supplier_schema import (
    SupplierCreateSchema,
    SupplierUpdateSchema
)

from app.services.supplier_service import (
    create_supplier,
    get_all_suppliers,
    get_supplier,
    update_supplier,
    delete_supplier
)

router = APIRouter()


@router.post("/")
def create(
    data: SupplierCreateSchema,
    current_user=Depends(admin_or_staff)
):
    return create_supplier(data)


@router.get("/")
def get_all(current_user=Depends(admin_or_staff)):
    return get_all_suppliers()


@router.get("/{supplier_id}")
def get_one(
    supplier_id: str,
    current_user=Depends(admin_or_staff)
):
    return get_supplier(supplier_id)


@router.put("/{supplier_id}")
def update(
    supplier_id: str,
    data: SupplierUpdateSchema,
    current_user=Depends(admin_or_staff)
):
    return update_supplier(supplier_id, data)


@router.delete("/{supplier_id}")
def delete(
    supplier_id: str,
    current_user=Depends(admin_or_staff)
):
    return delete_supplier(supplier_id)