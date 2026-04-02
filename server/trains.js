// server/routes/admin/trains.js
import express from "express";
import prisma from "../../lib/prisma.js";
import verifyToken from "../../middleware/authMiddleware.js";

const router = express.Router();

const toDateStr = (d) => {
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split("T")[0];
};

const safeInt = (v) => {
  const n = parseInt(v);
  return isNaN(n) ? null : n;
};

// Validate a positive integer field (seats, distance, duration)
// Returns the integer, or null if invalid/missing
const positiveInt = (v) => {
  if (v === undefined || v === null || v === "") return null;
  const n = parseInt(v);
  if (isNaN(n) || n < 0) return null;
  return n;
};

// PUBLIC: Get all trains
router.get("/", async (req, res) => {
  try {
    const trains = await prisma.train.findMany({
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
    res.json(trains);
  } catch (error) {
    res.status(500).json({ error: "Error fetching trains" });
  }
});

// PUBLIC: Get single train
router.get("/:id", async (req, res) => {
  const id = safeInt(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid train ID" });

  try {
    const train = await prisma.train.findUnique({ where: { id } });
    if (!train) return res.status(404).json({ error: "Train not found" });
    res.json(train);
  } catch (error) {
    res.status(500).json({ error: "Error fetching train" });
  }
});

// ADMIN: Create train
router.post("/", verifyToken, async (req, res) => {
  const {
    trainName, trainNumber, from, to, date, time, seats, price,
    class: trainClass, amenities, distance, duration, intermediateStops,
  } = req.body;

  if (!trainName || !trainNumber || !from || !to || !date || !time) {
    return res.status(400).json({
      error: "Required fields: trainName, trainNumber, from, to, date, time",
    });
  }

  const normalizedDate = toDateStr(date);
  if (!normalizedDate) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  // Validate numeric fields — reject garbage, default only if truly absent
  if (seats !== undefined && seats !== null && seats !== "" && positiveInt(seats) === null) {
    return res.status(400).json({ error: "Invalid seats value" });
  }
  if (distance !== undefined && distance !== null && distance !== "" && positiveInt(distance) === null) {
    return res.status(400).json({ error: "Invalid distance value" });
  }
  if (duration !== undefined && duration !== null && duration !== "" && positiveInt(duration) === null) {
    return res.status(400).json({ error: "Invalid duration value" });
  }
  const parsedPrice = price !== undefined ? parseFloat(price) : 0;
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ error: "Invalid price" });
  }

  try {
    const newTrain = await prisma.train.create({
      data: {
        trainName, trainNumber, from, to,
        date: normalizedDate,
        time,
        seats: (seats !== undefined && seats !== null && seats !== "") ? positiveInt(seats) : 100,
        price: Math.round(parsedPrice),
        class: trainClass || "Economy",
        amenities: amenities || "",
        distance: positiveInt(distance),
        duration: positiveInt(duration),
        intermediateStops: intermediateStops || "",
      },
    });
    res.status(201).json(newTrain);
  } catch (error) {
    console.error("Create train error:", error);
    res.status(500).json({ error: "Failed to create train" });
  }
});

// ADMIN: Update train
router.put("/:id", verifyToken, async (req, res) => {
  const id = safeInt(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid train ID" });

  const {
    trainName, trainNumber, from, to, date, time, seats, price,
    class: trainClass, amenities, distance, duration, intermediateStops,
  } = req.body;

  // Validate date if provided
  let normalizedDate;
  if (date !== undefined) {
    normalizedDate = toDateStr(date);
    if (!normalizedDate) return res.status(400).json({ error: "Invalid date format" });
  }

  // Validate price if provided
  let parsedPrice;
  if (price !== undefined) {
    parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ error: "Invalid price" });
    }
    parsedPrice = Math.round(parsedPrice);
  }

  // Validate integer fields if provided
  let parsedSeats;
  if (seats !== undefined) {
    parsedSeats = positiveInt(seats);
    if (parsedSeats === null) return res.status(400).json({ error: "Invalid seats value" });
  }
  let parsedDistance;
  if (distance !== undefined && distance !== null && distance !== "") {
    parsedDistance = positiveInt(distance);
    if (parsedDistance === null) return res.status(400).json({ error: "Invalid distance value" });
  }
  let parsedDuration;
  if (duration !== undefined && duration !== null && duration !== "") {
    parsedDuration = positiveInt(duration);
    if (parsedDuration === null) return res.status(400).json({ error: "Invalid duration value" });
  }

  try {
    const updated = await prisma.train.update({
      where: { id },
      data: {
        trainName, trainNumber, from, to,
        date: normalizedDate,
        time,
        seats: parsedSeats,
        price: parsedPrice,
        class: trainClass,
        amenities,
        distance: parsedDistance,
        duration: parsedDuration,
        intermediateStops,
      },
    });
    res.json(updated);
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Train not found" });
    res.status(500).json({ error: "Failed to update train" });
  }
});

// ADMIN: Delete train
router.delete("/:id", verifyToken, async (req, res) => {
  const id = safeInt(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid train ID" });

  try {
    const totalBookings = await prisma.booking.count({ where: { trainId: id } });

    if (totalBookings > 0) {
      const activeBookings = await prisma.booking.count({
        where: { trainId: id, status: { not: "Cancelled" } },
      });
      const cancelledBookings = totalBookings - activeBookings;

      return res.status(409).json({
        error: "Cannot delete train with existing bookings",
        message: activeBookings > 0
          ? `This train has ${activeBookings} active booking(s). Cancel them before deleting.`
          : `This train has ${cancelledBookings} cancelled booking(s) still on record. Remove them first.`,
        activeBookings,
        cancelledBookings,
        totalBookings,
      });
    }

    await prisma.train.delete({ where: { id } });
    res.json({ message: "Train deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Train not found" });
    if (error.code === "P2003") {
      return res.status(409).json({ error: "Cannot delete train — bookings still exist" });
    }
    res.status(500).json({ error: "Failed to delete train" });
  }
});

export default router;
