import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import logo from "../assets/logo.jpg";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await register(form);

      if (!response.success) {
        alert(response.message);
        return;
      }

      alert("Account created successfully. Please login.");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.detail || "Registration failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <img src={logo} alt="Kyojiro Logo" className="auth-logo-large" />
        <h1>Kyojiro Inshokuten</h1>
        <p>Create your customer account</p>
      </div>

      <div className="auth-card">
        <img src={logo} alt="Logo" className="auth-logo" />

        <h2>Create Account</h2>
        <p className="auth-subtitle">Register as a customer</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            name="name"
            placeholder="Enter your full name"
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            name="phone"
            placeholder="Enter your phone number"
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Create password"
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-btn">
            Register
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button className="secondary-btn" onClick={() => navigate("/")}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;