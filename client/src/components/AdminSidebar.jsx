import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      width: "250px",
      backgroundColor: "#2c3e50",
      color: "white",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
    }}>
      <h3 style={{ marginBottom: "2rem" }}>🚆 PRASA Admin</h3>

      <button onClick={() => navigate("/admin")} style={navButtonStyle}>Dashboard</button>
      <button onClick={() => navigate("/admin/book")} style={navButtonStyle}>New Booking</button>
      <button onClick={() => navigate("/bookings")} style={navButtonStyle}>Manage Bookings</button>
    </div>
  );
};

const navButtonStyle = {
  background: "transparent",
  border: "none",
  color: "white",
  margin: "0.5rem 0",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "1rem",
};

export default AdminSidebar;
