import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardCharts from "../components/DashboardCharts";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin-login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/bookings", {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (Array.isArray(response.data)) {
          const validBookings = response.data.filter(
            (b) => b && b.fullName && b.trainId
          );
          setBookings(validBookings);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [adminToken, navigate]);

  const handleDownloadTicket = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("PRASA Train Ticket", 70, 20);

    doc.setFontSize(12);
    doc.text(`Passenger: ${booking.fullName}`, 20, 40);
    doc.text(`Train ID: ${booking.trainId}`, 20, 50);
    doc.text(`Route: ${booking.origin} ➝ ${booking.destination}`, 20, 60);
    doc.text(`Departure: ${booking.date} at ${booking.time}`, 20, 70);
    doc.text(`Seats: ${Array.isArray(booking.seats) ? booking.seats.join(", ") : "N/A"}`, 20, 80);
    doc.text(`Email: ${booking.email}`, 20, 90);

    doc.save(`ticket_${booking.trainId}_${booking.fullName}.pdf`);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!booking.fullName) return false;

    const search = searchTerm.toLowerCase();
    return (
      booking.fullName.toLowerCase().includes(search) ||
      booking.trainId.toLowerCase().includes(search) ||
      booking.origin.toLowerCase().includes(search) ||
      booking.destination.toLowerCase().includes(search)
    );
  });

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <input
        type="text"
        placeholder="Search bookings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ margin: "10px 0", padding: "8px", width: "100%" }}
      />

      {loading ? (
        <p>Loading charts...</p>
      ) : (
        <DashboardCharts bookings={bookings} />
      )}

      {filteredBookings.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Train ID</th>
              <th>Route</th>
              <th>Seats</th>
              <th>Date</th>
              <th>Email</th>
              <th>Ticket</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={index} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                <td>{booking.fullName}</td>
                <td>{booking.trainId}</td>
                <td>{booking.origin} ➝ {booking.destination}</td>
                <td>{Array.isArray(booking.seats) ? booking.seats.join(", ") : "N/A"}</td>
                <td>{booking.date} at {booking.time}</td>
                <td>{booking.email}</td>
                <td>
                  <button onClick={() => handleDownloadTicket(booking)}>Download Ticket</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : loading ? null : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
