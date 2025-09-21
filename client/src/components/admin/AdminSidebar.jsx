// src/components/admin/AdminSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
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
      }}
    >
      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Admin Menu</h2>
      
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
          Dashboard
        </Link>
        <Link 
          to="/admin/create-booking" 
          className="block p-2 hover:bg-gray-700"
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
          className="block p-2 hover:bg-gray-700"
          style={{ color: "white", textDecoration: "none" }}
        >
          Manage Trains
        </Link>
        {/* Add more links later (Users, Reports, Settings, etc.) */}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
