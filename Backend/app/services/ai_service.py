from app.core.firebase import db
from app.core.gemini import client
from app.utils.response import success_response, error_response


def ai_business_summary():

    try:

        sales = [doc.to_dict() for doc in db.collection("sales").stream()]
        inventory = [doc.to_dict() for doc in db.collection("inventory").stream()]
        feedback = [doc.to_dict() for doc in db.collection("feedback").stream()]

        prompt = f"""
You are an AI business analyst.

Analyze the business data below.

Sales:
{sales}

Inventory:
{inventory}

Customer Feedback:
{feedback}

Generate:

1. Overall business summary
2. Best-selling products
3. Low stock products
4. Restocking recommendations
5. Sales improvement suggestions
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return success_response(
            "Business summary generated successfully.",
            {
                "summary": response.text
            }
        )

    except Exception as e:

        return error_response(str(e))


def ai_chat(question):

    try:

        sales = [doc.to_dict() for doc in db.collection("sales").stream()]
        inventory = [doc.to_dict() for doc in db.collection("inventory").stream()]
        feedback = [doc.to_dict() for doc in db.collection("feedback").stream()]

        prompt = f"""
You are an AI assistant for an AI Sales Data Management System.

Business Data

Sales:
{sales}

Inventory:
{inventory}

Customer Feedback:
{feedback}

Question:

{question}

Answer ONLY using the business data provided.
If there is not enough information, say so.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return success_response(
            "AI Response",
            {
                "answer": response.text
            }
        )

    except Exception as e:

        return error_response(str(e))
    

def ai_sales_insights():

    try:

        sales = [doc.to_dict() for doc in db.collection("sales").stream()]

        prompt = f"""
You are an AI Sales Analyst.

Analyze the sales data below.

Sales Data:
{sales}

Generate a report with the following sections:

1. Overall Sales Performance
2. Best Selling Products
3. Lowest Selling Products
4. Revenue Trends
5. Peak Selling Products
6. Business Recommendations

Answer professionally using bullet points.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return success_response(
            "Sales insights generated successfully.",
            {
                "insights": response.text
            }
        )

    except Exception as e:

        return error_response(str(e))
    

def ai_inventory_recommendation():

    try:

        inventory = [doc.to_dict() for doc in db.collection("inventory").stream()]
        sales = [doc.to_dict() for doc in db.collection("sales").stream()]

        prompt = f"""
You are an Inventory Management AI.

Analyze the inventory and sales data below.

Inventory:
{inventory}

Sales:
{sales}

Generate a professional inventory report.

Include:

1. Products with low stock
2. Products with healthy stock
3. Products that should be reordered
4. Estimated stock risks
5. Restocking recommendations
6. Inventory improvement suggestions

Respond professionally using bullet points.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return success_response(
            "Inventory recommendations generated successfully.",
            {
                "recommendation": response.text
            }
        )

    except Exception as e:

        return error_response(str(e))
    

def ai_feedback_analysis():

    try:

        feedback = [doc.to_dict() for doc in db.collection("feedback").stream()]

        prompt = f"""
You are an AI Customer Experience Analyst.

Analyze the customer feedback below.

Customer Feedback:
{feedback}

Generate a report containing:

1. Overall customer satisfaction
2. Positive feedback trends
3. Negative feedback trends
4. Most mentioned compliments
5. Most mentioned complaints
6. Business improvement recommendations

Answer professionally using bullet points.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return success_response(
            "Customer feedback analysis generated successfully.",
            {
                "analysis": response.text
            }
        )

    except Exception as e:

        return error_response(str(e))
    

def ai_sales_forecast():

    try:

        sales = [doc.to_dict() for doc in db.collection("sales").stream()]

        prompt = f"""
You are an AI Sales Forecasting Expert.

Analyze the sales history below.

Sales Data:
{sales}

Predict the following:

1. Expected sales tomorrow
2. Expected sales next week
3. Expected sales next month
4. Possible high-demand products
5. Possible slow-moving products
6. Business recommendations

If historical data is insufficient, clearly state that the prediction is based on limited information.

Respond professionally using bullet points.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return success_response(
            "Sales forecast generated successfully.",
            {
                "forecast": response.text
            }
        )

    except Exception as e:

        return error_response(str(e))
    
def ai_dashboard():

    try:

        sales = [doc.to_dict() for doc in db.collection("sales").stream()]
        inventory = [doc.to_dict() for doc in db.collection("inventory").stream()]
        feedback = [doc.to_dict() for doc in db.collection("feedback").stream()]
        categories = [doc.to_dict() for doc in db.collection("categories").stream()]
        suppliers = [doc.to_dict() for doc in db.collection("suppliers").stream()]

        prompt = f"""
You are an AI Executive Business Analyst.

Analyze the business data below.

Sales:
{sales}

Inventory:
{inventory}

Categories:
{categories}

Suppliers:
{suppliers}

Customer Feedback:
{feedback}

Generate a complete executive report.

Include:

1. Executive Summary
2. Overall Business Performance
3. Sales Highlights
4. Best Selling Products
5. Low Stock Products
6. Inventory Risks
7. Customer Satisfaction
8. Supplier Performance (if applicable)
9. Business Risks
10. Top 5 Recommendations

Format the report professionally with headings and bullet points.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return success_response(
            "Executive dashboard generated successfully.",
            {
                "dashboard": response.text
            }
        )

    except Exception as e:

        return error_response(str(e))