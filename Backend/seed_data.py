import random
from datetime import datetime, timedelta, timezone

import firebase_admin
from firebase_admin import credentials, firestore

from app.core.security import hash_password


# ============================================================
# SEED ONLY USERS AND FEEDBACK
#
# Creates:
# - 1 admin account
# - 1 staff account
# - 100 customer accounts
# - 100 feedback records linked to the customer accounts
#
# Run from your Backend folder:
#     python seed_users_feedback.py
#
# Required files/folders:
# - firebase_key.json
# - app/core/security.py
#
# WARNING:
# This script clears the "users" and "feedback" collections first.
# ============================================================


# ============================================================
# FIREBASE INITIALIZATION
# ============================================================

if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()


# ============================================================
# HELPERS
# ============================================================

def now():
    return datetime.now(timezone.utc)


def random_date(days_back=60):
    return now() - timedelta(
        days=random.randint(0, days_back),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
    )


def clear_collection(collection_name):
    docs = list(db.collection(collection_name).stream())

    for start in range(0, len(docs), 400):
        batch = db.batch()

        for doc in docs[start:start + 400]:
            batch.delete(doc.reference)

        batch.commit()

    print(f"Cleared {collection_name}: {len(docs)} documents")


# ============================================================
# SAMPLE CUSTOMER NAMES
# ============================================================

FIRST_NAMES = [
    "Maria", "John", "Ana", "Mark", "Christine", "Paolo", "Jenny", "Ryan",
    "Ella", "Kim", "Joshua", "Sofia", "Daniel", "Angela", "Carlo", "Nicole",
    "Miguel", "Patricia", "Kevin", "Bea", "Jerome", "Camille", "Nathan",
    "Alyssa", "Gabriel", "Mika", "Francis", "Jasmine", "Vincent", "Trisha",
    "Luis", "Hazel", "Marco", "Faith", "Adrian", "Janine", "Rafael", "Erika",
    "Christian", "Bianca",
]

LAST_NAMES = [
    "Santos", "Reyes", "Cruz", "Dela Cruz", "Garcia", "Ramos", "Tan", "Lim",
    "Mendoza", "Torres", "Flores", "Castillo", "Navarro", "Aquino", "Bautista",
    "Villanueva", "Domingo", "Mercado", "Salazar", "Francisco", "Soriano",
    "Valdez", "Pascual", "Manalo", "Rivera", "Gonzales", "Aguilar", "Castro",
    "Diaz", "Lopez",
]


# ============================================================
# FEEDBACK COMMENTS
# ============================================================

POSITIVE_FEEDBACK = [
    "The ramen broth was rich, flavorful, and served hot.",
    "The sushi tasted fresh and the presentation was excellent.",
    "The staff were friendly, polite, and very accommodating.",
    "The food arrived quickly and everything tasted delicious.",
    "The serving size was generous and worth the price.",
    "The katsudon was excellent and I would order it again.",
    "The restaurant was clean and had a relaxing atmosphere.",
    "The bento meal was complete, fresh, and satisfying.",
    "The tempura was crispy and not oily.",
    "The ramen was one of the best meals I have tried.",
    "I enjoyed the authentic Japanese flavor of the dishes.",
    "The staff handled my order professionally and accurately.",
    "The food quality exceeded my expectations.",
    "The matcha drink was refreshing and not overly sweet.",
    "The meal was affordable, delicious, and filling.",
    "My order was complete and carefully packed.",
    "The ingredients tasted fresh and well prepared.",
    "The service was fast even though the restaurant was busy.",
    "I had a very good dining experience and will return.",
    "The food was delicious and the customer service was excellent.",
]

GOOD_FEEDBACK = [
    "The food was good, but the serving time could be a little faster.",
    "The ramen tasted good and the price was reasonable.",
    "The sushi was fresh, although the serving was smaller than expected.",
    "The staff were polite and the overall service was satisfactory.",
    "The bento meal was good and worth its price.",
    "The restaurant was clean and the food was enjoyable.",
    "The meal was satisfying, but I would like more sauce.",
    "The tempura was crispy, but the rice portion was small.",
    "The drinks were refreshing and the food tasted good.",
    "Overall, I had a good experience and would recommend the restaurant.",
    "The order was packed properly and arrived in good condition.",
    "The ramen was flavorful, although the broth was slightly salty.",
    "The food was affordable and the service was acceptable.",
    "The staff were helpful when I asked about the menu.",
    "The food presentation was nice and the taste was good.",
]

NEUTRAL_FEEDBACK = [
    "The food was okay and the service was average.",
    "The meal tasted fine, but nothing stood out.",
    "The serving size was acceptable for the price.",
    "The ramen was decent, although I expected more flavor.",
    "The restaurant was a little crowded during my visit.",
    "The food was acceptable, but the waiting time was longer than expected.",
    "The meal was average and could use better presentation.",
    "The service was normal and the order was completed correctly.",
    "The taste was okay, but the food could have been warmer.",
    "The overall experience was fair.",
]

NEGATIVE_FEEDBACK = [
    "The waiting time was too long and the food arrived cold.",
    "The ramen broth was too salty for my taste.",
    "My order was incomplete and one item was missing.",
    "The chicken was dry and the serving was smaller than expected.",
    "The staff forgot part of my order.",
    "The table was not properly cleaned before we sat down.",
    "The food was expensive compared with the serving size.",
    "The restaurant was noisy and the service was slow.",
    "The tempura was oily and no longer crispy.",
    "The drink was too sweet and the food was only average.",
]

