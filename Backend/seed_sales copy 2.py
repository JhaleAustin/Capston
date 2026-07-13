import random
from datetime import datetime, timedelta, timezone

import firebase_admin
from firebase_admin import credentials, firestore


# ============================================================
# SEED 100 SALES AND UPDATE INVENTORY QUANTITIES
#
# This script:
# - Reads your existing inventory collection
# - Matches items using barcode first, then item name
# - Creates 100 sales
# - Deducts sold quantities from inventory
# - Updates stock status and low-stock indicators
# - Clears only the sales collection before creating new sales
#
# Run:
#     python seed_sales_with_inventory_update.py
#
# Required:
# - firebase_key.json
# - Existing inventory collection
# - Existing users collection
# ============================================================


if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()


def now():
    return datetime.now(timezone.utc)


def random_date(days_back=90):
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
# MENU REFERENCE
# Used to identify the exact menu items expected in inventory
# ============================================================

MENU_REFERENCE = [
    {"barcode": "100000001", "itemName": "Shoyu Ramen"},
    {"barcode": "100000002", "itemName": "Miso Ramen"},
    {"barcode": "100000003", "itemName": "Spicy Miso Ramen"},
    {"barcode": "100000004", "itemName": "Tantanmen"},
    {"barcode": "100000005", "itemName": "Sakura Ramen"},
    {"barcode": "100000006", "itemName": "Karai Tonkotsu"},
    {"barcode": "100000007", "itemName": "Hire Katsu Ramen"},
    {"barcode": "100000008", "itemName": "Toyama Black"},
    {"barcode": "100000009", "itemName": "Shogayaki Don"},
    {"barcode": "100000010", "itemName": "Karaage Don"},
    {"barcode": "100000011", "itemName": "Buta Stamina Don"},
    {"barcode": "100000012", "itemName": "Teriyaki Don"},
    {"barcode": "100000013", "itemName": "Katsudon"},
    {"barcode": "100000014", "itemName": "Gyudon"},
    {"barcode": "100000015", "itemName": "Tendon"},
    {"barcode": "100000016", "itemName": "Teriyaki Bento"},
    {"barcode": "100000017", "itemName": "Buta Stamina Bento"},
    {"barcode": "100000018", "itemName": "Tempura Bento"},
    {"barcode": "100000019", "itemName": "Taiyaki"},
    {"barcode": "100000020", "itemName": "Katsu Burger"},
]


def get_customers():
    customers = []

    for doc in db.collection("users").stream():
        data = doc.to_dict()

        role = str(data.get("role", "")).lower()
        deleted = bool(data.get("deleted", False))
        status = str(data.get("status", "Active")).lower()

        if role == "customer" and not deleted and status != "inactive":
            customers.append({
                "customerId": data.get("userId") or data.get("uid") or doc.id,
                "name": data.get("name", "Customer"),
                "email": data.get("email", ""),
            })

    if not customers:
        raise RuntimeError(
            "No customer accounts found. Run your user seed first."
        )

    print(f"Customers found: {len(customers)}")
    return customers


def get_cashiers():
    cashiers = []

    for doc in db.collection("users").stream():
        data = doc.to_dict()

        role = str(data.get("role", "")).lower()
        deleted = bool(data.get("deleted", False))
        status = str(data.get("status", "Active")).lower()

        if (
            role in ["admin", "staff"]
            and not deleted
            and status != "inactive"
        ):
            cashiers.append({
                "cashierId": data.get("userId") or data.get("uid") or doc.id,
                "cashierName": data.get("name", "System Cashier"),
            })

    if not cashiers:
        cashiers = [{
            "cashierId": "system-admin",
            "cashierName": "Admin User",
        }]

    return cashiers


