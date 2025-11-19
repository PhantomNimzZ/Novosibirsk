import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

import bookingRoutes from "./routes/admin/bookings.js";
import trainsRoutes from "./routes/admin/trains.js";
import adminAuthRoutes from "./routes/admin/adminAuth.js";
import adminStatsRoutes from "./routes/admin/adminStatsRoutes.js";
import exportRoutes from "./routes/admin/exportRoutes.js";
import verifyToken from "./middleware/authMiddleware.js";   // ✅ FIXED

const app = express();
const PORT = 3001;
const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

app.use(cors());
app.use(express.json());

// -------------------------
// ROUTES
// -------------------------
app.use("/api/bookings", bookingRoutes);
app.use("/api/trains", trainsRoutes);

// Admin login
app.use("/api/admin", adminAuthRoutes);

// Example protected admin test route
app.use("/api/admin/protected", verifyToken, (req, res) => {
  res.json({ message: "Access granted to protected admin route." });
});

app.use("/api/admin/export", exportRoutes);


// -------------------------
// LIVE TRAIN LOCATION
// -------------------------
const trainRoutes = {
  "commuter-line---durban": [
    { station: "Durban", lat: -29.8587, lng: 31.0218 },
    { station: "Umlazi", lat: -29.9641, lng: 30.8797 },
    { station: "Pinetown", lat: -29.8186, lng: 30.8657 },
    { station: "KwaMashu", lat: -29.7462, lng: 30.9928 },
  ],
  "blue-train": [
    { station: "Cape Town", lat: -33.918861, lng: 18.4233 },
    { station: "Kimberley", lat: -28.7383, lng: 24.7637 },
    { station: "Pretoria", lat: -25.7479, lng: 28.2293 },
  ],
};

app.get("/api/live-location/:trainId", (req, res) => {
  const { trainId } = req.params;
  console.log("📍 Live tracking request for train:", trainId);

  const route = trainRoutes[trainId] || [];
  if (route.length === 0) {
    return res.status(404).json({ message: "Train route not found" });
  }

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

// -------------------------
// ADMIN STATS
// -------------------------
app.use("/api/admin/stats", adminStatsRoutes);

// -------------------------
app.listen(PORT, () => {
  console.log(`🚆 Server running on http://localhost:${PORT}`);
});