VERY_NEGATIVE_FEEDBACK = [
    "The order was incorrect and took a very long time to replace.",
    "The food tasted stale and I was disappointed with the quality.",
    "The customer service was poor and no one assisted us promptly.",
    "The meal arrived cold and did not taste fresh.",
    "The experience was disappointing and needs major improvement.",
]


# ============================================================
# CREATE USERS
# ============================================================

def create_users():
    users = []

    fixed_users = [
        {
            "name": "Admin User",
            "email": "admin@example.com",
            "role": "admin",
        },
        {
            "name": "Staff User",
            "email": "staff@example.com",
            "role": "staff",
        },
    ]

    for user in fixed_users:
        doc_ref = db.collection("users").document()
        created_at = random_date(180)

        data = {
            "uid": doc_ref.id,
            "userId": doc_ref.id,
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "password": hash_password("123456"),
            "status": "Active",
            "deleted": False,
            "createdAt": created_at,
            "updatedAt": created_at,
        }

        doc_ref.set(data)
        users.append(data)

    for index in range(1, 101):
        first_name = FIRST_NAMES[(index - 1) % len(FIRST_NAMES)]
        last_name = LAST_NAMES[((index - 1) // len(FIRST_NAMES)) % len(LAST_NAMES)]

        full_name = f"{first_name} {last_name} {index:03d}"

        doc_ref = db.collection("users").document()
        created_at = random_date(180)

        data = {
            "uid": doc_ref.id,
            "userId": doc_ref.id,
            "name": full_name,
            "email": f"customer{index:03d}@example.com",
            "role": "customer",
            "password": hash_password("123456"),
            "status": "Active",
            "deleted": False,
            "createdAt": created_at,
            "updatedAt": created_at,
        }

        doc_ref.set(data)
        users.append(data)

    print("Users created: 102 accounts")
    return users


# ============================================================
# CREATE FEEDBACK
# One feedback record is connected to each customer account.
# ============================================================

def create_feedback(users):
    customer_users = [
        user for user in users
        if user["role"] == "customer"
    ]

    feedback_pool = []

    # 45 positive five-star reviews
    feedback_pool.extend(
        {
            "rating": 5,
            "comment": random.choice(POSITIVE_FEEDBACK),
            "expectedSentiment": "Positive",
        }
        for _ in range(45)
    )

    # 25 positive four-star reviews
    feedback_pool.extend(
        {
            "rating": 4,
            "comment": random.choice(GOOD_FEEDBACK),
            "expectedSentiment": "Positive",
        }
        for _ in range(25)
    )

    # 15 neutral three-star reviews
    feedback_pool.extend(
        {
            "rating": 3,
            "comment": random.choice(NEUTRAL_FEEDBACK),
            "expectedSentiment": "Neutral",
        }
        for _ in range(15)
    )

    # 10 negative two-star reviews
    feedback_pool.extend(
        {
            "rating": 2,
            "comment": random.choice(NEGATIVE_FEEDBACK),
            "expectedSentiment": "Negative",
        }
        for _ in range(10)
    )

    # 5 very negative one-star reviews
    feedback_pool.extend(
        {
            "rating": 1,
            "comment": random.choice(VERY_NEGATIVE_FEEDBACK),
            "expectedSentiment": "Negative",
        }
        for _ in range(5)
    )

    random.shuffle(feedback_pool)

    feedback_data = []

    for customer, feedback_entry in zip(customer_users, feedback_pool):
        doc_ref = db.collection("feedback").document()
        created_at = random_date(90)

        data = {
            "feedbackId": doc_ref.id,

            "customerId": customer["userId"],
            "userId": customer["userId"],
            "customerName": customer["name"],
            "customerEmail": customer["email"],

            "rating": feedback_entry["rating"],
            "comment": feedback_entry["comment"],

            # For checking the expected AI result
            "expectedSentiment": feedback_entry["expectedSentiment"],

            # These fields can be filled by your AI analysis later
            "sentiment": None,
            "sentimentScore": None,
            "aiSummary": None,
            "aiAnalyzed": False,

            "status": "Active",
            "deleted": False,
            "createdAt": created_at,
            "updatedAt": created_at,
        }

        doc_ref.set(data)
        feedback_data.append(data)

    print("Feedback created: 100 records")
    return feedback_data


# ============================================================
# RUN
# ============================================================

def main():
    random.seed(2026)

    print("================================================")
    print("SEEDING USERS AND FEEDBACK")
    print("================================================")

     
    users = create_users()
    create_feedback(users)

    print("================================================")
    print("SEED COMPLETED SUCCESSFULLY")
    print("================================================")
    print("Admin account:")
    print("  Email: admin@example.com")
    print("  Password: 123456")
    print("")
    print("Staff account:")
    print("  Email: staff@example.com")
    print("  Password: 123456")
    print("")
    print("Customer accounts:")
    print("  customer001@example.com")
    print("  through")
    print("  customer100@example.com")
    print("  Password: 123456")
    print("================================================")


if __name__ == "__main__":
    main()