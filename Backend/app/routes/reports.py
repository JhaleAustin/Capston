from fastapi import APIRouter, Depends

from app.core.security import admin_or_staff
from app.services.report_service import report

router = APIRouter()


@router.get("/sales")
def sales_report(
    current_user=Depends(admin_or_staff)
):
    return report()