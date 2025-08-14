import React, { useState } from "react";
import "./BookingsTable.css";

const BookingsTable = ({ bookings }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key].toString().toLowerCase();
    const bValue = b[sortConfig.key].toString().toLowerCase();

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Filter bookings
  const filteredBookings = sortedBookings.filter((booking) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      booking.user.toLowerCase().includes(term) ||
      booking.train.toLowerCase().includes(term) ||
      booking.date.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  return (
    <div className="bookings-table">
      <h2>Bookings</h2>

      {/* Filter controls */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by user, train, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-select"
        >
          <option value="">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("user")}>User{getSortIndicator("user")}</th>
            <th onClick={() => handleSort("train")}>Train{getSortIndicator("train")}</th>
            <th onClick={() => handleSort("date")}>Date{getSortIndicator("date")}</th>
            <th onClick={() => handleSort("seat")}>Seat{getSortIndicator("seat")}</th>
            <th onClick={() => handleSort("status")}>Status{getSortIndicator("status")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.user}</td>
                <td>{booking.train}</td>
                <td>{booking.date}</td>
                <td>{booking.seat}</td>
                <td>{booking.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
