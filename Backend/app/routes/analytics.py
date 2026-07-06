from fastapi import APIRouter, Depends

from app.core.security import admin_or_staff
from app.services.analytics_service import dashboard

router = APIRouter()


@router.get("/dashboard")
def analytics_dashboard(
    current_user=Depends(admin_or_staff)
):
    return dashboard()