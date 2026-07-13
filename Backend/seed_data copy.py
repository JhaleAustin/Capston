import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta, timezone
from app.core.security import hash_password
import random

# ============================================================
# COMPLETE SEED DATA MATCHING YOUR BACKEND SCHEMA
# Backend folder must contain: firebase_key.json
# Run: python seed_data.py
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


def random_date(days_back=30):
    return datetime.now(timezone.utc) - timedelta(days=random.randint(0, days_back))


def clear_collection(collection_name):
    docs = list(db.collection(collection_name).stream())
    for doc in docs:
        doc.reference.delete()
    print(f"Cleared {collection_name}: {len(docs)}")


def clear_all():
    collections = [
        "users",
        "categories",
        "suppliers",
        "inventory",
        "sales",
        "feedback",
        "notifications",
        "activity_logs",
        "analytics",
        "reports"
    ]

    for collection in collections:
        clear_collection(collection)


# ============================================================
# USERS
# ============================================================

def create_users():
    users = [
        {
            "name": "Admin User",
            "email": "admin@example.com",
            "role": "admin"
        },
        {
            "name": "Staff User",
            "email": "staff@example.com",
            "role": "staff"
        },
        {
            "name": "Customer User",
            "email": "customer@example.com",
            "role": "customer"
        }
    ]

    user_data = []

    for user in users:
        doc_ref = db.collection("users").document()

        data = {
            "uid": doc_ref.id,
            "userId": doc_ref.id,
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "password": hash_password("123456"),
            "status": "Active",
            "deleted": False,
            "createdAt": now(),
            "updatedAt": now()
        }

        doc_ref.set(data)
        user_data.append(data)

    print("Users created.")
    return user_data


# ============================================================
# CATEGORIES
# ============================================================

def create_categories():
    categories = [
        ("Sushi", "Japanese sushi items"),
        ("Ramen", "Japanese ramen dishes"),
        ("Rice Meals", "Japanese rice meals and bowls"),
        ("Drinks", "Japanese beverages and refreshments"),
        ("Desserts", "Japanese desserts and sweets"),
        ("Appetizers", "Japanese starters and side dishes"),
        ("Bento", "Japanese bento meals"),
        ("Noodles", "Japanese noodle dishes"),
        ("Donburi", "Japanese rice bowl dishes"),
        ("Specials", "Chef recommended meals"),
    ]

    category_ids = {}

    for name, description in categories:
        doc_ref = db.collection("categories").document()

        data = {
            "categoryId": doc_ref.id,
            "name": name,
            "description": description,
            "status": "Active",
            "deleted": False,
            "createdAt": now(),
            "updatedAt": now()
        }

        doc_ref.set(data)
        category_ids[name] = doc_ref.id

    print("Categories created.")
    return category_ids


# ============================================================
# SUPPLIERS
# Schema:
# {
#   companyName, contactPerson, email, phone, address
# }
# ============================================================

def create_suppliers():
    suppliers = [
        ("Tokyo Fresh Supply", "Kenji Tanaka", "tokyofresh@example.com", "09123456789", "Las Piñas City"),
        ("Osaka Food Distributor", "Mika Sato", "osakafood@example.com", "09987654321", "Parañaque City"),
        ("Kyoto Ingredients PH", "Hana Mori", "kyotoingredients@example.com", "09223334444", "Makati City"),
        ("Sakura Trading", "Aiko Suzuki", "sakuratrading@example.com", "09334445555", "Taguig City"),
        ("Nippon Food Market", "Yuki Sato", "nipponmarket@example.com", "09445556666", "Pasay City"),
    ]

    supplier_data = []

    for company_name, contact_person, email, phone, address in suppliers:
        doc_ref = db.collection("suppliers").document()

        data = {
            "supplierId": doc_ref.id,
            "companyName": company_name,
            "name": company_name,  # backup for frontend display
            "contactPerson": contact_person,
            "email": email,
            "phone": phone,
            "address": address,
            "status": "Active",
            "deleted": False,
            "createdAt": now(),
            "updatedAt": now()
        }

        doc_ref.set(data)
        supplier_data.append(data)

    print("Suppliers created.")
    return supplier_data


