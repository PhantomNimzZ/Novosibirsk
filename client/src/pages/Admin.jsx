import React, { useState } from "react";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import BookingsTable from "../components/admin/BookingsTable";

const Admin = () => {
  const [bookings] = useState([
    { user: "John Doe", train: "Cape Town Express", date: "2025-08-20", seat: "A1", status: "Confirmed" },
    { user: "Jane Smith", train: "Jo'burg Commuter", date: "2025-08-22", seat: "B3", status: "Pending" },
  ]);

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <div className="admin-body">
        <AdminSidebar />
        <main className="admin-content">
          <BookingsTable bookings={bookings} />
        </main>
      </div>
    </div>
  );
};

export default Admin;
