from app.core.firebase import db
from app.utils.response import success_response, error_response
from google.cloud.firestore_v1 import SERVER_TIMESTAMP
from datetime import datetime
import uuid


# CREATE SALE
def create_sale(data):

    try:

        sales_ref = db.collection("sales").document()

        subtotal = 0

        items_list = []

        for item in data.items:

            inventory = db.collection("inventory").document(item.itemId).get()

            if not inventory.exists:
                return error_response("Inventory item not found.")

            inventory_data = inventory.to_dict()

            if inventory_data["quantity"] < item.quantity:
                return error_response(
                    f"{inventory_data['itemName']} has insufficient stock."
                )

            item_total = inventory_data["sellingPrice"] * item.quantity

            subtotal += item_total

            items_list.append({
                "itemId": inventory.id,
                "itemName": inventory_data["itemName"],
                "price": inventory_data["sellingPrice"],
                "quantity": item.quantity,
                "subtotal": item_total
            })

            db.collection("inventory").document(item.itemId).update({
                "quantity": inventory_data["quantity"] - item.quantity,
                "updatedAt": SERVER_TIMESTAMP
            })

        total = subtotal + data.tax - data.discount

        change = data.amountPaid - total

        if change < 0:
            return error_response("Insufficient payment.")

        invoice = "INV-" + uuid.uuid4().hex[:8].upper()

        sales_ref.set({

            "saleId": sales_ref.id,

            "invoiceNo": invoice,

            "customerName": data.customerName,

            "cashierId": data.cashierId,

            "cashierName": data.cashierName,

            "items": items_list,

            "subtotal": subtotal,

            "discount": data.discount,

            "tax": data.tax,

            "total": total,

            "paymentMethod": data.paymentMethod,

            "amountPaid": data.amountPaid,

            "change": change,

            "status": "Completed",

            "deleted": False,

            "createdAt": SERVER_TIMESTAMP,

            "updatedAt": SERVER_TIMESTAMP

        })

        return success_response(
            "Sale completed successfully.",
            {
                "saleId": sales_ref.id,
                "invoiceNo": invoice,
                "total": total,
                "change": change
            }
        )

    except Exception as e:
        return error_response(str(e))


# GET ALL SALES
def get_all_sales():

    try:

        sales = []

        docs = db.collection("sales").where(
            "deleted", "==", False
        ).stream()

        for doc in docs:
            sales.append(doc.to_dict())

        return success_response(
            "Sales retrieved successfully.",
            sales
        )

    except Exception as e:
        return error_response(str(e))


# GET ONE SALE
def get_sale(sale_id):

    try:

        doc = db.collection("sales").document(sale_id).get()

        if not doc.exists:
            return error_response("Sale not found.")

        return success_response(
            "Sale retrieved successfully.",
            doc.to_dict()
        )

    except Exception as e:
        return error_response(str(e))


# DELETE SALE
def delete_sale(sale_id):

    try:

        sale = db.collection("sales").document(sale_id)

        if not sale.get().exists:
            return error_response("Sale not found.")

        sale.update({
            "deleted": True,
            "status": "Cancelled",
            "updatedAt": SERVER_TIMESTAMP
        })

        return success_response(
            "Sale deleted successfully."
        )

    except Exception as e:
        return error_response(str(e))
    
from datetime import datetime

def daily_sales():

    try:

        today = datetime.now().strftime("%Y-%m-%d")

        sales = []

        docs = db.collection("sales").where(
            "deleted", "==", False
        ).stream()

        total = 0

        for doc in docs:

            sale = doc.to_dict()

            created = sale["createdAt"]

            if created.strftime("%Y-%m-%d") == today:

                sales.append(sale)

                total += sale["total"]

        return success_response(
            "Daily sales retrieved.",
            {
                "totalSales": total,
                "transactions": len(sales),
                "sales": sales
            }
        )

    except Exception as e:
        return error_response(str(e))
    
def monthly_sales():

    try:

        month = datetime.now().strftime("%Y-%m")

        sales = []

        total = 0

        docs = db.collection("sales").where(
            "deleted", "==", False
        ).stream()

        for doc in docs:

            sale = doc.to_dict()

            if sale["createdAt"].strftime("%Y-%m") == month:

                sales.append(sale)

                total += sale["total"]

        return success_response(
            "Monthly sales retrieved.",
            {
                "totalSales": total,
                "transactions": len(sales),
                "sales": sales
            }
        )

    except Exception as e:
        return error_response(str(e))
    
def best_selling():

    try:

        products = {}

        docs = db.collection("sales").where(
            "deleted", "==", False
        ).stream()

        for doc in docs:

            sale = doc.to_dict()

            for item in sale["items"]:

                name = item["itemName"]

                qty = item["quantity"]

                if name not in products:
                    products[name] = 0

                products[name] += qty

        ranking = sorted(
            products.items(),
            key=lambda x: x[1],
            reverse=True
        )

        return success_response(
            "Best selling products.",
            ranking
        )

    except Exception as e:
        return error_response(str(e))