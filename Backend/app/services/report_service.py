from app.core.firebase import db
from app.utils.response import success_response


def report():

    sales = []

    total = 0

    docs = db.collection("sales").where(
        "deleted", "==", False
    ).stream()

    for doc in docs:

        data = doc.to_dict()

        total += data["total"]

        sales.append(data)

    return success_response(
        "Sales Report",
        {
            "transactions": len(sales),
            "totalRevenue": total,
            "sales": sales
        }
    )