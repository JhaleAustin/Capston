import { useState } from "react";

import {
  getBusinessSummary,
  getSalesInsights,
  getInventoryRecommendation,
  getFeedbackAnalysis,
  getSalesForecast
} from "../../api/aiApi";

function AI() {
  const [result, setResult] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const runAI = async (type) => {
    try {
      setLoading(true);
      setResult("");

      let response;

      if (type === "summary") {
        response = await getBusinessSummary();
        setTitle("Business Summary");
      }

      if (type === "sales") {
        response = await getSalesInsights();
        setTitle("Sales Insights");
      }

      if (type === "inventory") {
        response = await getInventoryRecommendation();
        setTitle("Inventory Recommendation");
      }

      if (type === "feedback") {
        response = await getFeedbackAnalysis();
        setTitle("Feedback Analysis");
      }

      if (type === "forecast") {
        response = await getSalesForecast();
        setTitle("AI Sales Forecast / Predictive Analytics");
      }

      if (!response.success) {
        alert(response.message);
        return;
      }

      setResult(
        response.data.summary ||
        response.data.insights ||
        response.data.recommendation ||
        response.data.analysis ||
        response.data.forecast ||
        "No AI result found."
      );
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to load AI result."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Insights</h1>

      <button onClick={() => runAI("summary")}>
        Business Summary
      </button>

      <button onClick={() => runAI("sales")}>
        Sales Insights
      </button>

      <button onClick={() => runAI("inventory")}>
        Inventory Recommendation
      </button>

      <button onClick={() => runAI("feedback")}>
        Feedback Analysis
      </button>

      <button onClick={() => runAI("forecast")}>
        Sales Forecast / Predictive Analytics
      </button>

      <hr />

      {loading && <p>Generating AI result...</p>}

      {result && (
        <div style={card}>
          <h2>{title}</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "8px",
  background: "#fff"
};

export default AI;