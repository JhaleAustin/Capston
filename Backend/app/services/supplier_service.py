from app.core.firebase import db
from app.utils.response import success_response, error_response
from google.cloud.firestore_v1 import SERVER_TIMESTAMP


# CREATE
def create_supplier(data):

    try:

        doc = db.collection("suppliers").document()

        supplier = {
            "supplierId": doc.id,
            "companyName": data.companyName,
            "contactPerson": data.contactPerson,
            "email": data.email,
            "phone": data.phone,
            "address": data.address,
            "status": "Active",
            "deleted": False,
            "createdAt": SERVER_TIMESTAMP,
            "updatedAt": SERVER_TIMESTAMP
        }

        doc.set(supplier)

        return success_response(
            "Supplier created successfully.",
            {
                "supplierId": doc.id
            }
        )

    except Exception as e:
        return error_response(str(e))


# GET ALL
def get_all_suppliers():

    try:

        suppliers = []

        docs = db.collection("suppliers") \
            .where("deleted", "==", False) \
            .stream()

        for doc in docs:
            suppliers.append(doc.to_dict())

        return success_response(
            "Suppliers retrieved successfully.",
            suppliers
        )

    except Exception as e:
        return error_response(str(e))


# GET ONE
def get_supplier(supplier_id):

    try:

        doc = db.collection("suppliers").document(supplier_id).get()

        if not doc.exists:
            return error_response("Supplier not found.")

        return success_response(
            "Supplier retrieved successfully.",
            doc.to_dict()
        )

    except Exception as e:
        return error_response(str(e))


# UPDATE
def update_supplier(supplier_id, data):

    try:

        supplier_ref = db.collection("suppliers").document(supplier_id)

        if not supplier_ref.get().exists:
            return error_response("Supplier not found.")

        update_data = {}

        if data.companyName is not None:
            update_data["companyName"] = data.companyName

        if data.contactPerson is not None:
            update_data["contactPerson"] = data.contactPerson

        if data.email is not None:
            update_data["email"] = data.email

        if data.phone is not None:
            update_data["phone"] = data.phone

        if data.address is not None:
            update_data["address"] = data.address

        if data.status is not None:
            update_data["status"] = data.status

        update_data["updatedAt"] = SERVER_TIMESTAMP

        supplier_ref.update(update_data)

        return success_response(
            "Supplier updated successfully."
        )

    except Exception as e:
        return error_response(str(e))


# DELETE (Soft Delete)
def delete_supplier(supplier_id):

    try:

        supplier_ref = db.collection("suppliers").document(supplier_id)

        if not supplier_ref.get().exists:
            return error_response("Supplier not found.")

        supplier_ref.update({
            "deleted": True,
            "status": "Deleted",
            "updatedAt": SERVER_TIMESTAMP
        })

        return success_response(
            "Supplier deleted successfully."
        )

    except Exception as e:
        return error_response(str(e))