# ============================================================
# INVENTORY - 50 ITEMS
# Schema:
# {
#   itemName, categoryId, supplierId, barcode, description,
#   costPrice, sellingPrice, quantity, minimumStock, unit,
#   expirationDate, imageUrl
# }
# ============================================================

def create_inventory(category_ids, suppliers):
    items = [
        ("California Maki", "Sushi", 180), ("Salmon Nigiri", "Sushi", 160),
        ("Tuna Nigiri", "Sushi", 170), ("Ebi Sushi", "Sushi", 150),
        ("Dragon Roll", "Sushi", 220), ("Spicy Tuna Roll", "Sushi", 200),

        ("Tonkotsu Ramen", "Ramen", 250), ("Shoyu Ramen", "Ramen", 230),
        ("Miso Ramen", "Ramen", 240), ("Spicy Ramen", "Ramen", 260),
        ("Chicken Ramen", "Ramen", 220),

        ("Katsudon", "Rice Meals", 220), ("Gyudon", "Rice Meals", 210),
        ("Oyakodon", "Rice Meals", 200), ("Chicken Teriyaki Rice", "Rice Meals", 230),
        ("Pork Tonkatsu Rice", "Rice Meals", 240),

        ("Iced Matcha Latte", "Drinks", 140), ("Hot Matcha Latte", "Drinks", 130),
        ("Japanese Iced Tea", "Drinks", 90), ("Lemon Yakult", "Drinks", 120),
        ("Melon Soda", "Drinks", 110),

        ("Japanese Cheesecake", "Desserts", 150), ("Mochi", "Desserts", 100),
        ("Dorayaki", "Desserts", 120), ("Matcha Ice Cream", "Desserts", 130),
        ("Taiyaki", "Desserts", 140),

        ("Gyoza", "Appetizers", 120), ("Takoyaki", "Appetizers", 130),
        ("Edamame", "Appetizers", 100), ("Karaage", "Appetizers", 160),
        ("Tempura", "Appetizers", 180),

        ("Chicken Bento", "Bento", 260), ("Salmon Bento", "Bento", 290),
        ("Beef Bento", "Bento", 280), ("Pork Bento", "Bento", 270),
        ("Vegetable Bento", "Bento", 230),

        ("Yakisoba", "Noodles", 210), ("Udon", "Noodles", 220),
        ("Tempura Udon", "Noodles", 250), ("Beef Udon", "Noodles", 260),
        ("Cold Soba", "Noodles", 200),

        ("Beef Donburi", "Donburi", 230), ("Chicken Donburi", "Donburi", 220),
        ("Salmon Donburi", "Donburi", 280), ("Tempura Donburi", "Donburi", 250),
        ("Tofu Donburi", "Donburi", 190),

        ("Chef Sushi Platter", "Specials", 550), ("Family Ramen Set", "Specials", 680),
        ("Bento Party Tray", "Specials", 850), ("Kyojiri Combo Meal", "Specials", 399),
    ]

    inventory_data = []

    for index, (item_name, category_name, selling_price) in enumerate(items, start=1):
        supplier = random.choice(suppliers)

        quantity = random.randint(40, 100)
        minimum_stock = random.randint(10, 20)
        cost_price = round(selling_price * 0.55, 2)
        expiration_date = now() + timedelta(days=random.randint(30, 180))

        stock_status = "Low Stock" if quantity <= minimum_stock else "In Stock"

        doc_ref = db.collection("inventory").document()

        data = {
            "inventoryId": doc_ref.id,
            "productId": doc_ref.id,

            # Required backend fields
            "itemName": item_name,
            "categoryId": category_ids[category_name],
            "supplierId": supplier["supplierId"],
            "barcode": f"KYJ-{index:05d}-{random.randint(100, 999)}",
            "description": f"{item_name} under {category_name}",
            "costPrice": cost_price,
            "sellingPrice": selling_price,
            "quantity": quantity,
            "minimumStock": minimum_stock,
            "unit": "pcs",
            "expirationDate": expiration_date.isoformat(),
            "imageUrl": "",

            # Extra fields for frontend/dashboard display
            "name": item_name,
            "categoryName": category_name,
            "supplierName": supplier["companyName"],
            "price": selling_price,
            "cost": cost_price,
            "stock": quantity,
            "minStock": minimum_stock,
            "reorderLevel": minimum_stock,
            "initialStock": quantity,
            "expiryDate": expiration_date.isoformat(),
            "expiration": expiration_date.isoformat(),
            "stockStatus": stock_status,
            "isLowStock": quantity <= minimum_stock,

            "status": "Active",
            "itemStatus": "Active",
            "deleted": False,
            "createdAt": now(),
            "updatedAt": now()
        }

        doc_ref.set(data)
        inventory_data.append(data)

    print("Inventory created: 50 items.")
    return inventory_data


