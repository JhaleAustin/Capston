from fastapi import APIRouter, Depends
from app.core.security import admin_or_staff, any_logged_in_user
from app.schemas.ai_schema import AIChatSchema

from app.services.ai_service import (
    ai_business_summary,
    ai_chat,
    ai_sales_insights,
    ai_inventory_recommendation,
    ai_feedback_analysis,
    ai_sales_forecast,
    ai_dashboard
)

router = APIRouter()


@router.get("/business-summary")
def business_summary(
    current_user=Depends(admin_or_staff)
):
    return ai_business_summary()


@router.post("/chat")
def chat(
    data: AIChatSchema,
    current_user=Depends(any_logged_in_user)
):
    return ai_chat(data.question)


@router.get("/sales-insights")
def sales_insights(
    current_user=Depends(admin_or_staff)
):
    return ai_sales_insights()


@router.get("/inventory-recommendation")
def inventory_recommendation(
    current_user=Depends(admin_or_staff)
):
    return ai_inventory_recommendation()


@router.get("/feedback-analysis")
def feedback_analysis(
    current_user=Depends(admin_or_staff)
):
    return ai_feedback_analysis()


@router.get("/sales-forecast")
def sales_forecast(
    current_user=Depends(admin_or_staff)
):
    return ai_sales_forecast()


@router.get("/dashboard")
def dashboard(
    current_user=Depends(admin_or_staff)
):
    return ai_dashboard()


 