// src/components/admin/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            backgroundColor: "#ecf0f1",
            padding: "1rem 2rem",
            borderBottom: "1px solid #ccc",
          }}
        >
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        </header>
        <main style={{ padding: "2rem", backgroundColor: "#f8f9fa", flex: 1 }}>
          {/* 👇 THIS is where nested routes like /admin/manage-bookings will render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
