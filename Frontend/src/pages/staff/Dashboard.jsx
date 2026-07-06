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
    return <h2>Loading dashboard...</h2>;
  }

  return (
    <div>
      <h1>Staff Dashboard</h1>

      <div style={grid}>
        <div style={card}>
          <h3>Inventory Items</h3>
          <h2>{dashboard.totalInventory}</h2>
        </div>

        <div style={card}>
          <h3>Low Stock Items</h3>
          <h2>{dashboard.lowStockItems}</h2>
        </div>

        <div style={card}>
          <h3>Total Sales</h3>
          <h2>{dashboard.totalSales}</h2>
        </div>

        <div style={card}>
          <h3>Total Revenue</h3>
          <h2>₱{dashboard.totalRevenue}</h2>
        </div>
      </div>

      <hr />

      <h2>Best Selling Products</h2>

      {dashboard.bestSelling?.length === 0 ? (
        <p>No sales data yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Product</th>
              <th>Sold</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.bestSelling.map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "15px"
};

const card = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "8px",
  background: "#f8f8f8"
};

export default Dashboard;