// server/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import bookingRoutes from "./routes/admin/bookings.js";
import trainsRoutes from "./routes/admin/trains.js";
import adminAuthRoutes from "./routes/admin/adminAuth.js";
import adminStatsRoutes from "./routes/admin/adminStatsRoutes.js";
import exportRoutes from "./routes/admin/exportRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────
app.use("/api/bookings", bookingRoutes);
app.use("/api/trains", trainsRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/stats", adminStatsRoutes);   // ✅ Registered once only
app.use("/api/admin/export", exportRoutes);

// ─────────────────────────────────────────
// LIVE TRAIN LOCATION (simulated)
// ─────────────────────────────────────────
const trainRoutes = {
  "commuter-line---durban": [
    { station: "Durban",    lat: -29.8587, lng: 31.0218 },
    { station: "Umlazi",   lat: -29.9641, lng: 30.8797 },
    { station: "Pinetown", lat: -29.8186, lng: 30.8657 },
    { station: "KwaMashu", lat: -29.7462, lng: 30.9928 },
  ],
  "commuter-line---cape-town": [
    { station: "Cape Town", lat: -33.9189, lng: 18.4233 },
    { station: "Bellville", lat: -33.8977, lng: 18.6296 },
    { station: "Wynberg",   lat: -34.0029, lng: 18.4656 },
    { station: "Retreat",   lat: -34.0454, lng: 18.4716 },
  ],
  "commuter-line---johannesburg": [
    { station: "Johannesburg", lat: -26.2041, lng: 28.0473 },
    { station: "Germiston",    lat: -26.2278, lng: 28.1704 },
    { station: "Midrand",      lat: -25.9992, lng: 28.1265 },
    { station: "Pretoria",     lat: -25.7479, lng: 28.2293 },
  ],
  "blue-train": [
    { station: "Cape Town",  lat: -33.9189, lng: 18.4233 },
    { station: "Kimberley", lat: -28.7383, lng: 24.7637 },
    { station: "Pretoria",  lat: -25.7479, lng: 28.2293 },
  ],
};

app.get("/api/live-location/:trainId", (req, res) => {
  const { trainId } = req.params;
  const route = trainRoutes[trainId] || [];

  if (route.length === 0) {
    return res.status(404).json({ message: "Train route not found" });
  }

  // Simulated position: advances one stop every 10 seconds
  const index = Math.floor(Date.now() / 10000) % route.length;
  const currentStop = route[index];

  res.json({
    trainId,
    location: currentStop.station,
    position: {
      lat: currentStop.lat,
      lng: currentStop.lng,
      station: currentStop.station,
    },
    updatedAt: new Date().toISOString(),
    status: "On Time",
  });
});

// ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚆 PRASA server running on http://localhost:${PORT}`);
});
