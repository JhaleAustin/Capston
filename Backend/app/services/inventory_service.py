from app.core.firebase import db
from app.utils.response import success_response, error_response
from google.cloud.firestore_v1 import SERVER_TIMESTAMP


def create_inventory(data):

    try:

        doc = db.collection("inventory").document()

        item = {
            "itemId": doc.id,
            "itemName": data.itemName,
            "categoryId": data.categoryId,
            "supplierId": data.supplierId,
            "barcode": data.barcode,
            "description": data.description,
            "costPrice": data.costPrice,
            "sellingPrice": data.sellingPrice,
            "quantity": data.quantity,
            "minimumStock": data.minimumStock,
            "unit": data.unit,
            "expirationDate": data.expirationDate,
            "imageUrl": data.imageUrl,
            "status": "Available",
            "deleted": False,
            "createdAt": SERVER_TIMESTAMP,
            "updatedAt": SERVER_TIMESTAMP
        }

        doc.set(item)

        return success_response(
            "Inventory item created successfully.",
            {
                "itemId": doc.id
            }
        )

    except Exception as e:
        return error_response(str(e))


def get_all_inventory():

    try:

        items = []

        docs = db.collection("inventory") \
            .where("deleted", "==", False) \
            .stream()

        for doc in docs:
            items.append(doc.to_dict())

        return success_response(
            "Inventory retrieved successfully.",
            items
        )

    except Exception as e:
        return error_response(str(e))


def get_inventory(item_id):

    try:

        doc = db.collection("inventory").document(item_id).get()

        if not doc.exists:
            return error_response("Item not found.")

        return success_response(
            "Inventory item retrieved successfully.",
            doc.to_dict()
        )

    except Exception as e:
        return error_response(str(e))
    

def update_inventory(item_id, data):

    try:

        item_ref = db.collection("inventory").document(item_id)

        if not item_ref.get().exists:
            return error_response("Item not found.")

        update_data = {}

        if data.itemName is not None:
            update_data["itemName"] = data.itemName

        if data.categoryId is not None:
            update_data["categoryId"] = data.categoryId

        if data.supplierId is not None:
            update_data["supplierId"] = data.supplierId

        if data.barcode is not None:
            update_data["barcode"] = data.barcode

        if data.description is not None:
            update_data["description"] = data.description

        if data.costPrice is not None:
            update_data["costPrice"] = data.costPrice

        if data.sellingPrice is not None:
            update_data["sellingPrice"] = data.sellingPrice

        if data.quantity is not None:
            update_data["quantity"] = data.quantity

        if data.minimumStock is not None:
            update_data["minimumStock"] = data.minimumStock

        if data.unit is not None:
            update_data["unit"] = data.unit

        if data.expirationDate is not None:
            update_data["expirationDate"] = data.expirationDate

        if data.imageUrl is not None:
            update_data["imageUrl"] = data.imageUrl

        if data.status is not None:
            update_data["status"] = data.status

        update_data["updatedAt"] = SERVER_TIMESTAMP

        item_ref.update(update_data)

        return success_response("Inventory updated successfully.")

    except Exception as e:
        return error_response(str(e))


def delete_inventory(item_id):

    try:

        item_ref = db.collection("inventory").document(item_id)

        if not item_ref.get().exists:
            return error_response("Item not found.")

        item_ref.update({
            "deleted": True,
            "status": "Deleted",
            "updatedAt": SERVER_TIMESTAMP
        })

        return success_response("Inventory deleted successfully.")

    except Exception as e:
        return error_response(str(e))


def low_stock_items():

    try:

        items = []

        docs = db.collection("inventory") \
            .where("deleted", "==", False) \
            .stream()

        for doc in docs:

            item = doc.to_dict()

            if item["quantity"] <= item["minimumStock"]:
                items.append(item)

        return success_response(
            "Low stock items retrieved.",
            items
        )

    except Exception as e:
        return error_response(str(e))


def search_inventory(keyword):

    try:

        items = []

        docs = db.collection("inventory") \
            .where("deleted", "==", False) \
            .stream()

        keyword = keyword.lower()

        for doc in docs:

            item = doc.to_dict()

            if keyword in item["itemName"].lower():
                items.append(item)

        return success_response(
            "Search completed.",
            items
        )

    except Exception as e:
        return error_response(str(e))