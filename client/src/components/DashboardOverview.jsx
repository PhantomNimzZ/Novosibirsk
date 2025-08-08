import React from "react";

const DashboardOverview = () => {
  const summaryCards = [
    { title: "Total Bookings", value: 128 },
    { title: "Active Trains", value: 9 },
    { title: "Pending Approvals", value: 3 },
    { title: "Registered Users", value: 450 },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
      {summaryCards.map((card, index) => (
        <div key={index} style={{
          padding: "1rem",
          backgroundColor: "#ffffff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}>
          <h4 style={{ margin: "0 0 0.5rem 0" }}>{card.title}</h4>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardOverview;
