from fastapi import FastAPI
from app.core.firebase import db

app = FastAPI(
    title="AI Sales Data Management API",
    version="1.0.0"
)


@app.get("/")
def home():
    return {"message": "Backend Running"}


@app.post("/test-firestore")
def test_firestore():

    doc_ref = db.collection("test").document()

    doc_ref.set({
        "message": "Firebase Connected",
        "status": True
    })

    return {
        "success": True,
        "message": "Data added successfully"
    }

@app.post("/categories/test")
def test_category():

    doc = db.collection("categories").document()

    doc.set({
        "name": "Sushi",
        "description": "Japanese food",
        "status": "Active"
    })

    return {"message": "Category created"}