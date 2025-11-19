import React, { useState } from "react";
import "./BookingsTable.css";

const BookingsTable = ({ bookings, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const uniqueStatuses = ["All", ...(Array.isArray(bookings) ? [...new Set(bookings.map(b => b.status))] : [])];

  const sortedBookings = React.useMemo(() => {
    let filtered = [...bookings];

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter((booking) =>
        Object.values(booking).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (booking) => booking.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "date") {
          aVal = aVal ? new Date(aVal) : new Date(0);
          bVal = bVal ? new Date(bVal) : new Date(0);
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [bookings, searchTerm, statusFilter, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) return sortConfig.direction === "asc" ? " ▲" : " ▼";
    return "";
  };

  return (
    <div className="bookings-table">
      <h2>Bookings</h2>

      <div className="table-controls">
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          {uniqueStatuses.map((status, idx) => (
            <option key={idx} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("passengerName")}>
              Passenger{getSortArrow("passengerName")}
            </th>
            <th onClick={() => handleSort("trainNumber")}>
              Train{getSortArrow("trainNumber")}
            </th>
            <th onClick={() => handleSort("date")}>
              Date{getSortArrow("date")}
            </th>
            <th onClick={() => handleSort("seat")}>
              Seat{getSortArrow("seat")}
            </th>
            <th onClick={() => handleSort("status")}>
              Status{getSortArrow("status")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(sortedBookings) && sortedBookings.length > 0 ? (
            sortedBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.passengerName}</td>
                <td>{booking.trainNumber}</td>
                <td>{booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}</td>
                <td>{booking.seat || "N/A"}</td>
                <td>{booking.status || "N/A"}</td>
                <td>
                  <button onClick={() => onEdit(booking)}>Edit</button>
                  <button onClick={() => onDelete(booking.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
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
