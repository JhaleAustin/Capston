from fastapi import APIRouter, Depends

from app.core.security import admin_or_staff

from app.schemas.notification_schema import (
    NotificationCreateSchema,
    NotificationUpdateSchema
)

from app.services.notification_service import (
    create_notification,
    get_all_notifications,
    get_notification,
    update_notification,
    delete_notification
)

router = APIRouter()


@router.post("/")
def create(
    data: NotificationCreateSchema,
    current_user=Depends(admin_or_staff)
):
    return create_notification(data)


@router.get("/")
def get_all(
    current_user=Depends(admin_or_staff)
):
    return get_all_notifications()


@router.get("/{notification_id}")
def get_one(
    notification_id: str,
    current_user=Depends(admin_or_staff)
):
    return get_notification(notification_id)


@router.put("/{notification_id}")
def update(
    notification_id: str,
    data: NotificationUpdateSchema,
    current_user=Depends(admin_or_staff)
):
    return update_notification(notification_id, data)


@router.delete("/{notification_id}")
def delete(
    notification_id: str,
    current_user=Depends(admin_or_staff)
):
    return delete_notification(notification_id)