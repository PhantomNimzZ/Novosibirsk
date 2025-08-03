import { useEffect, useState } from "react";

const DashboardStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:3001/api/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>📊 Dashboard Overview</h2>
      <ul>
        <li><strong>Total Bookings:</strong> {stats.totalBookings}</li>
        <li><strong>Bookings Today:</strong> {stats.bookingsToday}</li>
        <li><strong>Total Revenue:</strong> R{stats.revenueTotal}</li>
        <li><strong>Most Popular Route:</strong> {stats.mostPopularRoute}</li>
        <li><strong>Train Types:</strong>
          <ul>
            {Object.entries(stats.trainTypes).map(([type, count]) => (
              <li key={type}>{type}: {count}</li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default DashboardStats;
