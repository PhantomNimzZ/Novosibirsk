import { useEffect, useState } from "react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/bookings")
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error("Error fetching bookings:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📋 All Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {bookings.map((booking) => (
            <li key={booking.id} style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "6px" }}>
              <strong>{booking.name}</strong> booked <strong>{booking.train}</strong><br />
              From: {booking.from} → {booking.to} at {booking.time}<br />
              Email: {booking.email}<br />
              Payment: {booking.payment}<br />
              Date: {booking.date || 'N/A'}<br />
              Booked on: {new Date(booking.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookings;
