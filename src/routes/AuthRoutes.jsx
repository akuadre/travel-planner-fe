import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/auth";

// Route untuk user yang belum login (guest)
export const GuestRoute = () => {
  const { user } = useAuth();
  
  // Jika sudah login, redirect ke home
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return <Outlet />;
};

// Route untuk user yang sudah login (protected)
export const ProtectedRoute = () => {
  const { user } = useAuth();
  
  // Jika belum login, redirect ke login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};