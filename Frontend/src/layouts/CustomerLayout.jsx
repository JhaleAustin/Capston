import { Link, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function CustomerLayout() {
  return (
    <div>
      <nav>
        <Link to="/customer/menu">Menu</Link>{" "}
        <Link to="/customer/feedback">Feedback</Link>{" "}
        <Link to="/customer/profile">Profile</Link>{" "}
        <Link to="/customer/best-sellers">Best Sellers</Link>{" "} 

        <Link to="/customer/best-sellers">Best Sellers</Link>{" "}
        <Link to="/customer/recommendation">Recommendation</Link>{" "}
        <LogoutButton />
      </nav>

      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default CustomerLayout;