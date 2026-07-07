import { useEffect, useState } from "react";
import {
  createFeedback,
  getFeedback
} from "../../api/feedbackApi";

function Feedback() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [feedbackList, setFeedbackList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  const [form, setForm] = useState({
    customerName: user?.name || "",
    email: user?.email || "",
    rating: 5,
    comment: ""
  });

  const loadFeedback = async () => {
    const response = await getFeedback();

    if (response.success) {
      setFeedbackList(response.data);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await createFeedback({
      ...form,
      rating: Number(form.rating)
    });

    if (!response.success) {
      alert(response.message);
      return;
    }

    alert("Feedback submitted.");

    setForm({
      customerName: user?.name || "",
      email: user?.email || "",
      rating: 5,
      comment: ""
    });

    loadFeedback();
  };

  const totalPages = Math.ceil(feedbackList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedFeedback = feedbackList.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div style={page}>
      <div style={hero}>
        <span style={heroBadge}>Customer Voice</span>
        <h1 style={title}>Share Your Feedback</h1>
        <p style={subtitle}>
          Tell us about your Kyojiro Inshokuten experience.
        </p>
      </div>

      <div style={contentGrid}>
        <div style={formCard}>
          <h2 style={sectionTitle}>Write a Review</h2>

          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              style={input}
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Name"
              required
            />

            <input
              style={input}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />

            <select
              style={input}
              name="rating"
              value={form.rating}
              onChange={handleChange}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Bad</option>
            </select>

            <textarea
              style={textarea}
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Write your feedback..."
              required
            />

            <button type="submit" style={primaryBtn}>
              Submit Feedback
            </button>
          </form>
        </div>

        <div style={reviewCard}>
          <h2 style={sectionTitle}>Community Reviews</h2>

          {paginatedFeedback.length === 0 ? (
            <div style={emptyBox}>
              <h3>No reviews yet.</h3>
              <p>Be the first to share your experience.</p>
            </div>
          ) : (
            paginatedFeedback.map((item) => (
              <div key={item.feedbackId} style={reviewItem}>
                <div style={reviewHeader}>
                  <div style={avatar}>
                    {item.customerName?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <div>
                    <h3 style={reviewName}>{item.customerName}</h3>
                    <p style={reviewEmail}>{item.email}</p>
                  </div>
                </div>

                <div style={stars}>
                  {"★".repeat(Number(item.rating))}
                  {"☆".repeat(5 - Number(item.rating))}
                </div>

                <p style={comment}>{item.comment}</p>
              </div>
            ))
          )}

          {feedbackList.length > itemsPerPage && (
            <div style={pagination}>
              <button
                style={pageBtn}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              <span style={pageText}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                style={pageBtn}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const page = {
  padding: "35px",
  background: "#F5F2ED",
  minHeight: "100vh"
};

const hero = {
  background: "linear-gradient(135deg, #7A1313, #9B1C1C)",
  color: "white",
  padding: "42px 30px",
  borderRadius: "28px",
  textAlign: "center",
  marginBottom: "30px",
  boxShadow: "0 14px 35px rgba(0,0,0,0.16)"
};

const heroBadge = {
  display: "inline-block",
  background: "#E7C56A",
  color: "#111",
  padding: "9px 18px",
  borderRadius: "30px",
  fontWeight: "900",
  marginBottom: "15px"
};

const title = {
  margin: 0,
  fontSize: "40px"
};

const subtitle = {
  marginTop: "12px",
  color: "#F5F2ED"
};

const contentGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1.4fr",
  gap: "25px"
};

const formCard = {
  background: "#FFFFFF",
  padding: "28px",
  borderRadius: "24px",
  boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
  height: "fit-content"
};

const reviewCard = {
  background: "#FFFFFF",
  padding: "28px",
  borderRadius: "24px",
  boxShadow: "0 12px 35px rgba(0,0,0,0.08)"
};

const sectionTitle = {
  margin: "0 0 20px",
  color: "#7A1313"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "14px"
};

const input = {
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "15px"
};

const textarea = {
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "15px",
  minHeight: "130px",
  resize: "vertical"
};

const primaryBtn = {
  background: "#9B1C1C",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "14px",
  fontWeight: "900",
  cursor: "pointer"
};

const reviewItem = {
  background: "#FFF9EA",
  borderLeft: "5px solid #E7C56A",
  padding: "20px",
  borderRadius: "18px",
  marginBottom: "15px"
};

const reviewHeader = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "12px"
};

const avatar = {
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  background: "#9B1C1C",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900"
};

const reviewName = {
  margin: 0,
  color: "#111"
};

const reviewEmail = {
  margin: "4px 0 0",
  color: "#777",
  fontSize: "13px"
};

const stars = {
  color: "#E7C56A",
  fontSize: "20px",
  marginBottom: "10px"
};

const comment = {
  color: "#444",
  lineHeight: "1.7",
  margin: 0
};

const emptyBox = {
  textAlign: "center",
  color: "#777",
  padding: "45px"
};

const pagination = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  marginTop: "22px"
};

const pageBtn = {
  padding: "10px 18px",
  background: "#7A1313",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer"
};

const pageText = {
  color: "#333",
  fontWeight: "700"
};

export default Feedback;