# ============================================================
# SALES - 50 SALES
# Schema:
# {
#   customerName, cashierId, cashierName, paymentMethod,
#   amountPaid, discount, tax,
#   items: [{ itemId, quantity }]
# }
# ============================================================

def create_sales(inventory_data, users):
    sales_data = []

    admin_user = next((u for u in users if u["role"] == "admin"), users[0])
    staff_user = next((u for u in users if u["role"] == "staff"), users[0])

    cashiers = [
        {
            "cashierId": admin_user["userId"],
            "cashierName": admin_user["name"]
        },
        {
            "cashierId": staff_user["userId"],
            "cashierName": staff_user["name"]
        }
    ]

    customers = [
        "Walk-in Customer", "Maria Santos", "John Reyes", "Ana Cruz",
        "Mark Dela Cruz", "Christine Lim", "Paolo Garcia", "Jenny Ramos",
        "Ryan Cruz", "Ella Santos"
    ]

    stock_tracker = {
        item["inventoryId"]: item["quantity"]
        for item in inventory_data
    }

    for i in range(50):
        available_items = [
            item for item in inventory_data
            if stock_tracker[item["inventoryId"]] > 0
        ]

        if not available_items:
            break

        number_of_items = random.randint(1, 3)
        selected_items = random.sample(available_items, min(number_of_items, len(available_items)))

        sale_items = []
        subtotal = 0

        for item in selected_items:
            current_stock = stock_tracker[item["inventoryId"]]
            quantity_sold = random.randint(1, min(5, current_stock))

            stock_tracker[item["inventoryId"]] = current_stock - quantity_sold

            line_total = quantity_sold * item["sellingPrice"]
            subtotal += line_total

            sale_items.append({
                "itemId": item["inventoryId"],
                "inventoryId": item["inventoryId"],
                "itemName": item["itemName"],
                "quantity": quantity_sold,
                "price": item["sellingPrice"],
                "sellingPrice": item["sellingPrice"],
                "subtotal": line_total
            })

            new_quantity = stock_tracker[item["inventoryId"]]
            minimum_stock = item["minimumStock"]
            new_status = "Low Stock" if new_quantity <= minimum_stock else "In Stock"

            db.collection("inventory").document(item["inventoryId"]).update({
                "quantity": new_quantity,
                "stock": new_quantity,
                "stockStatus": new_status,
                "isLowStock": new_quantity <= minimum_stock,
                "updatedAt": now()
            })

        discount = random.choice([0, 0, 0, 10, 20, 50])
        tax = round(subtotal * 0.12, 2)
        amount_paid = round(subtotal + tax - discount, 2)

        cashier = random.choice(cashiers)
        sale_date = random_date(30)

        doc_ref = db.collection("sales").document()

        sale = {
            "saleId": doc_ref.id,
            "orderId": doc_ref.id,

            # Required backend fields
            "customerName": random.choice(customers),
            "cashierId": cashier["cashierId"],
            "cashierName": cashier["cashierName"],
            "paymentMethod": random.choice(["Cash", "GCash", "Card"]),
            "amountPaid": amount_paid,
            "discount": discount,
            "tax": tax,
            "items": sale_items,

            # Extra fields for dashboard/report compatibility
            "subtotal": subtotal,
            "total": amount_paid,
            "totalAmount": amount_paid,
            "amount": amount_paid,
            "revenue": amount_paid,
            "totalItems": sum(item["quantity"] for item in sale_items),

            "status": "Completed",
            "deleted": False,

            "saleDate": sale_date,
            "date": sale_date,
            "createdAt": sale_date,
            "updatedAt": sale_date
        }

        doc_ref.set(sale)
        sales_data.append(sale)

    print(f"Sales created: {len(sales_data)} sales with connected items and stock deduction.")
    return sales_data


