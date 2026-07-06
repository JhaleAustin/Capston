import firebase_admin
from firebase_admin import credentials, firestore
import os

print("Loading firebase.py...")
print("Current working directory:", os.getcwd())

if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("Firebase initialized successfully!")