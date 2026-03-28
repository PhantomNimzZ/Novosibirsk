// client/src/pages/admin/ManageBookings.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingsTable from "../../components/admin/BookingsTable";
import { API_BASE } from "../../api/config";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, active, cancelled, pending
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`${API_BASE}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE}/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel booking");
      }

      const result = await response.json();

      // Update state to reflect soft-delete (status → Cancelled)
      setBookings(bookings.map((b) =>
        b.id === id ? { ...b, status: "Cancelled", paymentStatus: result.paymentStatus } : b
      ));
      alert("Booking cancelled successfully");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking: " + err.message);
    }
  };

  const handleUpdate = async (updatedBooking) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE}/api/bookings/${updatedBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBooking),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update booking");
      }

      const data = await response.json();
      
      // Update state
      setBookings(bookings.map((b) => (b.id === data.id ? data : b)));
      alert("Booking updated successfully");
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking: " + err.message);
    }
  };

  // Filter and search bookings
  const filteredBookings = bookings.filter((booking) => {
    // Status filter
    if (filter === "active" && booking.status !== "Active") return false;
    if (filter === "cancelled" && booking.status !== "Cancelled") return false;
    if (filter === "pending" && booking.paymentStatus !== "Pending") return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        booking.passengerName?.toLowerCase().includes(q) ||
        booking.email?.toLowerCase().includes(q) ||
        booking.departure?.toLowerCase().includes(q) ||
        booking.destination?.toLowerCase().includes(q) ||
        booking.trainNumber?.toLowerCase().includes(q) ||
        booking.seat?.toLowerCase().includes(q) ||
        booking.bookingReference?.toLowerCase().includes(q) ||
        String(booking.id).includes(q)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Bookings</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchBookings}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
          <p className="text-sm text-gray-600 mt-1">
            {filteredBookings.length} {filteredBookings.length === 1 ? "booking" : "bookings"} found
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/create-booking")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Booking
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        <input
          type="text"
          placeholder="Search by name, email, route, seat, reference..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === "active"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Active ({bookings.filter((b) => b.status === "Active").length})
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === "cancelled"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Cancelled ({bookings.filter((b) => b.status === "Cancelled").length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Pending Payment ({bookings.filter((b) => b.paymentStatus === "Pending").length})
        </button>
        </div>
      </div>

      {/* Bookings Table */}
      <BookingsTable
        bookings={filteredBookings}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default ManageBookings;
