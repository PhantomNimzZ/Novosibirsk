import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import DashboardOverview from "../components/DashboardOverview";

const AdminDashboard = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <AdminSidebar />

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />

        <div style={{ padding: "2rem", flexGrow: 1, backgroundColor: "#f5f6fa" }}>
          <DashboardOverview />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
