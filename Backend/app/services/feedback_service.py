from app.core.firebase import db
from app.utils.response import success_response, error_response
from google.cloud.firestore_v1 import SERVER_TIMESTAMP


# CREATE
def create_feedback(data):

    try:

        doc = db.collection("feedback").document()

        doc.set({
            "feedbackId": doc.id,
            "customerName": data.customerName,
            "email": data.email,
            "rating": data.rating,
            "comment": data.comment,
            "status": "Unread",
            "deleted": False,
            "createdAt": SERVER_TIMESTAMP,
            "updatedAt": SERVER_TIMESTAMP
        })

        return success_response(
            "Feedback submitted successfully.",
            {
                "feedbackId": doc.id
            }
        )

    except Exception as e:
        return error_response(str(e))


# GET ALL
def get_all_feedback():

    try:

        feedback = []

        docs = db.collection("feedback") \
            .where("deleted", "==", False) \
            .stream()

        for doc in docs:
            feedback.append(doc.to_dict())

        return success_response(
            "Feedback retrieved successfully.",
            feedback
        )

    except Exception as e:
        return error_response(str(e))


# GET ONE
def get_feedback(feedback_id):

    try:

        doc = db.collection("feedback").document(feedback_id).get()

        if not doc.exists:
            return error_response("Feedback not found.")

        return success_response(
            "Feedback retrieved successfully.",
            doc.to_dict()
        )

    except Exception as e:
        return error_response(str(e))


# UPDATE STATUS
def update_feedback(feedback_id, data):

    try:

        feedback = db.collection("feedback").document(feedback_id)

        if not feedback.get().exists:
            return error_response("Feedback not found.")

        feedback.update({
            "status": data.status,
            "updatedAt": SERVER_TIMESTAMP
        })

        return success_response(
            "Feedback updated successfully."
        )

    except Exception as e:
        return error_response(str(e))


# DELETE
def delete_feedback(feedback_id):

    try:

        feedback = db.collection("feedback").document(feedback_id)

        if not feedback.get().exists:
            return error_response("Feedback not found.")

        feedback.update({
            "deleted": True,
            "status": "Deleted",
            "updatedAt": SERVER_TIMESTAMP
        })

        return success_response(
            "Feedback deleted successfully."
        )

    except Exception as e:
        return error_response(str(e))