from fastapi import APIRouter, Depends

from app.core.security import admin_only
from app.schemas.user_schema import UserUpdateSchema

from app.services.user_service import (
    get_all_users,
    get_user,
    update_user,
    delete_user
)

router = APIRouter()


@router.get("/")
def users(current_user=Depends(admin_only)):
    return get_all_users()


@router.get("/{uid}")
def user(
    uid: str,
    current_user=Depends(admin_only)
):
    return get_user(uid)


@router.put("/{uid}")
def update(
    uid: str,
    data: UserUpdateSchema,
    current_user=Depends(admin_only)
):
    return update_user(uid, data)


@router.delete("/{uid}")
def delete(
    uid: str,
    current_user=Depends(admin_only)
):
    return delete_user(uid)