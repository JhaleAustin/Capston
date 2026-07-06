from app.core.firebase import db
from app.utils.response import success_response, error_response


def dashboard():

    try:

        users = len(list(db.collection("users").where("deleted", "==", False).stream()))

        categories = len(list(db.collection("categories").where("deleted", "==", False).stream()))

        suppliers = len(list(db.collection("suppliers").where("deleted", "==", False).stream()))

        inventory = list(db.collection("inventory").where("deleted", "==", False).stream())

        sales = list(db.collection("sales").where("deleted", "==", False).stream())

        feedback = len(list(db.collection("feedback").where("deleted", "==", False).stream()))

        notifications = len(list(db.collection("notifications").where("deleted", "==", False).stream()))

        total_inventory = len(inventory)

        total_sales = len(sales)

        total_revenue = 0

        low_stock = 0

        best_selling = {}

        for sale in sales:

            sale_data = sale.to_dict()

            total_revenue += sale_data["total"]

            for item in sale_data["items"]:

                name = item["itemName"]

                qty = item["quantity"]

                if name not in best_selling:
                    best_selling[name] = 0

                best_selling[name] += qty

        for item in inventory:

            data = item.to_dict()

            if data["quantity"] <= data["minimumStock"]:

                low_stock += 1

        ranking = sorted(
            best_selling.items(),
            key=lambda x: x[1],
            reverse=True
        )

        return success_response(
            "Dashboard analytics retrieved successfully.",
            {
                "totalUsers": users,
                "totalCategories": categories,
                "totalSuppliers": suppliers,
                "totalInventory": total_inventory,
                "totalSales": total_sales,
                "totalRevenue": total_revenue,
                "totalFeedback": feedback,
                "totalNotifications": notifications,
                "lowStockItems": low_stock,
                "bestSelling": ranking[:5]
            }
        )

    except Exception as e:

        return error_response(str(e))