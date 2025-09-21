import React, { useState, useEffect } from "react";
import BookingsTable from "../../components/admin/BookingsTable";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/bookings"); // ✅ backend endpoint
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      await fetch(`/api/admin/bookings/${bookingId}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const editBooking = (booking) => {
    alert(`Editing booking for ${booking.user}, Train: ${booking.train}`);
    // 🔮 Later: open a modal form to actually update booking details
  };

  return (
    <div>
      <h1>Manage Bookings</h1>
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <BookingsTable
          bookings={bookings}
          onEdit={editBooking}
          onDelete={deleteBooking}
        />
      )}
    </div>
  );
};

export default ManageBookings;
