
from google.cloud.firestore_v1 import SERVER_TIMESTAMP
from app.core.firebase import db
from app.utils.response import success_response, error_response 
from app.services.activity_log_service import create_log
from app.core.security import hash_password


import uuid
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

def register_user(data):

    try:

        # Check if email already exists
        existing = db.collection("users") \
            .where("email", "==", data.email) \
            .limit(1) \
            .stream()

        if list(existing):

            return error_response(
                "Email already exists."
            )

        uid = str(uuid.uuid4())

        db.collection("users").document(uid).set({

            "uid": uid,
            "name": data.name,
            "email": data.email,
            "password": hash_password(data.password),
            "phone": data.phone,
            "role": data.role,
            "status": "Active",
            "createdAt": SERVER_TIMESTAMP,
            "updatedAt": SERVER_TIMESTAMP

        })

        return success_response(
            "User registered successfully.",
            {
                "uid": uid
            }
        )

    except Exception as e:

        return error_response(str(e))
    
def login_user(data):

    try:

        docs = db.collection("users") \
            .where("email", "==", data.email) \
            .limit(1) \
            .stream()

        users = list(docs)

        if len(users) == 0:
            return error_response("Invalid email or password.")

        user = users[0].to_dict()

        if not verify_password(
            data.password,
            user["password"]
        ):
            return error_response("Invalid email or password.")

        token = create_access_token({
            "uid": user["uid"],
            "email": user["email"],
            "role": user["role"]
        })

        user.pop("password", None)

        create_log(
            user["uid"],
            user["name"],
            "LOGIN",
            "Authentication",
            f"{user['name']} logged in."
        )
        
        return success_response(
            "Login successful.",
            {
                "access_token": token,
                "token_type": "bearer",
                "user": user
            }
        )

    except Exception as e:

        return error_response(str(e))
    
    
def get_user(uid):
    """
    Get a user's profile from Firestore using their UID.
    """
    try:
        user = db.collection("users").document(uid).get()

        if not user.exists:
            return error_response("User not found.")

        return success_response(
            "User retrieved successfully.",
            user.to_dict()
        )

    except Exception as e:
        return error_response(str(e))
    

def update_my_profile(uid, data):
    try:
        user_ref = db.collection("users").document(uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return error_response("User not found.")

        update_data = {}

        if data.name is not None:
            update_data["name"] = data.name

        if data.phone is not None:
            update_data["phone"] = data.phone

        if data.email is not None:
            update_data["email"] = data.email

        if data.password is not None and data.password != "":
            update_data["password"] = hash_password(data.password)

        update_data["updatedAt"] = SERVER_TIMESTAMP

        user_ref.update(update_data)

        updated_user = user_ref.get().to_dict()
        updated_user.pop("password", None)

        return success_response(
            "Profile updated successfully.",
            updated_user
        )

    except Exception as e:
        return error_response(str(e))