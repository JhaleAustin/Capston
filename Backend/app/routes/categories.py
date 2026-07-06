from fastapi import APIRouter, Depends
from app.core.security import admin_or_staff

from app.schemas.category_schema import (
    CategoryCreateSchema,
    CategoryUpdateSchema
)

from app.services.category_service import (
    create_category,
    get_all_categories,
    get_category,
    update_category,
    delete_category
)

router = APIRouter()


@router.post("/")
def create(
    data: CategoryCreateSchema,
    current_user=Depends(admin_or_staff)
):
    return create_category(data)


@router.get("/")
def get_all(
    current_user=Depends(admin_or_staff)
):
    return get_all_categories()


@router.get("/{category_id}")
def get_one(
    category_id: str,
    current_user=Depends(admin_or_staff)
):
    return get_category(category_id)


@router.put("/{category_id}")
def update(
    category_id: str,
    data: CategoryUpdateSchema,
    current_user=Depends(admin_or_staff)
):
    return update_category(category_id, data)


@router.delete("/{category_id}")
def delete(
    category_id: str,
    current_user=Depends(admin_or_staff)
):
    return delete_category(category_id)