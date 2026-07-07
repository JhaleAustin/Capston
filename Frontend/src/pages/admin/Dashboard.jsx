import { useEffect, useState } from "react";
import { getDashboardAnalytics } from "../../api/analyticsApi";
import { getSales, getBestSelling } from "../../api/salesApi";
import { getInventory } from "../../api/inventoryApi";
import { getFeedback } from "../../api/feedbackApi";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [salesChart, setSalesChart] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [inventoryChart, setInventoryChart] = useState([]);
  const [feedbackChart, setFeedbackChart] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const loadDashboard = async () => {
    const dashboardResponse = await getDashboardAnalytics();
    const salesResponse = await getSales();
    const bestResponse = await getBestSelling();
    const inventoryResponse = await getInventory();
    const feedbackResponse = await getFeedback();

    if (dashboardResponse.success) {
      setDashboard(dashboardResponse.data);
    }

    const alerts = [];

    if (salesResponse.success) {
      const groupedSales = {};

      salesResponse.data.forEach((sale) => {
        const date = sale.createdAt
          ? new Date(sale.createdAt).toLocaleDateString()
          : "No Date";

        groupedSales[date] =
          (groupedSales[date] || 0) + Number(sale.total || 0);
      });

      setSalesChart(
        Object.keys(groupedSales).map((date) => ({
          date,
          revenue: groupedSales[date]
        }))
      );
    }

    if (bestResponse.success) {
      const bestData = bestResponse.data.map((item) => ({
        name: item[0],
        sold: item[1]
      }));

      setBestSellers(bestData);

      if (bestData.length > 0) {
        alerts.push({
          type: "Best Seller",
          message: `${bestData[0].name} is currently the best-selling product.`
        });
      }
    }

    if (inventoryResponse.success) {
      setInventoryChart(
        inventoryResponse.data.map((item) => ({
          name: item.itemName,
          stock: item.quantity
        }))
      );

      inventoryResponse.data.forEach((item) => {
        if (Number(item.quantity) <= Number(item.minimumStock)) {
          alerts.push({
            type: "Low Stock",
            message: `${item.itemName} is low on stock. Current stock: ${item.quantity}.`
          });
        }
      });
    }

    if (feedbackResponse.success) {
      const ratings = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };

      feedbackResponse.data.forEach((item) => {
        ratings[item.rating] = (ratings[item.rating] || 0) + 1;
      });

      setFeedbackChart(
        Object.keys(ratings).map((rating) => ({
          rating: `${rating} Star`,
          count: ratings[rating]
        }))
      );

      const unreadFeedback = feedbackResponse.data.filter(
        (item) => item.status === "Unread"
      );

      if (unreadFeedback.length > 0) {
        alerts.push({
          type: "New Feedback",
          message: `You have ${unreadFeedback.length} unread customer feedback.`
        });
      }
    }

    setNotifications(alerts);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!dashboard) {
    return <h2>Loading dashboard...</h2>;
  }

 return (
  <div style={page}>
    <div style={header}>
      <div>
        <h1 style={title}>Admin Dashboard</h1>
        <p style={subtitle}>Kyojiro Inshokuten Sales Management Overview</p>
      </div>
    </div>

    <div style={grid}>
      {[
        ["Total Users", dashboard.totalUsers],
        ["Total Sales", dashboard.totalSales],
        ["Total Revenue", `₱${dashboard.totalRevenue}`],
        ["Inventory Items", dashboard.totalInventory],
        ["Low Stock Items", dashboard.lowStockItems],
        ["Categories", dashboard.totalCategories],
        ["Suppliers", dashboard.totalSuppliers],
        ["Feedback", dashboard.totalFeedback],
      ].map(([label, value]) => (
        <div style={card} key={label}>
          <p style={cardLabel}>{label}</p>
          <h2 style={cardValue}>{value}</h2>
        </div>
      ))}
    </div>

    <section style={section}>
      <h2 style={sectionTitle}>Notifications</h2>

      {notifications.length === 0 ? (
        <p style={emptyText}>No important notifications right now.</p>
      ) : (
        notifications.map((item, index) => (
          <div key={index} style={notificationCard}>
            <strong>{item.type}:</strong> {item.message}
          </div>
        ))
      )}
    </section>

    <section style={section}>
      <h2 style={sectionTitle}>Charts and Analytics</h2>

      <div style={chartGrid}>
        <div style={chartBox}>
          <h3 style={chartTitle}>Sales Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#9B1C1C" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={chartBox}>
          <h3 style={chartTitle}>Best Seller Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestSellers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#E7C56A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={chartBox}>
          <h3 style={chartTitle}>Inventory Stock Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#9B1C1C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={chartBox}>
          <h3 style={chartTitle}>Feedback Rating Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={feedbackChart} dataKey="count" nameKey="rating" outerRadius={100} label>
                {feedbackChart.map((entry, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>

    <section style={section}>
      <h2 style={sectionTitle}>Best Selling Products</h2>

      {dashboard.bestSelling?.length === 0 ? (
        <p style={emptyText}>No sales data yet.</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Product</th>
              <th style={th}>Quantity Sold</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.bestSelling.map((item, index) => (
              <tr key={index}>
                <td style={td}>{item[0]}</td>
                <td style={td}>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  </div>
);
}
const page = {
  minHeight: "100vh",
  background: "#F5F2ED",
  padding: "30px",
  fontFamily: "Arial, sans-serif",
};

const header = {
  background: "linear-gradient(135deg, #7A1313, #9B1C1C)",
  color: "white",
  padding: "28px",
  borderRadius: "20px",
  marginBottom: "25px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
};

const title = {
  margin: 0,
  fontSize: "32px",
};

const subtitle = {
  marginTop: "8px",
  color: "#F5F2ED",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "18px",
  marginBottom: "25px",
};

const card = {
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "22px",
  borderLeft: "6px solid #9B1C1C",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const cardLabel = {
  margin: 0,
  color: "#666",
  fontSize: "14px",
  fontWeight: "700",
};

const cardValue = {
  margin: "10px 0 0",
  color: "#111",
  fontSize: "30px",
};

const section = {
  background: "#FFFFFF",
  padding: "24px",
  borderRadius: "20px",
  marginBottom: "25px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const sectionTitle = {
  color: "#7A1313",
  marginTop: 0,
};

const notificationCard = {
  padding: "14px 16px",
  borderRadius: "12px",
  marginBottom: "10px",
  background: "#FFF7E0",
  borderLeft: "5px solid #E7C56A",
  color: "#333",
};

const emptyText = {
  color: "#777",
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "20px",
};

const chartBox = {
  border: "1px solid #eee",
  padding: "20px",
  borderRadius: "16px",
  background: "#FFFCF7",
};

const chartTitle = {
  color: "#111",
  marginTop: 0,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  overflow: "hidden",
  borderRadius: "12px",
};

const th = {
  background: "#9B1C1C",
  color: "white",
  padding: "14px",
  textAlign: "left",
};

const td = {
  padding: "14px",
  borderBottom: "1px solid #eee",
};

const pieColors = ["#9B1C1C", "#E7C56A", "#111111", "#C0392B", "#F5B041"];
export default Dashboard;