def get_inventory_items():
    inventory_docs = list(db.collection("inventory").stream())

    if not inventory_docs:
        raise RuntimeError("No inventory documents found.")

    by_barcode = {}
    by_name = {}

    for doc in inventory_docs:
        data = doc.to_dict()

        barcode = str(data.get("barcode", "")).strip()
        item_name = str(
            data.get("itemName")
            or data.get("name")
            or ""
        ).strip()

        quantity = int(
            data.get(
                "quantity",
                data.get("stock", 0),
            ) or 0
        )

        selling_price = float(
            data.get(
                "sellingPrice",
                data.get("price", 0),
            ) or 0
        )

        minimum_stock = int(
            data.get(
                "minimumStock",
                data.get("minStock", 0),
            ) or 0
        )

        item = {
            "documentId": doc.id,
            "inventoryId": (
                data.get("inventoryId")
                or data.get("productId")
                or doc.id
            ),
            "barcode": barcode,
            "itemName": item_name,
            "category": (
                data.get("categoryName")
                or data.get("category")
                or ""
            ),
            "supplier": (
                data.get("supplierName")
                or data.get("supplier")
                or ""
            ),
            "costPrice": float(data.get("costPrice", data.get("cost", 0)) or 0),
            "sellingPrice": selling_price,
            "quantity": quantity,
            "minimumStock": minimum_stock,
        }

        if barcode:
            by_barcode[barcode] = item

        if item_name:
            by_name[item_name.lower()] = item

    matched_items = []

    for reference in MENU_REFERENCE:
        item = by_barcode.get(reference["barcode"])

        if not item:
            item = by_name.get(reference["itemName"].lower())

        if item:
            matched_items.append(item)
        else:
            print(
                f"Not found in inventory: "
                f"{reference['itemName']} ({reference['barcode']})"
            )

    if not matched_items:
        raise RuntimeError(
            "None of the expected menu items matched your inventory."
        )

    print(f"Matched inventory items: {len(matched_items)}")
    return matched_items


def update_inventory_item(item, new_quantity):
    minimum_stock = item["minimumStock"]

    if new_quantity <= 0:
        stock_status = "Out of Stock"
    elif new_quantity <= minimum_stock:
        stock_status = "Low Stock"
    else:
        stock_status = "In Stock"

    db.collection("inventory").document(item["documentId"]).update({
        "quantity": new_quantity,
        "stock": new_quantity,
        "stockStatus": stock_status,
        "isLowStock": new_quantity <= minimum_stock,
        "updatedAt": now(),
    })


def create_sales(number_of_sales=100):
    customers = get_customers()
    cashiers = get_cashiers()
    inventory_items = get_inventory_items()

    stock_tracker = {
        item["inventoryId"]: item["quantity"]
        for item in inventory_items
    }

    created_sales = 0

    for sale_number in range(1, number_of_sales + 1):
        available_items = [
            item
            for item in inventory_items
            if stock_tracker.get(item["inventoryId"], 0) > 0
        ]

        if not available_items:
            print("Stopped because all matched inventory items are out of stock.")
            break

        customer = random.choice(customers)
        cashier = random.choice(cashiers)

        item_count = random.randint(
            1,
            min(4, len(available_items)),
        )

        selected_items = random.sample(
            available_items,
            item_count,
        )

        sale_items = []
        subtotal = 0.0
        total_cost = 0.0

        for item in selected_items:
            inventory_id = item["inventoryId"]
            current_stock = stock_tracker[inventory_id]

            max_quantity = min(3, current_stock)

            if max_quantity <= 0:
                continue

            quantity_sold = random.randint(1, max_quantity)

            selling_price = item["sellingPrice"]
            cost_price = item["costPrice"]

            line_total = round(quantity_sold * selling_price, 2)
            line_cost = round(quantity_sold * cost_price, 2)

            new_quantity = current_stock - quantity_sold
            stock_tracker[inventory_id] = new_quantity

            subtotal += line_total
            total_cost += line_cost

            sale_items.append({
                "itemId": inventory_id,
                "inventoryId": inventory_id,
                "barcode": item["barcode"],
                "itemName": item["itemName"],
                "category": item["category"],
                "supplier": item["supplier"],
                "quantity": quantity_sold,
                "costPrice": cost_price,
                "price": selling_price,
                "sellingPrice": selling_price,
                "subtotal": line_total,
                "lineCost": line_cost,
            })

            update_inventory_item(item, new_quantity)

        if not sale_items:
            continue

        subtotal = round(subtotal, 2)
        total_cost = round(total_cost, 2)

        discount = random.choice([0, 0, 0, 0, 10, 20, 30, 50])
        tax = round(subtotal * 0.12, 2)
        total_amount = round(subtotal + tax - discount, 2)
        gross_profit = round(subtotal - total_cost - discount, 2)

        payment_method = random.choice(["Cash", "GCash", "Card"])
        sale_date = random_date(90)

        doc_ref = db.collection("sales").document()

        invoice_number = (
            f"INV-{sale_date.strftime('%Y%m%d')}-"
            f"{sale_number:04d}"
        )

        sale_data = {
            "saleId": doc_ref.id,
            "orderId": doc_ref.id,

            "invoiceNumber": invoice_number,
            "invoice": invoice_number,

            "customerId": customer["customerId"],
            "customerName": customer["name"],
            "customerEmail": customer["email"],

            "cashierId": cashier["cashierId"],
            "cashierName": cashier["cashierName"],

            "paymentMethod": payment_method,
            "payment": payment_method,

            "subtotal": subtotal,
            "totalCost": total_cost,
            "grossProfit": gross_profit,
            "discount": discount,
            "tax": tax,

            "amountPaid": total_amount,
            "total": total_amount,
            "totalAmount": total_amount,
            "amount": total_amount,
            "revenue": total_amount,

            "items": sale_items,
            "totalItems": sum(
                item["quantity"]
                for item in sale_items
            ),

            "status": "Completed",
            "deleted": False,

            "saleDate": sale_date,
            "date": sale_date,
            "createdAt": sale_date,
            "updatedAt": sale_date,
        }

        doc_ref.set(sale_data)
        created_sales += 1

    print(f"Sales created: {created_sales}")



