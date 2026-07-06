import { useState } from "react";
import { askAI } from "../../api/aiApi";

function AIRecommendation() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askSuggestion = async (sampleQuestion) => {
    setQuestion(sampleQuestion);
    await handleAsk(null, sampleQuestion);
  };

  const handleAsk = async (e, customQuestion = null) => {
    if (e) e.preventDefault();

    const finalQuestion = customQuestion || question;

    if (!finalQuestion.trim()) {
      alert("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      const response = await askAI({
        question: finalQuestion
      });

      if (!response.success) {
        alert(response.message);
        return;
      }

      setAnswer(response.data.answer);
      setQuestion("");
    } catch (error) {
  console.error("AI ERROR:", error);

  alert(
    error.response?.data?.detail ||
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Failed to get AI recommendation."
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Food Recommendation</h1>
      <p>Ask AI what food best fits your preference.</p>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => askSuggestion("What food do you recommend for a first-time customer?")}>
          First-time customer
        </button>

        <button onClick={() => askSuggestion("What is the best seller?")}>
          Best seller
        </button>

        <button onClick={() => askSuggestion("I want something light. What do you recommend?")}>
          Light meal
        </button>

        <button onClick={() => askSuggestion("I want something sweet. What do you recommend?")}>
          Sweet option
        </button>
      </div>

      <form onSubmit={handleAsk}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: I want something affordable and filling."
          required
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "10px"
          }}
        />

        <br />

        <button type="submit">
          Ask AI
        </button>
      </form>

      {loading && <p>Generating recommendation...</p>}

      {answer && (
        <div style={card}>
          <h3>AI Recommendation</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{answer}</pre>
        </div>
      )}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  marginTop: "20px",
  borderRadius: "8px",
  background: "#fff"
};

export default AIRecommendation;