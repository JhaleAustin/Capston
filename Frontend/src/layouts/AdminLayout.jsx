import { NavLink, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function AdminLayout() {
  const menuItems = [
    ["Dashboard", "/admin/dashboard"],
    ["Inventory", "/admin/inventory"],
    ["Sales", "/admin/sales"],
    ["AI Insights", "/admin/ai"],
    ["Categories", "/admin/categories"],
    ["Suppliers", "/admin/suppliers"],
    ["Feedback", "/admin/feedback"],
    ["Activity Logs", "/admin/activity-logs"],
    ["Users", "/admin/users"],
    ["Reports", "/admin/reports"],
  ];

  return (
    <div style={layout}>
      <aside style={sidebar}>
        <div>
          <div style={brandBox}>
            <h2 style={brandTitle}>Kyojiro</h2>
            <p style={brandSub}>Admin Panel</p>
          </div>

          <nav style={nav}>
            {menuItems.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                style={({ isActive }) => ({
                  ...navLink,
                  ...(isActive ? activeLink : {}),
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div style={logoutBox}>
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
  minHeight: "100vh",
  background: "#F5F2ED",
};

const sidebar = {
  width: "260px",
  minHeight: "100vh",
  background: "linear-gradient(180deg, #7A1313, #111111)",
  color: "white",
  padding: "24px 18px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "sticky",
  top: 0,
};

const brandBox = {
  padding: "12px 10px 25px",
  borderBottom: "1px solid rgba(255,255,255,0.15)",
  marginBottom: "18px",
};

const brandTitle = {
  margin: 0,
  fontSize: "28px",
  color: "#E7C56A",
};

const brandSub = {
  margin: "5px 0 0",
  fontSize: "14px",
  color: "#F5F2ED",
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const navLink = {
  color: "#F5F2ED",
  textDecoration: "none",
  padding: "13px 15px",
  borderRadius: "12px",
  fontWeight: "600",
};

const activeLink = {
  background: "#E7C56A",
  color: "#111111",
};

const logoutBox = {
  paddingTop: "20px",
  borderTop: "1px solid rgba(255,255,255,0.15)",
};

const main = {
  flex: 1,
  padding: "28px",
  overflow: "auto",
};

export default AdminLayout;