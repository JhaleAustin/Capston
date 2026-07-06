from fastapi import APIRouter, Depends

from app.core.security import admin_or_staff,any_logged_in_user

from app.schemas.inventory_schema import (
    InventoryCreateSchema,
    InventoryUpdateSchema
)

from app.services.inventory_service import (
    create_inventory,
    get_all_inventory,
    get_inventory,
    update_inventory,
    delete_inventory,
    low_stock_items,
    search_inventory
)

router = APIRouter()


@router.post("/")
def create(
    data: InventoryCreateSchema,
    current_user=Depends(admin_or_staff)
):
    return create_inventory(data)

@router.get("/")
def get_all(
    current_user=Depends(any_logged_in_user)
):
    return get_all_inventory()


@router.get("/search/{keyword}")
def search(
    keyword: str,
    current_user=Depends(admin_or_staff)
):
    return search_inventory(keyword)


@router.get("/low-stock")
def low_stock(
    current_user=Depends(admin_or_staff)
):
    return low_stock_items()


@router.get("/{item_id}")
def get_one(
    item_id: str,
    current_user=Depends(admin_or_staff)
):
    return get_inventory(item_id)


@router.put("/{item_id}")
def update(
    item_id: str,
    data: InventoryUpdateSchema,
    current_user=Depends(admin_or_staff)
):
    return update_inventory(item_id, data)


@router.delete("/{item_id}")
def delete(
    item_id: str,
    current_user=Depends(admin_or_staff)
):
    return delete_inventory(item_id)