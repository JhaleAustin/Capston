import { NavLink, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import {
  FaChartPie,
  FaBoxes,
  FaReceipt,
  FaRobot,
  FaTags,
  FaTruck,
  FaComments,
  FaHistory,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";

function AdminLayout() {
  const menuItems = [
    { icon: <FaChartPie />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <FaBoxes />, label: "Inventory", path: "/admin/inventory" },
    { icon: <FaReceipt />, label: "Sales", path: "/admin/sales" },
    { icon: <FaRobot />, label: "AI Insights", path: "/admin/ai" },
    { icon: <FaTags />, label: "Categories", path: "/admin/categories" },
    { icon: <FaTruck />, label: "Suppliers", path: "/admin/suppliers" },
    { icon: <FaComments />, label: "Feedback", path: "/admin/feedback" },
    { icon: <FaHistory />, label: "Activity Logs", path: "/admin/activity-logs" },
    { icon: <FaUsers />, label: "Users", path: "/admin/users" },
    { icon: <FaFileAlt />, label: "Reports", path: "/admin/reports" },
  ];

  return (
    <div style={layout}>
      <aside style={sidebar}>
        <div>
          <div style={brandBox}>
            <div style={logoBox}>K</div>
            <div>
              <h2 style={brandTitle}>Kyojiro</h2>
              <p style={brandSub}>Admin Panel</p>
            </div>
          </div>

          <nav style={nav}>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  ...navLink,
                  ...(isActive ? activeLink : {}),
                })}
              >
                <span style={iconStyle}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div style={bottomBox}>
          <LogoutButton />
        </div>
      </aside>

      <main style={main}>
        <Outlet />
      </main>
    </div>
  );
}

const layout = {
  display: "flex",
  width: "100vw",
  minHeight: "100vh",
  margin: 0,
  padding: 0,
  background: "#F5F2ED",
};

const sidebar = {
  width: "300px",
  minHeight: "100vh",
  background: "linear-gradient(180deg, #7A1313 0%, #9B1C1C 45%, #111111 100%)",
  padding: "24px 18px",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "8px 0 30px rgba(0,0,0,0.2)",
  boxSizing: "border-box",
};

const brandBox = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  padding: "10px 10px 24px",
  borderBottom: "1px solid rgba(255,255,255,0.18)",
  marginBottom: "20px",
};

const logoBox = {
  width: "52px",
  height: "52px",
  borderRadius: "16px",
  background: "#E7C56A",
  color: "#111111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  fontWeight: "900",
};

const brandTitle = {
  margin: 0,
  fontSize: "25px",
  color: "#FFFFFF",
};

const brandSub = {
  margin: "4px 0 0",
  fontSize: "13px",
  color: "#F5F2ED",
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const navLink = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  padding: "13px 15px",
  borderRadius: "14px",
  color: "#F5F2ED",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "700",
};

const activeLink = {
  background: "#E7C56A",
  color: "#111111",
};

const iconStyle = {
  fontSize: "18px",
  minWidth: "22px",
  display: "flex",
  alignItems: "center",
};

const bottomBox = {
  paddingTop: "18px",
  borderTop: "1px solid rgba(255,255,255,0.18)",
};

const main = {
  flex: 1,
  minHeight: "100vh",
  background: "#F5F2ED",
  padding: "30px",
  boxSizing: "border-box",
  overflowX: "hidden",
};

export default AdminLayout;