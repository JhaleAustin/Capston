import { useEffect, useState } from "react";

import {
  getFeedback,
  updateFeedback,
  deleteFeedback
} from "../../api/feedbackApi";

function Feedback() {
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

  return (
    <div>
      <h1>Feedback Management</h1>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {feedback.length === 0 ? (
            <tr>
              <td colSpan="6">No feedback found.</td>
            </tr>
          ) : (
            feedback.map((item) => (
              <tr key={item.feedbackId}>
                <td>{item.customerName}</td>
                <td>{item.email}</td>
                <td>{item.rating}</td>
                <td>{item.comment}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => markAsRead(item.feedbackId)}>
                    Mark as Read
                  </button>

                  <button onClick={() => handleDelete(item.feedbackId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Feedback;