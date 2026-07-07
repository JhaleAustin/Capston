import { useState } from "react";
import { updateProfile } from "../../api/authApi";

function Profile() {
  const savedUser = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: savedUser?.name || "",
    phone: savedUser?.phone || "",
    email: savedUser?.email || "",
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

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email
    };

    if (form.password.trim() !== "") {
      payload.password = form.password;
    }

    const response = await updateProfile(payload);

    if (!response.success) {
      alert(response.message);
      return;
    }

    localStorage.setItem("user", JSON.stringify(response.data));
    alert("Profile updated successfully.");

    setForm({
      name: response.data.name || "",
      phone: response.data.phone || "",
      email: response.data.email || "",
      password: ""
    });
  };

  return (
    <div style={page}>
      <div style={hero}>
        <span style={heroBadge}>Customer Account</span>
        <h1 style={title}>My Profile</h1>
        <p style={subtitle}>Manage your personal information and account details.</p>
      </div>

      <div style={contentGrid}>
        <div style={profileCard}>
          <div style={avatar}>
            {savedUser?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <h2 style={profileName}>{savedUser?.name}</h2>
          <p style={profileEmail}>{savedUser?.email}</p>

          <div style={infoBox}>
            <p><strong>Role:</strong> {savedUser?.role}</p>
            <p><strong>Status:</strong> {savedUser?.status}</p>
          </div>
        </div>

        <div style={formCard}>
          <h2 style={sectionTitle}>Update Profile</h2>

          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              style={input}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />

            <input
              style={input}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
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

            <input
              style={input}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="New Password optional"
            />

            <button type="submit" style={primaryBtn}>
              Update Profile
            </button>
          </form>
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
  marginBottom: "30px"
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
  gridTemplateColumns: "320px 1fr",
  gap: "25px"
};

const profileCard = {
  background: "#FFFFFF",
  padding: "30px",
  borderRadius: "24px",
  textAlign: "center",
  boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
  height: "fit-content"
};

const avatar = {
  width: "95px",
  height: "95px",
  borderRadius: "50%",
  background: "#9B1C1C",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "38px",
  fontWeight: "900",
  margin: "0 auto 18px"
};

const profileName = {
  margin: 0,
  color: "#7A1313"
};

const profileEmail = {
  color: "#777",
  marginTop: "8px"
};

const infoBox = {
  background: "#FFF9EA",
  borderRadius: "18px",
  padding: "18px",
  marginTop: "22px",
  textAlign: "left",
  lineHeight: "1.8"
};

const formCard = {
  background: "#FFFFFF",
  padding: "30px",
  borderRadius: "24px",
  boxShadow: "0 12px 35px rgba(0,0,0,0.08)"
};

const sectionTitle = {
  color: "#7A1313",
  marginTop: 0,
  marginBottom: "20px"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const input = {
  padding: "15px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "15px"
};

const primaryBtn = {
  background: "#9B1C1C",
  color: "white",
  border: "none",
  padding: "15px",
  borderRadius: "14px",
  fontWeight: "900",
  cursor: "pointer"
};

export default Profile;