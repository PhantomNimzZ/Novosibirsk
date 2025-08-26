import React, { useState } from "react";
import "./BookingsTable.css";

const BookingsTable = ({ bookings, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Extract unique statuses from bookings
  const uniqueStatuses = ["All", ...new Set(bookings.map(b => b.status))];

  // Sorting & filtering
  const sortedBookings = React.useMemo(() => {
    let filteredBookings = [...bookings];

    // Filter by search
    if (searchTerm) {
      filteredBookings = filteredBookings.filter((booking) =>
        Object.values(booking).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort
    if (sortConfig.key) {
      filteredBookings.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "date") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredBookings;
  }, [bookings, searchTerm, statusFilter, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  return (
    <div className="bookings-table">
      <h2>Bookings</h2>

      {/* Search + Filter */}
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
            <th onClick={() => handleSort("user")}>User{getSortArrow("user")}</th>
            <th onClick={() => handleSort("train")}>Train{getSortArrow("train")}</th>
            <th onClick={() => handleSort("date")}>Date{getSortArrow("date")}</th>
            <th onClick={() => handleSort("seat")}>Seat{getSortArrow("seat")}</th>
            <th onClick={() => handleSort("status")}>Status{getSortArrow("status")}</th>
            <th>Actions</th> {/* NEW column header */}
          </tr>
        </thead>
        <tbody>
          {sortedBookings.length > 0 ? (
            sortedBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.user}</td>
                <td>{booking.train}</td>
                <td>{booking.date}</td>
                <td>{booking.seat}</td>
                <td>{booking.status}</td>
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
