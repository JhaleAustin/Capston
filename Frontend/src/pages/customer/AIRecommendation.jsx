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

      const response = await askAI({ question: finalQuestion });

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
    <div style={page}>
      <div style={hero}>
        <div>
          <h1 style={title}>AI Food Recommendation</h1>
          <p style={subtitle}>
            Ask Kyojiro AI to recommend food based on customer preferences.
          </p>
        </div>
        <div style={aiBadge}>AI Assistant</div>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Quick Suggestions</h2>

        <div style={suggestionGrid}>
          <button
            style={suggestionBtn}
            onClick={() =>
              askSuggestion("What food do you recommend for a first-time customer?")
            }
          >
            First-time Customer
          </button>

          <button
            style={suggestionBtn}
            onClick={() => askSuggestion("What is the best seller?")}
          >
            Best Seller
          </button>

          <button
            style={suggestionBtn}
            onClick={() =>
              askSuggestion("I want something light. What do you recommend?")
            }
          >
            Light Meal
          </button>

          <button
            style={suggestionBtn}
            onClick={() =>
              askSuggestion("I want something sweet. What do you recommend?")
            }
          >
            Sweet Option
          </button>
        </div>

        <form onSubmit={handleAsk} style={form}>
          <label style={label}>Ask your own question</label>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: I want something affordable and filling."
            required
            style={textarea}
          />

          <button type="submit" style={primaryBtn} disabled={loading}>
            {loading ? "Generating..." : "Ask AI"}
          </button>
        </form>
      </div>

      <div style={resultCard}>
        {loading && (
          <div style={loadingBox}>
            <div style={spinner}></div>
            <p>Generating food recommendation...</p>
          </div>
        )}

        {!loading && !answer && (
          <div style={emptyState}>
            <h2>Recommendation Preview</h2>
            <p>Your AI food suggestion will appear here.</p>
          </div>
        )}

        {!loading && answer && (
          <>
            <div style={resultHeader}>
              <h2 style={resultTitle}>AI Recommendation</h2>
              <span style={resultBadge}>Kyojiro AI</span>
            </div>

            <div style={answerBox}>
              {answer}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const page = {
  padding: "30px",
};

const hero = {
  background: "linear-gradient(135deg, #7A1313, #9B1C1C)",
  color: "white",
  padding: "32px",
  borderRadius: "24px",
  marginBottom: "25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
};

const title = {
  margin: 0,
  fontSize: "34px",
};

const subtitle = {
  marginTop: "10px",
  color: "#F5F2ED",
};

const aiBadge = {
  background: "#E7C56A",
  color: "#111",
  padding: "12px 18px",
  borderRadius: "30px",
  fontWeight: "900",
};

const card = {
  background: "#FFFFFF",
  padding: "26px",
  borderRadius: "22px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  marginBottom: "25px",
};

const sectionTitle = {
  margin: 0,
  color: "#7A1313",
};

const suggestionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
  marginTop: "20px",
  marginBottom: "24px",
};

const suggestionBtn = {
  background: "#FFF0D6",
  color: "#7A1313",
  border: "1px solid #E7C56A",
  padding: "14px",
  borderRadius: "14px",
  fontWeight: "800",
  cursor: "pointer",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const label = {
  fontWeight: "800",
  color: "#333",
};

const textarea = {
  width: "100%",
  minHeight: "130px",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #ddd",
  fontSize: "15px",
  resize: "vertical",
};

const primaryBtn = {
  alignSelf: "flex-start",
  background: "#9B1C1C",
  color: "white",
  border: "none",
  padding: "14px 24px",
  borderRadius: "14px",
  fontWeight: "800",
  cursor: "pointer",
};

const resultCard = {
  background: "#FFFFFF",
  borderRadius: "22px",
  padding: "26px",
  minHeight: "220px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const resultHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #eee",
  paddingBottom: "15px",
  marginBottom: "18px",
};

const resultTitle = {
  margin: 0,
  color: "#7A1313",
};

const resultBadge = {
  background: "#E7C56A",
  color: "#111",
  padding: "8px 14px",
  borderRadius: "20px",
  fontWeight: "800",
  fontSize: "13px",
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
  padding: "45px 20px",
};

const loadingBox = {
  textAlign: "center",
  color: "#7A1313",
  padding: "45px 20px",
  fontWeight: "800",
};

const spinner = {
  width: "42px",
  height: "42px",
  border: "4px solid #F5F2ED",
  borderTop: "4px solid #9B1C1C",
  borderRadius: "50%",
  margin: "0 auto 15px",
};

export default AIRecommendation;