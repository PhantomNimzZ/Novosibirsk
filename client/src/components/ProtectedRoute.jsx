import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';


const ProtectedRoute = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Optional: check token expiry
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin-login" replace />;
  }
};

export default ProtectedRoute;
