import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

import bookingRoutes from "./routes/bookings.js";
import trainsRoutes from "./routes/trains.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";
import verifyToken from "./middleware/authMiddleware.js";

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
app.use("/api/admin", adminAuthRoutes);

// Protected admin route example
app.use("/api/admin/protected", verifyToken, (req, res) => {
  res.json({ message: "Access granted to protected admin route." });
});

// // Admin login
// app.post("/api/admin/login", (req, res) => {
//   const { email, password } = req.body;

//   if (email === "admin@prasa.com" && password === "password123") {
//     const token = jwt.sign({ email, role: "admin" }, SECRET_KEY, {
//       expiresIn: "1h",
//     });
//     return res.json({ token });
//   }

//   return res.status(401).json({ error: "Invalid email or password" });
// });

// -------------------------
// LIVE TRAIN LOCATION ENDPOINT
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
// ADMIN STATS ROUTES (NEW)
// -------------------------
app.use("/api/admin/stats", adminStatsRoutes);

// -------------------------
app.listen(PORT, () => {
  console.log(`🚆 Server running on http://localhost:${PORT}`);
});
