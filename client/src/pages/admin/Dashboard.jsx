import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaUsers, FaCalendarDay, FaRoute } from "react-icons/fa"; // icons

const API_URL = "http://localhost:3001/api/admin/stats";

export default function DashboardAnalytics() {
  const [overview, setOverview] = useState({
    totalBookings: 0,
    bookingsToday: 0,
    mostPopularRoute: "No data",
    totalRevenue: 0,
    revenueToday: 0,
  });

  const [bookingsByDate, setBookingsByDate] = useState([]);
  const [bookingsByRoute, setBookingsByRoute] = useState([]);

  // Fetch overview stats
  useEffect(() => {
    fetch(`${API_URL}/overview`)
      .then((res) => res.json())
      .then((data) => setOverview(data))
      .catch((err) => console.error("Error loading overview stats:", err));

    fetch(`${API_URL}/bookings-by-date`)
      .then((res) => res.json())
      .then((data) => setBookingsByDate(data))
      .catch((err) => console.error("Error loading date stats:", err));

    fetch(`${API_URL}/bookings-by-route`)
      .then((res) => res.json())
      .then((data) => setBookingsByRoute(data))
      .catch((err) => console.error("Error loading route stats:", err));
  }, []);

  const pieColors = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#f59e0b", "#8b5cf6"];

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      {/* KPI Cards */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
        <Card color="#2563eb" icon={<FaUsers />} title="Total Bookings" value={overview.totalBookings} />
        <Card color="#16a34a" icon={<FaCalendarDay />} title="Bookings Today" value={overview.bookingsToday} />
        <Card color="#f59e0b" icon={<FaRoute />} title="Most Popular Route" value={overview.mostPopularRoute} />

        {/* Sales / Revenue Cards */}
        <Card
          color="#9333ea"
          icon={"💰"}
          title="Total Revenue"
          value={`R${Number(overview?.totalRevenue ?? 0).toLocaleString()}`}
        />


        <Card
          color="#dc2626"
          icon={"🛒"}
          title="Revenue Today"
          value={`R${Number(overview?.revenueToday ?? 0).toLocaleString()}`}
        />


      </div>

      {/* Charts Section */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Line Chart */}
        <div style={chartContainerStyle}>
          <h2 style={chartTitleStyle}>Bookings Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingsByDate}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={chartContainerStyle}>
          <h2 style={chartTitleStyle}>Bookings by Route</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingsByRoute}
                dataKey="count"
                nameKey="route"
                outerRadius={100}
                fill="#3b82f6"
                label
              >
                {bookingsByRoute.map((_, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Reusable Card Component
function Card({ color, icon, title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        flex: "1 1 200px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ height: "6px", width: "100%", background: color, borderRadius: "6px", position: "absolute", top: 0, left: 0 }}></div>
      <div style={{ fontSize: "32px", marginBottom: "12px", color }}>{icon}</div>
      <h3 style={{ fontSize: "16px", color: "#555", marginBottom: "8px" }}>{title}</h3>
      <span style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center" }}>{value}</span>
    </div>
  );
}

// Chart container styling
const chartContainerStyle = {
  background: "#fff",
  padding: "24px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  borderRadius: "12px",
  flex: "1 1 400px",
};

const chartTitleStyle = {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "16px",
};
