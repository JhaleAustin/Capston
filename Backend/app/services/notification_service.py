from app.core.firebase import db
from app.utils.response import success_response, error_response
from google.cloud.firestore_v1 import SERVER_TIMESTAMP


# CREATE
def create_notification(data):

    try:

        doc = db.collection("notifications").document()

        doc.set({
            "notificationId": doc.id,
            "title": data.title,
            "message": data.message,
            "type": data.type,
            "isRead": False,
            "deleted": False,
            "createdAt": SERVER_TIMESTAMP,
            "updatedAt": SERVER_TIMESTAMP
        })

        return success_response(
            "Notification created successfully.",
            {
                "notificationId": doc.id
            }
        )

    except Exception as e:
        return error_response(str(e))


# GET ALL
def get_all_notifications():

    try:

        notifications = []

        docs = db.collection("notifications")\
            .where("deleted", "==", False)\
            .stream()

        for doc in docs:
            notifications.append(doc.to_dict())

        return success_response(
            "Notifications retrieved successfully.",
            notifications
        )

    except Exception as e:
        return error_response(str(e))


# GET ONE
def get_notification(notification_id):

    try:

        doc = db.collection("notifications").document(notification_id).get()

        if not doc.exists:
            return error_response("Notification not found.")

        return success_response(
            "Notification retrieved successfully.",
            doc.to_dict()
        )

    except Exception as e:
        return error_response(str(e))


# MARK AS READ
def update_notification(notification_id, data):

    try:

        notification = db.collection("notifications").document(notification_id)

        if not notification.get().exists:
            return error_response("Notification not found.")

        notification.update({
            "isRead": data.isRead,
            "updatedAt": SERVER_TIMESTAMP
        })

        return success_response(
            "Notification updated successfully."
        )

    except Exception as e:
        return error_response(str(e))


# DELETE
def delete_notification(notification_id):

    try:

        notification = db.collection("notifications").document(notification_id)

        if not notification.get().exists:
            return error_response("Notification not found.")

        notification.update({
            "deleted": True,
            "updatedAt": SERVER_TIMESTAMP
        })

        return success_response(
            "Notification deleted successfully."
        )

    except Exception as e:
        return error_response(str(e))