import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      style={logoutBtn}
    >
      <FaSignOutAlt />
      Logout
    </button>
  );
}

const logoutBtn = {
  width: "100%",
  background: "#E7C56A",
  color: "#111",
  border: "none",
  borderRadius: "14px",
  padding: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontWeight: "700",
  cursor: "pointer",
};

export default LogoutButton;