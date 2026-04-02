// server/routes/search.js
import express from "express";
import {
  searchTrains,
  getAvailableRoutes,
  getAvailableDates,
  getAvailableTimes,
} from "../controllers/searchController.js";

const router = express.Router();

// Main search endpoint
// GET /api/search?from=Cape Town&to=Johannesburg&date=2026-02-25&time=09:30
router.get("/", searchTrains);

// Get all available routes
// GET /api/search/routes
router.get("/routes", getAvailableRoutes);

// Get available dates for a route
// GET /api/search/dates?from=Cape Town&to=Johannesburg
router.get("/dates", getAvailableDates);

// Get available times for a route and date
// GET /api/search/times?from=Cape Town&to=Johannesburg&date=2026-02-25
router.get("/times", getAvailableTimes);

export default router;
