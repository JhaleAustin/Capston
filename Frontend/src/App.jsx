import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSuppliers from "./pages/admin/Suppliers";
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminInventory from "./pages/admin/Inventory";
import AdminDashboard from "./pages/admin/Dashboard";
import StaffDashboard from "./pages/staff/Dashboard"; 
import AdminCategories from "./pages/admin/Categories";
import AdminAI from "./pages/admin/AI";
import AdminSales from "./pages/admin/Sales";
import AdminFeedback from "./pages/admin/Feedback";
import AdminActivityLogs from "./pages/admin/ActivityLogs";
import AdminUsers from "./pages/admin/Users";
import AdminReports from "./pages/admin/Reports";
import CustomerMenu from "./pages/customer/Menu";
import StaffInventory from "./pages/admin/Inventory";
import StaffSales from "./pages/admin/Sales";
import StaffFeedback from "./pages/admin/Feedback";
import StaffAI from "./pages/admin/AI";
import CustomerFeedback from "./pages/customer/Feedback"; 
import CustomerProfile from "./pages/customer/Profile";
import CustomerBestSellers from "./pages/customer/BestSellers";
import CustomerRecommendation from "./pages/customer/AIRecommendation";
import Register from "./pages/Register";
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

<Route path="/register" element={<Register />} />
       <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="suppliers" element={<AdminSuppliers />} />
        <Route path="sales" element={<AdminSales />} />
        <Route path="ai" element={<AdminAI />} />
        <Route path="feedback" element={<AdminFeedback />} />
        <Route path="activity-logs" element={<AdminActivityLogs />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reports" element={<AdminReports />} />
       </Route>

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="inventory" element={<StaffInventory />} />
        <Route path="sales" element={<StaffSales />} />
        <Route path="feedback" element={<StaffFeedback />} />
        <Route path="ai" element={<StaffAI />} />
        </Route>

        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >  
<Route path="feedback" element={<CustomerFeedback />} />
<Route path="profile" element={<CustomerProfile />} />
<Route path="menu" element={<CustomerMenu />} />
<Route path="best-sellers" element={<CustomerBestSellers />} />
<Route path="recommendation" element={<CustomerRecommendation />} />
        </Route>

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;