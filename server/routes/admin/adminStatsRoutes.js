import express from "express";
import {
  getOverviewStats,
  getBookingsByDate,
  getBookingsByRoute,
  getRevenueStats
} from "../../controllers/admin/adminStatsController.js";
import { exportBookingsCSV } from "../../controllers/admin/exportController.js";


const router = express.Router();

router.get("/overview", getOverviewStats);
router.get("/bookings-by-date", getBookingsByDate);
router.get("/bookings-by-route", getBookingsByRoute);
router.get("/revenue", getRevenueStats);   
router.get("/export/bookings", exportBookingsCSV); //CSV Export

export default router;
