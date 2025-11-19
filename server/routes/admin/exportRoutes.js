import express from "express";
import { exportBookingsCSV } from "../../controllers/admin/exportController.js";
import verifyToken from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/bookings/csv", verifyToken, exportBookingsCSV);

export default router;
