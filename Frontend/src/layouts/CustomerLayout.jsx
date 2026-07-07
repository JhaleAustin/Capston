import { NavLink, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import {
  FaUtensils,
  FaStar,
  FaCommentDots,
  FaUser,
  FaRobot,
} from "react-icons/fa";

function CustomerLayout() {
  return (
    <div style={layout}>
      <nav style={navbar}>
        <div style={brand}>
          <div style={logo}>K</div>

          <div>
            <h2 style={brandTitle}>Kyojiro Inshokuten</h2>
            <p style={brandSub}>Japanese Restaurant</p>
          </div>
        </div>

        <div style={menu}>
          <NavLink
            to="/customer/menu"
            style={({ isActive }) => ({
              ...link,
              ...(isActive ? activeLink : {})
            })}
          >
            <FaUtensils />
            Menu
          </NavLink>

          <NavLink
            to="/customer/best-sellers"
            style={({ isActive }) => ({
              ...link,
              ...(isActive ? activeLink : {})
            })}
          >
       
          <NavLink
            to="/customer/recommendation"
            style={({ isActive }) => ({
              ...link,
              ...(isActive ? activeLink : {})
            })}
          >
            <FaRobot />
            AI Recommendation
          </NavLink>

          <NavLink
            to="/customer/feedback"
            style={({ isActive }) => ({
              ...link,
              ...(isActive ? activeLink : {})
            })}
          >
            <FaCommentDots />
            Feedback
          </NavLink>

          <NavLink
            to="/customer/profile"
            style={({ isActive }) => ({
              ...link,
              ...(isActive ? activeLink : {})
            })}
          >
            <FaUser />
            Profile
          </NavLink>
        </div>

        <div>
          <LogoutButton />
        </div>
      </nav>

      <main style={main}>
        <Outlet />
      </main>
    </div>
  );
}

const layout = {
  minHeight: "100vh",
  background: "#F5F2ED",
};

const navbar = {
  background: "linear-gradient(135deg,#7A1313,#9B1C1C)",
  color: "white",
  padding: "18px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  flexWrap: "wrap",
};

const brand = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const logo = {
  width: "55px",
  height: "55px",
  borderRadius: "15px",
  background: "#E7C56A",
  color: "#111",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "24px",
  fontWeight: "900",
};

const brandTitle = {
  margin: 0,
  fontSize: "22px",
};

const brandSub = {
  margin: 0,
  color: "#F5F2ED",
  fontSize: "13px",
};

const menu = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
};

const link = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  textDecoration: "none",
  color: "white",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "700",
};

const activeLink = {
  background: "#E7C56A",
  color: "#111",
};

const main = {
  padding: "35px",
};

export default CustomerLayout;