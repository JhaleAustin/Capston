import { useEffect, useState } from "react";
import {
  createFeedback,
  getFeedback
} from "../../api/feedbackApi";

function Feedback() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [feedbackList, setFeedbackList] = useState([]);

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

  return (
    <div>
      <h1>Feedback</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <select
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
          name="comment"
          value={form.comment}
          onChange={handleChange}
          placeholder="Write feedback..."
          required
        />

        <button type="submit">Submit Feedback</button>
      </form>

      <hr />

      <h2>Community Reviews</h2>

      {feedbackList.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        feedbackList.map((item) => (
          <div key={item.feedbackId} style={card}>
            <h3>{item.customerName}</h3>
            <p>Rating: {item.rating}/5</p>
            <p>{item.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "8px"
};

export default Feedback;