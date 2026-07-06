from fastapi import APIRouter, Depends

from app.core.security import admin_only
from app.services.activity_log_service import get_logs

router = APIRouter()


@router.get("/")
def logs(current_user=Depends(admin_only)):
    return get_logs()