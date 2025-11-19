import express from "express";

import adminAuth from "./admin/adminAuth.js";
import adminStatsRoutes from "./admin/adminStatsRoutes.js";
import adminBookings from "./admin/bookings.js";
import adminTrains from "./admin/trains.js";

const router = express.Router();

router.use("/admin/auth", adminAuth);
router.use("/admin/stats", adminStatsRoutes);
router.use("/admin/bookings", adminBookings);
router.use("/admin/trains", adminTrains);

export default router;