# ============================================================
# FEEDBACK - 50
# ============================================================

def create_feedback():
    comments = [
        "The food was delicious and the service was great.",
        "Good Japanese food. I liked the ramen.",
        "The sushi was fresh and affordable.",
        "Food was good but waiting time can improve.",
        "I will order again. The katsudon was excellent.",
        "The drinks are refreshing.",
        "Affordable price and good serving size.",
        "The staff was friendly.",
        "Very clean and good presentation.",
        "Best Japanese food I tried this week."
    ]

    customers = [
        "Maria Santos", "John Reyes", "Ana Cruz", "Mark Dela Cruz",
        "Christine Lim", "Paolo Garcia", "Jenny Ramos", "Ryan Cruz",
        "Ella Santos", "Kim Tan"
    ]

    feedback_data = []

    for i in range(50):
        doc_ref = db.collection("feedback").document()

        data = {
            "feedbackId": doc_ref.id,
            "customerName": random.choice(customers),
            "rating": random.randint(3, 5),
            "comment": random.choice(comments),
            "status": "Active",
            "deleted": False,
            "createdAt": random_date(30),
            "updatedAt": now()
        }

        doc_ref.set(data)
        feedback_data.append(data)

    print("Feedback created: 50 records.")
    return feedback_data


# ============================================================
# NOTIFICATIONS - 50
# ============================================================

def create_notifications():
    types = ["Inventory", "Sales", "Feedback", "Analytics", "Reports", "System"]

    for i in range(50):
        ntype = random.choice(types)
        doc_ref = db.collection("notifications").document()

        doc_ref.set({
            "notificationId": doc_ref.id,
            "title": f"{ntype} Notification",
            "message": f"{ntype} notification #{i + 1} generated for testing.",
            "type": ntype,
            "isRead": random.choice([False, False, True]),
            "status": "Active",
            "deleted": False,
            "createdAt": random_date(15),
            "updatedAt": now()
        })

    print("Notifications created: 50 records.")


# ============================================================
# ACTIVITY LOGS - 50
# ============================================================

def create_activity_logs():
    modules = [
        "Users", "Categories", "Suppliers", "Inventory", "Sales",
        "Feedback", "Analytics", "Reports", "Notifications"
    ]
    actions = ["Created", "Updated", "Viewed", "Generated", "Seeded"]

    for i in range(50):
        module = random.choice(modules)
        action = random.choice(actions)
        doc_ref = db.collection("activity_logs").document()

        doc_ref.set({
            "activityLogId": doc_ref.id,
            "action": f"{action} {module} data",
            "module": module,
            "performedBy": "System",
            "status": "Active",
            "deleted": False,
            "createdAt": random_date(30),
            "updatedAt": now()
        })

    print("Activity logs created: 50 records.")


# ============================================================
# ANALYTICS - CONNECTED FROM ACTUAL SALES, INVENTORY, FEEDBACK
# ============================================================

