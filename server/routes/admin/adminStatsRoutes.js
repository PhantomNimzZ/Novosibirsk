// server/routes/admin/adminStatsRoutes.js
import express from "express";
import {
  getOverviewStats,
  getBookingsByDate,
  getBookingsByRoute,
  getRevenueStats,
} from "../../controllers/admin/adminStatsController.js";
import verifyToken from "../../middleware/authMiddleware.js";

const router = express.Router();

// ✅ All stats routes are now protected — admins only
router.get("/overview", verifyToken, getOverviewStats);
router.get("/bookings-by-date", verifyToken, getBookingsByDate);
router.get("/bookings-by-route", verifyToken, getBookingsByRoute);
router.get("/revenue", verifyToken, getRevenueStats);

export default router;
