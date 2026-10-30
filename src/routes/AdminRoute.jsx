import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const AdminRoute = () => {
  const { user, isAuthLoading, isAuthenticated } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;