def create_analytics():
    sales_docs = list(db.collection("sales").where("deleted", "==", False).stream())
    inventory_docs = list(db.collection("inventory").where("deleted", "==", False).stream())
    feedback_docs = list(db.collection("feedback").where("deleted", "==", False).stream())

    inventory_lookup = {}
    for doc in inventory_docs:
        item = doc.to_dict()
        inventory_lookup[item["inventoryId"]] = item

    total_revenue = 0
    total_quantity_sold = 0

    item_sales = {}
    item_revenue = {}
    category_sales = {}
    daily_sales = {}

    for doc in sales_docs:
        sale = doc.to_dict()

        amount = float(sale.get("amountPaid", sale.get("totalAmount", 0)) or 0)
        total_revenue += amount

        created_at = sale.get("createdAt")
        if isinstance(created_at, datetime):
            date_key = created_at.strftime("%Y-%m-%d")
        else:
            date_key = str(created_at)[:10]

        daily_sales[date_key] = daily_sales.get(date_key, 0) + amount

        for sale_item in sale.get("items", []):
            item_id = sale_item.get("itemId") or sale_item.get("inventoryId")
            qty = int(sale_item.get("quantity", 0) or 0)

            total_quantity_sold += qty

            inventory_item = inventory_lookup.get(item_id, {})
            item_name = sale_item.get("itemName") or inventory_item.get("itemName", "Unknown")
            category_name = inventory_item.get("categoryName", "Unknown")

            line_revenue = float(sale_item.get("subtotal", 0) or 0)

            item_sales[item_name] = item_sales.get(item_name, 0) + qty
            item_revenue[item_name] = item_revenue.get(item_name, 0) + line_revenue
            category_sales[category_name] = category_sales.get(category_name, 0) + line_revenue

    total_inventory_value = 0
    low_stock_count = 0
    expired_count = 0

    for doc in inventory_docs:
        item = doc.to_dict()

        quantity = int(item.get("quantity", 0) or 0)
        minimum_stock = int(item.get("minimumStock", 0) or 0)
        selling_price = float(item.get("sellingPrice", 0) or 0)

        total_inventory_value += quantity * selling_price

        if quantity <= minimum_stock:
            low_stock_count += 1

        expiration = item.get("expirationDate")
        if expiration:
            try:
                expiration_dt = datetime.fromisoformat(expiration)
                if expiration_dt < now():
                    expired_count += 1
            except Exception:
                pass

    average_rating = 0
    if feedback_docs:
        total_rating = sum(float(doc.to_dict().get("rating", 0) or 0) for doc in feedback_docs)
        average_rating = round(total_rating / len(feedback_docs), 2)

    best_sellers = [
        {
            "name": name,
            "itemName": name,
            "quantitySold": qty,
            "totalSold": qty,
            "sold": qty,
            "revenue": item_revenue.get(name, 0)
        }
        for name, qty in sorted(item_sales.items(), key=lambda x: x[1], reverse=True)[:10]
    ]

    sales_chart = [
        {
            "date": date,
            "day": date,
            "sales": amount,
            "total": amount,
            "totalSales": amount,
            "revenue": amount
        }
        for date, amount in sorted(daily_sales.items())
    ]

    category_chart = [
        {
            "name": name,
            "categoryName": name,
            "category": name,
            "value": amount,
            "sales": amount,
            "total": amount
        }
        for name, amount in category_sales.items()
    ]

    dashboard = {
        "analyticsId": "dashboard",

        "totalSales": total_revenue,
        "totalRevenue": total_revenue,
        "revenue": total_revenue,

        "totalOrders": len(sales_docs),
        "totalQuantitySold": total_quantity_sold,

        "totalInventory": len(inventory_docs),
        "totalProducts": len(inventory_docs),
        "totalItems": len(inventory_docs),
        "inventoryValue": total_inventory_value,

        "totalFeedback": len(feedback_docs),
        "averageRating": average_rating,

        "lowStockCount": low_stock_count,
        "expiredCount": expired_count,

        "bestSellers": best_sellers,
        "salesChart": sales_chart,
        "categoryChart": category_chart,

        "status": "Active",
        "deleted": False,
        "createdAt": now(),
        "updatedAt": now()
    }

    db.collection("analytics").document("dashboard").set(dashboard)

    print("Analytics/dashboard created.")


# ============================================================
# REPORTS - 50
# ============================================================

def create_reports():
    report_types = ["Sales", "Inventory", "Feedback", "Analytics", "Best Sellers"]

    for i in range(50):
        rtype = random.choice(report_types)
        doc_ref = db.collection("reports").document()

        doc_ref.set({
            "reportId": doc_ref.id,
            "title": f"{rtype} Report #{i + 1}",
            "type": rtype,
            "summary": f"Generated {rtype.lower()} report for testing.",
            "status": "Active",
            "deleted": False,
            "createdAt": random_date(30),
            "updatedAt": now()
        })

    print("Reports created: 50 records.")


# ============================================================
# RUN ALL
# ============================================================

if __name__ == "__main__":
    clear_all()

    users = create_users()
    category_ids = create_categories()
    suppliers = create_suppliers()
    inventory_data = create_inventory(category_ids, suppliers)

    create_sales(inventory_data, users)
    create_feedback()
    create_notifications()
    create_activity_logs()
    create_analytics()
    create_reports()

    print("================================================")
    print("ALL SEED DATA COMPLETED SUCCESSFULLY")
    print("Admin login: admin@example.com / 123456")
    print("Staff login: staff@example.com / 123456")
    print("Customer login: customer@example.com / 123456")
    print("================================================")
