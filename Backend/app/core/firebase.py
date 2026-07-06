import firebase_admin
from firebase_admin import credentials, firestore
import os

if not firebase_admin._apps:
    firebase_key_path = os.getenv(
        "FIREBASE_KEY_PATH",
        "firebase_key.json"
    )

    cred = credentials.Certificate(firebase_key_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()