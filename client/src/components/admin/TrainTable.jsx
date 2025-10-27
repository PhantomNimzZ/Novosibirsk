import React, { useState, useMemo } from "react";
import "./BookingsTable.css"; // Reuse the same table styles

const TrainTable = ({ trains, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedTrains = useMemo(() => {
    let filtered = [...trains];

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter((train) =>
        Object.values(train).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [trains, searchTerm, sortConfig]);

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
      <h2>Trains</h2>

      <div className="table-controls">
        <input
          type="text"
          placeholder="Search trains..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>
              Name{getSortArrow("name")}
            </th>
            <th onClick={() => handleSort("number")}>
              Number{getSortArrow("number")}
            </th>
            <th onClick={() => handleSort("seats")}>
              Seats{getSortArrow("seats")}
            </th>
            <th onClick={() => handleSort("price")}>
              Price (R){getSortArrow("price")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(sortedTrains) && sortedTrains.length > 0 ? (
            sortedTrains.map((train) => (
              <tr key={train.id}>
                <td>{train.name}</td>
                <td>{train.number}</td>
                <td>{train.seats}</td>
                <td>{train.price}</td>
                <td>
                  <button onClick={() => onEdit(train)}>Edit</button>
                  <button onClick={() => onDelete(train.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No trains found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrainTable;
