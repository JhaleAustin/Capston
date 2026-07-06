from app.core.firebase import db
from app.utils.response import success_response, error_response
from google.cloud.firestore_v1 import SERVER_TIMESTAMP


def create_log(user_id, user_name, action, module, description):
    try:
        doc = db.collection("activity_logs").document()

        doc.set({
            "logId": doc.id,
            "userId": user_id,
            "userName": user_name,
            "action": action,
            "module": module,
            "description": description,
            "createdAt": SERVER_TIMESTAMP
        })

        return True

    except Exception:
        return False


def get_logs():
    try:
        logs = []

        docs = db.collection("activity_logs").stream()

        for doc in docs:
            logs.append(doc.to_dict())

        return success_response(
            "Activity logs retrieved successfully.",
            logs
        )

    except Exception as e:
        return error_response(str(e))