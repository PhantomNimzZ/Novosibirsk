// client/src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";
import { FaUsers, FaCalendarDay, FaRoute } from "react-icons/fa";
import { API_BASE } from "../../api/config"; // ✅ Centralised URL

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
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ All stats requests now include the auth token
    const token = localStorage.getItem("adminToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const fetchStats = async () => {
      try {
        const [overviewRes, dateRes, routeRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/stats/overview`, { headers }),
          fetch(`${API_BASE}/api/admin/stats/bookings-by-date`, { headers }),
          fetch(`${API_BASE}/api/admin/stats/bookings-by-route`, { headers }),
        ]);

        if (!overviewRes.ok || !dateRes.ok || !routeRes.ok) {
          throw new Error("Failed to load dashboard stats");
        }

        const [overviewData, dateData, routeData] = await Promise.all([
          overviewRes.json(),
          dateRes.json(),
          routeRes.json(),
        ]);

        setOverview(overviewData);
        setBookingsByDate(dateData);
        setBookingsByRoute(routeData);
      } catch (err) {
        console.error("Dashboard stats error:", err);
        setError("Failed to load dashboard statistics.");
      }
    };

    fetchStats();
  }, []);

  const pieColors = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#f59e0b", "#8b5cf6"];

  if (error) {
    return (
      <div className="p-6 text-red-500">{error}</div>
    );
  }

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      {/* KPI Cards */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
        <Card color="#2563eb" icon={<FaUsers />} title="Total Bookings" value={overview.totalBookings} />
        <Card color="#16a34a" icon={<FaCalendarDay />} title="Bookings Today" value={overview.bookingsToday} />
        <Card color="#f59e0b" icon={<FaRoute />} title="Most Popular Route" value={overview.mostPopularRoute} />
        <Card color="#9333ea" icon="💰" title="Total Revenue"
          value={`R${Number(overview.totalRevenue ?? 0).toLocaleString()}`} />
        <Card color="#dc2626" icon="🛒" title="Revenue Today"
          value={`R${Number(overview.revenueToday ?? 0).toLocaleString()}`} />
      </div>

      {/* Charts */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={chartContainerStyle}>
          <h2 style={chartTitleStyle}>Bookings Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingsByDate}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={chartContainerStyle}>
          <h2 style={chartTitleStyle}>Bookings by Route</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={bookingsByRoute} dataKey="count" nameKey="route" outerRadius={100} label>
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

function Card({ color, icon, title, value }) {
  return (
    <div
      style={{
        background: "#fff", borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        flex: "1 1 200px", padding: "24px",
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "relative", transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ height: "6px", width: "100%", background: color, borderRadius: "6px", position: "absolute", top: 0, left: 0 }} />
      <div style={{ fontSize: "32px", marginBottom: "12px", color }}>{icon}</div>
      <h3 style={{ fontSize: "16px", color: "#555", marginBottom: "8px" }}>{title}</h3>
      <span style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center" }}>{value}</span>
    </div>
  );
}

const chartContainerStyle = {
  background: "#fff", padding: "24px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  borderRadius: "12px", flex: "1 1 400px",
};

const chartTitleStyle = { fontSize: "18px", fontWeight: "600", marginBottom: "16px" };
