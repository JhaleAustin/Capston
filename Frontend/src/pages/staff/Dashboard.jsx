import { useEffect, useState } from "react";
import { getDashboardAnalytics } from "../../api/analyticsApi";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const loadDashboard = async () => {
    const response = await getDashboardAnalytics();

    if (response.success) {
      setDashboard(response.data);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!dashboard) {
    return <h2 style={{ padding: "30px" }}>Loading dashboard...</h2>;
  }

  return (
    <div style={page}>
      <div style={header}>
        <h1 style={title}>Staff Dashboard</h1>
        <p style={subtitle}>
          Track inventory, sales, revenue, and best-selling products.
        </p>
      </div>

      <div style={grid}>
        <div style={card}>
          <p style={cardLabel}>Inventory Items</p>
          <h2 style={cardValue}>{dashboard.totalInventory}</h2>
        </div>

        <div style={card}>
          <p style={cardLabel}>Low Stock Items</p>
          <h2 style={cardValue}>{dashboard.lowStockItems}</h2>
        </div>

        <div style={card}>
          <p style={cardLabel}>Total Sales</p>
          <h2 style={cardValue}>{dashboard.totalSales}</h2>
        </div>

        <div style={card}>
          <p style={cardLabel}>Total Revenue</p>
          <h2 style={cardValue}>₱{dashboard.totalRevenue}</h2>
        </div>
      </div>

      <div style={tableCard}>
        <h2 style={sectionTitle}>Best Selling Products</h2>

        {dashboard.bestSelling?.length === 0 ? (
          <p style={emptyText}>No sales data yet.</p>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Product</th>
                <th style={th}>Sold</th>
              </tr>
            </thead>

            <tbody>
              {dashboard.bestSelling.map((item, index) => (
                <tr key={index}>
                  <td style={td}>
                    <strong>{item[0]}</strong>
                  </td>
                  <td style={td}>
                    <span style={badge}>{item[1]} sold</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const page = {
  padding: "30px",
};

const header = {
  background: "linear-gradient(135deg, #7A1313, #9B1C1C)",
  color: "white",
  padding: "30px",
  borderRadius: "22px",
  marginBottom: "25px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
};

const title = {
  margin: 0,
  fontSize: "32px",
};

const subtitle = {
  marginTop: "10px",
  color: "#F5F2ED",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginBottom: "25px",
};

const card = {
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "24px",
  borderLeft: "6px solid #9B1C1C",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const cardLabel = {
  margin: 0,
  color: "#666",
  fontWeight: "700",
};

const cardValue = {
  marginTop: "10px",
  color: "#111",
  fontSize: "32px",
};

const tableCard = {
  background: "#FFFFFF",
  borderRadius: "20px",
  padding: "25px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "20px",
  color: "#7A1313",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  background: "#9B1C1C",
  color: "white",
  padding: "15px",
  textAlign: "left",
};

const td = {
  padding: "15px",
  borderBottom: "1px solid #eee",
  color: "#333",
};

const badge = {
  background: "#FFF0D6",
  color: "#9B1C1C",
  padding: "7px 14px",
  borderRadius: "20px",
  fontWeight: "700",
  fontSize: "13px",
};

const emptyText = {
  color: "#777",
};

export default Dashboard;