from fastapi import APIRouter, Depends

from app.core.security import (
    admin_or_staff,
    any_logged_in_user
)

from app.schemas.feedback_schema import (
    FeedbackCreateSchema,
    FeedbackUpdateSchema
)

from app.services.feedback_service import (
    create_feedback,
    get_all_feedback,
    get_feedback,
    update_feedback,
    delete_feedback
)

router = APIRouter()


@router.post("/")
def create(
    data: FeedbackCreateSchema,
    current_user=Depends(any_logged_in_user)
):
    return create_feedback(data)


@router.get("/")
def get_all(
    current_user=Depends(any_logged_in_user)
):
    return get_all_feedback()

@router.get("/{feedback_id}")
def get_one(
    feedback_id: str,
    current_user=Depends(admin_or_staff)
):
    return get_feedback(feedback_id)


@router.put("/{feedback_id}")
def update(
    feedback_id: str,
    data: FeedbackUpdateSchema,
    current_user=Depends(admin_or_staff)
):
    return update_feedback(feedback_id, data)


@router.delete("/{feedback_id}")
def delete(
    feedback_id: str,
    current_user=Depends(admin_or_staff)
):
    return delete_feedback(feedback_id)