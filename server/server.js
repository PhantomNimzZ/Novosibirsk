// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
dotenv.config();
dotenv.config();

// Import routes - matching your actual structure
import adminAuthRoutes from "./routes/admin/adminAuth.js";
import adminStatsRoutes from "./routes/admin/adminStatsRoutes.js";
import bookingRoutes from "./routes/admin/bookings.js";
import exportRoutes from "./routes/admin/exportRoutes.js";
import trainRoutes from "./routes/admin/trains.js";
import searchRoutes from "./routes/search.js";
import seatRoutes from "./routes/seats.js"; // NEW: Seat availability routes

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes - Admin routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/stats", adminStatsRoutes);
app.use("/api/admin/export", exportRoutes);

// Routes - Public routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/trains", seatRoutes); // NEW: Seat availability (nests under /api/trains/:trainId/seats)

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "🚆 PRASA API Server",
    version: "2.1.0",
    endpoints: {
      admin: {
        auth: "/api/admin/auth",
        stats: "/api/admin/stats",
        export: "/api/admin/export",
      },
      public: {
        bookings: "/api/bookings",
        trains: "/api/trains",
        search: "/api/search",
        seats: "/api/trains/:trainId/seats", // NEW
      }
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚆 PRASA server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}`);
  console.log(`🔍 Search API: http://localhost:${PORT}/api/search`);
  console.log(`🪑 Seat API: http://localhost:${PORT}/api/trains/:trainId/seats`);
});
