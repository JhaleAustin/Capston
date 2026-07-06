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

    localStorage.setItem(
      "user",
      JSON.stringify(response.data)
    );

    alert("Profile updated successfully.");

    setForm({
      name: response.data.name || "",
      phone: response.data.phone || "",
      email: response.data.email || "",
      password: ""
    });
  };

  return (
    <div>
      <h1>My Profile</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="New Password optional"
        />

        <button type="submit">
          Update Profile
        </button>
      </form>

      <hr />

      <p><strong>Role:</strong> {savedUser?.role}</p>
      <p><strong>Status:</strong> {savedUser?.status}</p>
    </div>
  );
}

export default Profile;