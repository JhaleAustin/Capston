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

  const aiButtons = [
    ["Business Summary", "summary", "Generate an overview of business performance."],
    ["Sales Insights", "sales", "Analyze sales trends and product movement."],
    ["Inventory Recommendation", "inventory", "Suggest stock and inventory improvements."],
    ["Feedback Analysis", "feedback", "Summarize customer feedback and concerns."],
    ["Sales Forecast", "forecast", "Predict future sales based on current data."]
  ];

  return (
    <div style={page}>
      <div style={header}>
        <h1 style={titleStyle}>AI Insights</h1>
        <p style={subtitle}>
          Generate intelligent business recommendations for Kyojiro Inshokuten.
        </p>
      </div>

      <div style={buttonGrid}>
        {aiButtons.map(([label, type, description]) => (
          <button
            key={type}
            onClick={() => runAI(type)}
            style={aiButton}
            disabled={loading}
          >
            <h3 style={buttonTitle}>{label}</h3>
            <p style={buttonText}>{description}</p>
          </button>
        ))}
      </div>

      <div style={resultCard}>
        {loading && (
          <div style={loadingBox}>
            <div style={spinner}></div>
            <p>Generating AI result...</p>
          </div>
        )}

        {!loading && !result && (
          <div style={emptyState}>
            <h2>AI Result Preview</h2>
            <p>Select an AI tool above to generate insights.</p>
          </div>
        )}

        {!loading && result && (
          <>
            <div style={resultHeader}>
              <h2 style={resultTitle}>{title}</h2>
              <span style={badge}>AI Generated</span>
            </div>

            <pre style={resultText}>{result}</pre>
          </>
        )}
      </div>
    </div>
  );
}

const page = {
  padding: "30px",
};

const header = {
  background: "linear-gradient(135deg, #7A1313, #9B1C1C)",
  color: "white",
  padding: "30px",
  borderRadius: "20px",
  marginBottom: "25px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
};

const titleStyle = {
  margin: 0,
  fontSize: "34px",
};

const subtitle = {
  marginTop: "10px",
  color: "#F5F2ED",
};

const buttonGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "18px",
  marginBottom: "25px",
};

const aiButton = {
  background: "#FFFFFF",
  border: "1px solid #eee",
  borderLeft: "6px solid #9B1C1C",
  borderRadius: "18px",
  padding: "22px",
  textAlign: "left",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const buttonTitle = {
  margin: 0,
  color: "#7A1313",
  fontSize: "18px",
};

const buttonText = {
  marginTop: "10px",
  color: "#666",
  fontSize: "14px",
  lineHeight: "1.5",
};

const resultCard = {
  background: "#FFFFFF",
  borderRadius: "20px",
  padding: "26px",
  minHeight: "260px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const resultHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #eee",
  paddingBottom: "15px",
  marginBottom: "20px",
};

const resultTitle = {
  margin: 0,
  color: "#111",
};

const badge = {
  background: "#FFF0D6",
  color: "#9B1C1C",
  padding: "8px 14px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "700",
};

const resultText = {
  whiteSpace: "pre-wrap",
  fontFamily: "Arial, sans-serif",
  lineHeight: "1.7",
  color: "#333",
  margin: 0,
};

const emptyState = {
  textAlign: "center",
  color: "#777",
  padding: "50px 20px",
};

const loadingBox = {
  textAlign: "center",
  color: "#7A1313",
  padding: "50px 20px",
  fontWeight: "700",
};

const spinner = {
  width: "40px",
  height: "40px",
  border: "4px solid #F5F2ED",
  borderTop: "4px solid #9B1C1C",
  borderRadius: "50%",
  margin: "0 auto 15px",
};

export default AI;