import { Navigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode"; // ✅ Correct

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) return <Navigate to="/admin-login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin-login" replace />;
    }
  } catch {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
