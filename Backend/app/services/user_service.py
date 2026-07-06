from app.core.firebase import db
from app.utils.response import success_response, error_response
from google.cloud.firestore_v1 import SERVER_TIMESTAMP

def get_all_users():
    try:

        users = []

        docs = db.collection("users").stream()

        for doc in docs:

            data = doc.to_dict()

            users.append(data)

        return success_response(
            "Users retrieved successfully.",
            users
        )

    except Exception as e:

        return error_response(str(e))


def get_user(uid):

    try:

        doc = db.collection("users").document(uid).get()

        if not doc.exists:
            return error_response("User not found.")

        return success_response(
            "User retrieved successfully.",
            doc.to_dict()
        )

    except Exception as e:

        return error_response(str(e))
    
def update_user(uid, data):

    try:

        user_ref = db.collection("users").document(uid)

        if not user_ref.get().exists:
            return error_response("User not found.")

        update_data = {}

        if data.name is not None:
            update_data["name"] = data.name

        if data.phone is not None:
            update_data["phone"] = data.phone

        if data.role is not None:
            update_data["role"] = data.role

        if data.status is not None:
            update_data["status"] = data.status

        update_data["updatedAt"] = SERVER_TIMESTAMP
        user_ref.update(update_data)

        return success_response(
            "User updated successfully."
        )

    except Exception as e:
        return error_response(str(e))
    
def delete_user(uid):

    try:

        user_ref = db.collection("users").document(uid)

        if not user_ref.get().exists:
            return error_response("User not found.")

        user_ref.update({
            "status": "Deleted",
            "deleted": True,
            "updatedAt": SERVER_TIMESTAMP
        })

        return success_response(
            "User deleted successfully."
        )

    except Exception as e:
        return error_response(str(e))