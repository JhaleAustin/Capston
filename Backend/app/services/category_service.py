from app.core.firebase import db
from app.utils.response import success_response, error_response
from google.cloud.firestore_v1 import SERVER_TIMESTAMP


# CREATE
def create_category(data):

    try:

        doc = db.collection("categories").document()

        doc.set({
            "categoryId": doc.id,
            "name": data.name,
            "description": data.description,
            "status": "Active",
            "deleted": False,
            "createdAt": SERVER_TIMESTAMP,
            "updatedAt": SERVER_TIMESTAMP
        })

        category = doc.get().to_dict()

        return success_response(
            "Category created successfully.",
            category
        )

    except Exception as e:
        return error_response(str(e))


# GET ALL
def get_all_categories():

    try:

        categories = []

        docs = db.collection("categories")\
            .where("deleted", "==", False)\
            .stream()

        for doc in docs:
            categories.append(doc.to_dict())

        return success_response(
            "Categories retrieved successfully.",
            categories
        )

    except Exception as e:
        return error_response(str(e))


# GET ONE
def get_category(category_id):

    try:

        doc = db.collection("categories").document(category_id).get()

        if not doc.exists:
            return error_response("Category not found.")

        return success_response(
            "Category retrieved successfully.",
            doc.to_dict()
        )

    except Exception as e:
        return error_response(str(e))


# UPDATE
def update_category(category_id, data):

    try:

        doc = db.collection("categories").document(category_id)

        if not doc.get().exists:
            return error_response("Category not found.")

        update_data = {}

        if data.name is not None:
            update_data["name"] = data.name

        if data.description is not None:
            update_data["description"] = data.description

        if data.status is not None:
            update_data["status"] = data.status

        update_data["updatedAt"] = SERVER_TIMESTAMP

        doc.update(update_data)

        return success_response(
            "Category updated successfully."
        )

    except Exception as e:
        return error_response(str(e))


# DELETE (Soft Delete)
def delete_category(category_id):

    try:

        doc = db.collection("categories").document(category_id)

        if not doc.get().exists:
            return error_response("Category not found.")

        doc.update({
            "deleted": True,
            "status": "Deleted",
            "updatedAt": SERVER_TIMESTAMP
        })

        return success_response(
            "Category deleted successfully."
        )

    except Exception as e:
        return error_response(str(e))