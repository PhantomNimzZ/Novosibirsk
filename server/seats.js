// server/routes/seats.js
import express from "express";
import {
  getBookedSeats,
  checkSeatAvailability,
  getSeatStats,
} from "../controllers/seatController.js";

const router = express.Router();

// Get all booked seats for a train on a specific date
// GET /api/trains/:trainId/seats?date=2026-02-25
router.get("/:trainId/seats", getBookedSeats);

// Check if a specific seat is available
// GET /api/trains/:trainId/seats/:seatNumber/available?date=2026-02-25
router.get("/:trainId/seats/:seatNumber/available", checkSeatAvailability);

// Get seat statistics for a train
// GET /api/trains/:trainId/seat-stats?date=2026-02-25
router.get("/:trainId/seat-stats", getSeatStats);

export default router;
