from fastapi import APIRouter, Depends

from app.core.security import any_logged_in_user
from app.schemas.auth_schema import RegisterSchema, LoginSchema, ProfileUpdateSchema



from app.services.auth_service import (
    register_user,
    login_user,
    get_user,
    update_my_profile
)

router = APIRouter()


@router.post("/register")
def register(data: RegisterSchema):
    return register_user(data)


@router.post("/login")
def login(data: LoginSchema):
    return login_user(data)


@router.get("/me")
def get_my_profile(
    current_user=Depends(any_logged_in_user)
):
    return get_user(current_user["uid"])

@router.put("/me")
def update_profile(
    data: ProfileUpdateSchema,
    current_user=Depends(any_logged_in_user)
):
    return update_my_profile(current_user["uid"], data)