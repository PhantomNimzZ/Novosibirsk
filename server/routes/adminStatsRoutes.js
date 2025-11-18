import express from "express";
import {
  getOverviewStats,
  getBookingsByDate,
  getBookingsByRoute,
  getRevenueStats
} from "../controllers/adminStatsController.js";

const router = express.Router();

router.get("/overview", getOverviewStats);
router.get("/bookings-by-date", getBookingsByDate);
router.get("/bookings-by-route", getBookingsByRoute);
router.get("/revenue", getRevenueStats);   // ✅ ADD THIS

export default router;
