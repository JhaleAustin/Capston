import { useState } from "react";

import {
  getSalesInsights,
  getInventoryRecommendation,
  getFeedbackAnalysis
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

      if (!response.success) {
        alert(response.message);
        return;
      }

      setResult(
        response.data.summary ||
          response.data.insights ||
          response.data.recommendation ||
          response.data.analysis ||
          response.data ||
          "No AI result found."
      );
    } catch (error) {
      alert("Failed to load AI result.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={header}>
        <h1 style={titleStyle}>Staff AI Assistant</h1>
        <p style={subtitle}>
          Generate sales, inventory, and feedback insights for daily operations.
        </p>
      </div>

      <div style={buttonGrid}>
        <button style={aiButton} onClick={() => runAI("sales")}>
          <h3 style={buttonTitle}>Sales Insights</h3>
          <p style={buttonText}>View sales patterns and performance trends.</p>
        </button>

        <button style={aiButton} onClick={() => runAI("inventory")}>
          <h3 style={buttonTitle}>Inventory Recommendation</h3>
          <p style={buttonText}>Get stock and inventory improvement suggestions.</p>
        </button>

        <button style={aiButton} onClick={() => runAI("feedback")}>
          <h3 style={buttonTitle}>Feedback Analysis</h3>
          <p style={buttonText}>Understand customer comments and concerns.</p>
        </button>
      </div>

      <div style={resultCard}>
        {loading && (
          <div style={emptyState}>
            <h2 style={resultTitle}>Generating AI result...</h2>
            <p>Please wait while Kyojiro AI analyzes your data.</p>
          </div>
        )}

        {!loading && !result && (
          <div style={emptyState}>
            <h2 style={resultTitle}>AI Result Preview</h2>
            <p>Select an AI tool above to generate staff recommendations.</p>
          </div>
        )}

        {!loading && result && (
          <>
            <div style={resultHeader}>
              <h2 style={resultTitle}>{title}</h2>
              <span style={badge}>AI Generated</span>
            </div>

            <div style={answerBox}>{result}</div>
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
  borderRadius: "22px",
  marginBottom: "25px",
};

const titleStyle = {
  margin: 0,
  fontSize: "32px",
};

const subtitle = {
  marginTop: "10px",
  color: "#F5F2ED",
};

const buttonGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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
  color: "#7A1313",
};

const badge = {
  background: "#E7C56A",
  color: "#111",
  padding: "8px 14px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "700",
};

const answerBox = {
  background: "#FFF9EA",
  borderLeft: "5px solid #E7C56A",
  padding: "20px",
  borderRadius: "16px",
  whiteSpace: "pre-wrap",
  lineHeight: "1.8",
  color: "#333",
};

const emptyState = {
  textAlign: "center",
  color: "#777",
  padding: "55px 20px",
};

export default AI;