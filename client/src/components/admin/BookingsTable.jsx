import React from "react";
import "./BookingsTable.css";

const BookingsTable = ({ bookings }) => {
  return (
    <div className="bookings-table">
      <h2>Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Train</th>
            <th>Date</th>
            <th>Seat</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
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
