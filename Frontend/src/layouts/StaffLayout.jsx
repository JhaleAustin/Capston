import { Link, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function StaffLayout() {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "220px", padding: "20px", background: "#eee", minHeight: "100vh" }}>
        <h2>Staff Panel</h2>

        <Link to="/staff/dashboard">Dashboard</Link><br />
        <Link to="/staff/inventory">Inventory</Link><br />
        <Link to="/staff/sales">Sales</Link><br />
        <Link to="/staff/feedback">Feedback</Link><br />
        <Link to="/staff/ai">AI Insights</Link><br />

        <LogoutButton />
      </aside>

      <main style={{ padding: "20px", flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default StaffLayout;