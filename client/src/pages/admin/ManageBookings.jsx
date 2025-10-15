import React, { useState, useEffect } from "react";
import BookingsTable from "../../components/admin/BookingsTable";
import EditBookingModal from "../../components/admin/EditBookingModal";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No token found. Please login.");

      const res = await fetch("http://localhost:3001/api/bookings", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`);

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to fetch bookings. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No token found. Please login.");

      const res = await fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to delete booking: ${res.status}`);

      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. See console for details.");
    }
  };

  const editBooking = (booking) => {
    setEditingBooking(booking);
  };

  const handleSave = (updatedBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <BookingsTable
          bookings={bookings}
          onEdit={editBooking}
          onDelete={deleteBooking}
        />
      )}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ManageBookings;
