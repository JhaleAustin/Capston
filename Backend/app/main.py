from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import (
    auth,
    users,
    categories,
    suppliers,
    inventory,
    sales,
    reports,
    feedback,
    notifications,
    analytics,
    activity_logs,
    ai
)

app = FastAPI(
    title="AI Sales Data Management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://capston-kpjk.vercel.app",
        "https://capston-kpjk-git-main-jhaleaustins-projects.vercel.app",
        "https://capston-kpjk-ct4atywr8-jhaleaustins-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def custom_openapi():

    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    openapi_schema["security"] = [
        {
            "BearerAuth": []
        }
    ]

    app.openapi_schema = openapi_schema

    return app.openapi_schema


app.openapi = custom_openapi


# Authentication Routes
app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

# User Routes
app.include_router(
    users.router,
    prefix="/users",
    tags=["Users"]
)

app.include_router(
    reports.router,
    prefix="/reports",
    tags=["Reports"]
)

app.include_router(
    ai.router,
    prefix="/ai",
    tags=["AI"]
)

app.include_router(
    activity_logs.router,
    prefix="/activity-logs",
    tags=["Activity Logs"]
)


app.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["Notifications"]
)

app.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)

app.include_router(
    feedback.router,
    prefix="/feedback",
    tags=["Feedback"]
)

app.include_router(
    sales.router,
    prefix="/sales",
    tags=["Sales"]
)

app.include_router(
    categories.router,
    prefix="/categories",
    tags=["Categories"]
)

app.include_router(
    suppliers.router,
    prefix="/suppliers",
    tags=["Suppliers"]
)

 
app.include_router(
    inventory.router,
    prefix="/inventory",
    tags=["Inventory"]
)


@app.get("/")
def home():
    return {
        "message": "Backend Running"
    }

