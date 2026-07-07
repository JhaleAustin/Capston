import { useEffect, useState } from "react";

import {
  getFeedback,
  updateFeedback,
  deleteFeedback
} from "../../api/feedbackApi";

function Feedback() {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [feedback, setFeedback] = useState([]);

  const loadFeedback = async () => {
    const response = await getFeedback();

    if (response.success) {
      setFeedback(response.data);
    }
  };
 
  useEffect(() => {
    loadFeedback();
  }, []);

  const markAsRead = async (feedbackId) => {
    await updateFeedback(feedbackId, {
      status: "Read"
    });

    alert("Feedback marked as read.");
    loadFeedback();
  };

  const handleDelete = async (feedbackId) => {
    if (!confirm("Delete this feedback?")) return;

    await deleteFeedback(feedbackId);
    alert("Feedback deleted.");
    loadFeedback();
  };

const totalPages = Math.ceil(feedback.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;

const paginatedFeedback = feedback.slice(
  startIndex,
  startIndex + itemsPerPage
);


 return (
  <div style={page}>
    <div style={header}>
      <h1 style={title}>Feedback Management</h1>
      <p style={subtitle}>
        Monitor customer reviews and feedback for Kyojiro Inshokuten.
      </p>
    </div>

    <div style={tableCard}>
      <div style={tableHeader}>
        <div>
          <h2 style={sectionTitle}>Customer Feedback</h2>
          <p style={smallText}>
            Total Feedback: {feedback.length}
          </p>
        </div>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Customer</th>
            <th style={th}>Email</th>
            <th style={th}>Rating</th>
            <th style={th}>Comment</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedFeedback.length === 0 ? (
            <tr>
              <td colSpan="6" style={emptyCell}>
                No feedback found.
              </td>
            </tr>
          ) : (
            paginatedFeedback.map((item) => (
              <tr key={item.feedbackId}>
                <td style={td}>
                  <div style={userBox}>
                    <div style={avatar}>
                      {item.customerName?.charAt(0)}
                    </div>

                    {item.customerName}
                  </div>
                </td>

                <td style={td}>{item.email}</td>

                <td style={td}>
                  {"⭐".repeat(item.rating)}
                </td>

                <td style={td}>
                  {item.comment}
                </td>

                <td style={td}>
                  <span
                    style={{
                      ...statusBadge,
                      background:
                        item.status === "Unread"
                          ? "#FFF0D6"
                          : "#E8F7E8",
                      color:
                        item.status === "Unread"
                          ? "#9B1C1C"
                          : "#0A7A28",
                    }}
                  >
                    {item.status}
                  </span>
                </td>

                <td style={td}>
                  {item.status === "Unread" && (
                    <button
                      style={readBtn}
                      onClick={() =>
                        markAsRead(item.feedbackId)
                      }
                    >
                      Mark Read
                    </button>
                  )}

                  <button
                    style={deleteBtn}
                    onClick={() =>
                      handleDelete(item.feedbackId)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {feedback.length > itemsPerPage && (
        <div style={pagination}>
          <button
            style={pageBtn}
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
          >
            Previous
          </button>

          <span style={pageText}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            style={pageBtn}
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  </div>
);
}
const page = {
  padding: "30px",
};

const header = {
  background:
    "linear-gradient(135deg,#7A1313,#9B1C1C)",
  color: "white",
  padding: "30px",
  borderRadius: "22px",
  marginBottom: "25px",
};

const title = {
  margin: 0,
  fontSize: "32px",
};

const subtitle = {
  marginTop: "10px",
  color: "#F5F2ED",
};

const tableCard = {
  background: "#fff",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
};

const tableHeader = {
  marginBottom: "20px",
};

const sectionTitle = {
  color: "#7A1313",
  margin: 0,
};

const smallText = {
  marginTop: "8px",
  color: "#777",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  background: "#9B1C1C",
  color: "white",
  padding: "15px",
  textAlign: "left",
};

const td = {
  padding: "15px",
  borderBottom: "1px solid #eee",
};

const emptyCell = {
  textAlign: "center",
  padding: "40px",
  color: "#777",
};

const userBox = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const avatar = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "#E7C56A",
  color: "#111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const statusBadge = {
  padding: "8px 15px",
  borderRadius: "20px",
  fontWeight: "700",
  fontSize: "13px",
};

const readBtn = {
  padding: "9px 14px",
  border: "none",
  background: "#E7C56A",
  color: "#111",
  borderRadius: "10px",
  marginRight: "8px",
  cursor: "pointer",
  fontWeight: "700",
};

const deleteBtn = {
  padding: "9px 14px",
  border: "none",
  background: "#9B1C1C",
  color: "white",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const pagination = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  marginTop: "25px",
};

const pageBtn = {
  padding: "10px 18px",
  background: "#7A1313",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};

const pageText = {
  fontWeight: "700",
};
export default Feedback;