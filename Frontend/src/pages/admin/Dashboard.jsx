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
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Overview</h2>

      <div style={grid}>
        <div style={card}>
          <h3>Total Users</h3>
          <h2>{dashboard.totalUsers}</h2>
        </div>

        <div style={card}>
          <h3>Total Sales</h3>
          <h2>{dashboard.totalSales}</h2>
        </div>

        <div style={card}>
          <h3>Total Revenue</h3>
          <h2>₱{dashboard.totalRevenue}</h2>
        </div>

        <div style={card}>
          <h3>Inventory Items</h3>
          <h2>{dashboard.totalInventory}</h2>
        </div>

        <div style={card}>
          <h3>Low Stock Items</h3>
          <h2>{dashboard.lowStockItems}</h2>
        </div>

        <div style={card}>
          <h3>Categories</h3>
          <h2>{dashboard.totalCategories}</h2>
        </div>

        <div style={card}>
          <h3>Suppliers</h3>
          <h2>{dashboard.totalSuppliers}</h2>
        </div>

        <div style={card}>
          <h3>Feedback</h3>
          <h2>{dashboard.totalFeedback}</h2>
        </div>
      </div>

      <hr />

      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No important notifications right now.</p>
      ) : (
        notifications.map((item, index) => (
          <div key={index} style={notificationCard}>
            <strong>{item.type}:</strong> {item.message}
          </div>
        ))
      )}

      <hr />

      <h2>Charts and Analytics</h2>

      <div style={chartBox}>
        <h3>Sales Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={chartBox}>
        <h3>Best Seller Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bestSellers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sold" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={chartBox}>
        <h3>Inventory Stock Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventoryChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={chartBox}>
        <h3>Feedback Rating Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={feedbackChart}
              dataKey="count"
              nameKey="rating"
              outerRadius={100}
              label
            >
              {feedbackChart.map((entry, index) => (
                <Cell key={index} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <hr />

      <h2>Best Selling Products</h2>

      {dashboard.bestSelling?.length === 0 ? (
        <p>No sales data yet.</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
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
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "15px"
};

const card = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "8px",
  background: "#f8f8f8"
};

const notificationCard = {
  border: "1px solid #ddd",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "10px",
  background: "#fff7e6"
};

const chartBox = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "25px",
  background: "#fff"
};

export default Dashboard;