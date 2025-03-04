
import { Navigate, useLocation } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Check if user is logged in and is an admin
  const isAdmin = user && user.isAdmin === true;
  
  if (!isAdmin) {
    // Redirect to login page if not admin
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;