# ============================================================
# BEST-SELLER ANALYTICS
# Reads the newly created sales and writes chart-ready data to:
# analytics/dashboard
# ============================================================

def create_bestseller_analytics():
    sales_documents = list(
        db.collection("sales")
        .where("deleted", "==", False)
        .stream()
    )

    quantity_by_item = {}
    revenue_by_item = {}

    for document in sales_documents:
        sale = document.to_dict()

        if str(sale.get("status", "")).lower() != "completed":
            continue

        for item in sale.get("items", []):
            item_name = (
                item.get("itemName")
                or item.get("name")
                or "Unknown Item"
            )

            quantity = int(item.get("quantity", 0) or 0)

            line_revenue = float(
                item.get(
                    "subtotal",
                    quantity * float(
                        item.get(
                            "sellingPrice",
                            item.get("price", 0),
                        ) or 0
                    ),
                ) or 0
            )

            quantity_by_item[item_name] = (
                quantity_by_item.get(item_name, 0) + quantity
            )

            revenue_by_item[item_name] = (
                revenue_by_item.get(item_name, 0) + line_revenue
            )

    ranking = sorted(
        quantity_by_item.items(),
        key=lambda pair: pair[1],
        reverse=True,
    )[:10]

    best_sellers = []

    for rank, (item_name, quantity_sold) in enumerate(
        ranking,
        start=1,
    ):
        best_sellers.append({
            "rank": rank,

            # Different field names are included for compatibility
            # with common dashboard/API implementations.
            "name": item_name,
            "itemName": item_name,
            "productName": item_name,

            "quantitySold": quantity_sold,
            "totalSold": quantity_sold,
            "sold": quantity_sold,
            "quantity": quantity_sold,
            "sales": quantity_sold,

            "revenue": round(
                revenue_by_item.get(item_name, 0),
                2,
            ),
        })

    chart_data = [
        {
            "name": item["itemName"],
            "itemName": item["itemName"],
            "productName": item["itemName"],
            "value": item["quantitySold"],
            "quantity": item["quantitySold"],
            "quantitySold": item["quantitySold"],
            "totalSold": item["quantitySold"],
            "sold": item["quantitySold"],
            "sales": item["quantitySold"],
            "revenue": item["revenue"],
        }
        for item in best_sellers
    ]

    dashboard_reference = (
        db.collection("analytics")
        .document("dashboard")
    )

    existing_dashboard = dashboard_reference.get()

    analytics_data = {
        "bestSellers": best_sellers,
        "bestSeller": best_sellers,
        "bestSellerChart": chart_data,
        "bestSellersChart": chart_data,
        "topSellingProducts": best_sellers,
        "topProducts": best_sellers,
        "updatedAt": now(),
    }

    if existing_dashboard.exists:
        dashboard_reference.update(analytics_data)
    else:
        dashboard_reference.set({
            "analyticsId": "dashboard",
            **analytics_data,
            "status": "Active",
            "deleted": False,
            "createdAt": now(),
        })

    print("")
    print("BEST-SELLER DATA CREATED")
    print("----------------------------------------")

    if not best_sellers:
        print("No best-seller data was calculated.")
    else:
        for item in best_sellers:
            print(
                f"{item['rank']}. {item['itemName']} - "
                f"{item['quantitySold']} units"
            )

def main():
    random.seed(2026)

    print("================================================")
    print("SEEDING SALES AND UPDATING INVENTORY")
    print("================================================")

    clear_collection("sales")
    create_sales(100)
    create_bestseller_analytics()

    print("================================================")
    print("DONE")
    print("Sales were created.")
    print("Inventory quantities were deducted.")
    print("Best-seller chart data was saved to analytics/dashboard.")
    print("Refresh both Sales History and Inventory pages.")
    print("================================================")


if __name__ == "__main__":
    main()