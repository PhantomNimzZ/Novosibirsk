// src/components/admin/AdminSidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    alert("You have been logged out.");
    navigate("/admin/login");
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
      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Admin Menu</h2>
      
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          flexGrow: 1,
        }}
      >
        <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
          Dashboard
        </Link>

        <Link 
          to="/admin/create-booking"
          style={{ color: "white", textDecoration: "none" }}
        >
          Create Booking
        </Link>

        <Link 
          to="/admin/manage-bookings"
          style={{ color: "white", textDecoration: "none" }}
        >
          Manage Bookings
        </Link>

        <Link 
          to="/admin/manage-trains"
          style={{ color: "white", textDecoration: "none" }}
        >
          Manage Trains
        </Link>
      </nav>

      {/* 🔥 Logout button at bottom */}
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
        }}
      >
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
