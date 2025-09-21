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
      await fetch(`http://localhost:3001/api/bookings/${bookingId}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
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
