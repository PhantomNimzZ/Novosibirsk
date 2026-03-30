// src/components/admin/AdminSidebar.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    alert("You have been logged out.");
    navigate("/admin-login");
  };

  return (
    <aside
      style={{
        width: "220px",
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "white" }}>Admin Menu</h2>
      
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          flexGrow: 1,
        }}
      >
        {/* Dashboard */}
        <Link
          to="/admin"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem",
            borderRadius: "5px",
            textDecoration: "none",
            transition: "background-color 0.3s",
            backgroundColor: (location.pathname === "/admin" || location.pathname === "/admin/dashboard") 
              ? "#3498db" 
              : "transparent",
            color: "white",
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== "/admin" && location.pathname !== "/admin/dashboard") {
              e.target.style.backgroundColor = "#34495e";
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== "/admin" && location.pathname !== "/admin/dashboard") {
              e.target.style.backgroundColor = "transparent";
            }
          }}
        >
          📊 Dashboard
        </Link>

        {/* Long-Distance Booking */}
        <Link
          to="/admin/create-booking"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem",
            borderRadius: "5px",
            textDecoration: "none",
            transition: "background-color 0.3s",
            backgroundColor: location.pathname === "/admin/create-booking" 
              ? "#3498db" 
              : "transparent",
            color: "white",
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== "/admin/create-booking") {
              e.target.style.backgroundColor = "#34495e";
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== "/admin/create-booking") {
              e.target.style.backgroundColor = "transparent";
            }
          }}
        >
          🚆 Long-Distance
        </Link>

        {/* Commuter Booking */}
        <Link
          to="/admin/create-commuter-booking"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem",
            borderRadius: "5px",
            textDecoration: "none",
            transition: "background-color 0.3s",
            backgroundColor: location.pathname === "/admin/create-commuter-booking" 
              ? "#3498db" 
              : "transparent",
            color: "white",
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== "/admin/create-commuter-booking") {
              e.target.style.backgroundColor = "#34495e";
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== "/admin/create-commuter-booking") {
              e.target.style.backgroundColor = "transparent";
            }
          }}
        >
          🚇 Commuter
        </Link>

        
        <Link
          to="/admin/manage-bookings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem",
            borderRadius: "5px",
            textDecoration: "none",
            transition: "background-color 0.3s",
            backgroundColor: location.pathname === "/admin/manage-bookings" 
              ? "#3498db" 
              : "transparent",
            color: "white",
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== "/admin/manage-bookings") {
              e.target.style.backgroundColor = "#34495e";
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== "/admin/manage-bookings") {
              e.target.style.backgroundColor = "transparent";
            }
          }}
        >
          📋 Manage Bookings
        </Link>

        
        <Link
          to="/admin/manage-trains"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem",
            borderRadius: "5px",
            textDecoration: "none",
            transition: "background-color 0.3s",
            backgroundColor: location.pathname === "/admin/manage-trains" 
              ? "#3498db" 
              : "transparent",
            color: "white",
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== "/admin/manage-trains") {
              e.target.style.backgroundColor = "#34495e";
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== "/admin/manage-trains") {
              e.target.style.backgroundColor = "transparent";
            }
          }}
        >
          🚆 Manage Trains
        </Link>
      </nav>

      {/* Logout button at bottom */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "auto",
          backgroundColor: "#e74c3c",
          border: "none",
          padding: "0.7rem",
          borderRadius: "5px",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🚪 Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
