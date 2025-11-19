import React, { useState, useEffect } from "react";
import BookingsTable from "../../components/admin/BookingsTable";
import EditBookingModal from "../../components/admin/EditBookingModal";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No token found. Please login.");

      const res = await fetch("http://localhost:3001/api/admin/export/bookings/csv", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to download CSV: ${res.status}`);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "bookings_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("CSV download error:", error);
      alert("Failed to download CSV. Check console for details.");
    } finally {
    setDownloading(false);
  }
};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <button
          onClick={handleDownloadCSV}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {downloading && (
            <svg
              className="w-4 h-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {downloading ? "Downloading..." : "Download CSV"}
        </button>
      </div>
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
