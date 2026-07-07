import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("LOGIN FORM:", form);

    const response = await login(form);

    console.log("LOGIN RESPONSE:", response);

    if (!response.success) {
      alert(response.message);
      return;
    }
 
    const token = response.data.access_token;
    const user = response.data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user.role === "staff") {
      navigate("/staff/dashboard");
    } else if (user.role === "customer") {
      navigate("/customer/menu");
    } else {
      alert("Unknown role.");
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    alert(
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "Login failed."
    );
  }
};

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;