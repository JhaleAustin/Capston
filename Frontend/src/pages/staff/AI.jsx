import { useState } from "react";

import {
  getSalesInsights,
  getInventoryRecommendation,
  getFeedbackAnalysis
} from "../../api/aiApi";

function AI() {
  const [result, setResult] = useState("");

  const runAI = async (type) => {
    let response;

    if (type === "sales") {
      response = await getSalesInsights();
    }

    if (type === "inventory") {
      response =
        await getInventoryRecommendation();
    }

    if (type === "feedback") {
      response =
        await getFeedbackAnalysis();
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
      response.data
    );
  };

  return (
    <div>
      <h1>AI Assistant</h1>

      <button
        onClick={() => runAI("sales")}
      >
        Sales Insights
      </button>

      <button
        onClick={() => runAI("inventory")}
      >
        Inventory Recommendation
      </button>

      <button
        onClick={() => runAI("feedback")}
      >
        Feedback Analysis
      </button>

      <hr />

      <pre>{result}</pre>
    </div>
  );
}

export default AI;