import { Link, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "220px", padding: "20px", background: "#eee", minHeight: "100vh" }}>
        <h2>Admin Panel</h2>

        <Link to="/admin/dashboard">Dashboard</Link><br />
        <Link to="/admin/inventory">Inventory</Link><br />
        <Link to="/admin/sales">Sales</Link><br />
        <Link to="/admin/ai">AI Insights</Link><br />
        <Link to="/admin/categories">Categories</Link><br />
        <Link to="/admin/suppliers">Suppliers</Link><br />
        <Link to="/admin/sales">Sales</Link><br /> 
        <Link to="/admin/feedback">Feedback</Link><br />
        <Link to="/admin/activity-logs">Activity Logs</Link><br />
        <Link to="/admin/users">Users</Link><br />
        <Link to="/admin/reports">Reports</Link><br />


        <LogoutButton />
      </aside>

      <main style={{ padding: "20px", flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;