import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardCharts = ({ stats }) => {
  if (!stats?.trainTypes) return <p>Loading chart...</p>;

  const trainLabels = Object.keys(stats.trainTypes);
  const trainCounts = Object.values(stats.trainTypes);

  const colors = [
    "#4e73df", "#1cc88a", "#36b9cc", "#f6c23e",
    "#e74a3b", "#858796", "#5a5c69"
  ];

  const data = {
    labels: trainLabels,
    datasets: [
      {
        label: "Train Bookings",
        data: trainCounts,
        backgroundColor: colors.slice(0, trainLabels.length),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div style={{ maxWidth: "500px", marginTop: "2rem" }}>
      <h3>🚆 Bookings by Train Type</h3>
      <Pie data={data} options={options} />
    </div>
  );
};

export default DashboardCharts;
