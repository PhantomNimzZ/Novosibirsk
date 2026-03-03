// server/routes/admin/trains.js
import express from "express";
import prisma from "../../lib/prisma.js";
import verifyToken from "../../middleware/authMiddleware.js";

const router = express.Router();

// ─────────────────────────────────────────
// PUBLIC: Get all trains
// ─────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const trains = await prisma.train.findMany({
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });
    res.json(trains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching trains" });
  }
});

// ─────────────────────────────────────────
// PUBLIC: Get single train
// ─────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const train = await prisma.train.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!train) return res.status(404).json({ error: "Train not found" });
    res.json(train);
  } catch (error) {
    res.status(500).json({ error: "Error fetching train" });
  }
});

// ─────────────────────────────────────────
// ADMIN: Create train (UPDATED FOR NEW SCHEMA)
// ─────────────────────────────────────────
router.post("/", verifyToken, async (req, res) => {
  const { 
    train, 
    trainNumber, 
    from, 
    to, 
    date, 
    time, 
    seats, 
    price,
    class: trainClass,
    amenities,
    distance,
    duration,
    intermediateStops
  } = req.body;

  // Validation
  if (!train || !trainNumber || !from || !to || !date || !time) {
    return res.status(400).json({ 
      error: "Required fields: train, trainNumber, from, to, date, time" 
    });
  }

  try {
    const newTrain = await prisma.train.create({
      data: {
        train,
        trainNumber,
        from,
        to,
        date: new Date(date).toISOString(),
        time,
        seats: parseInt(seats) || 100,
        price: parseFloat(price) || 0,
        class: trainClass || "Economy",
        amenities: amenities || "",
        distance: distance ? parseInt(distance) : null,
        duration: duration ? parseInt(duration) : null,
        intermediateStops: intermediateStops || "",
      },
    });
    
    console.log("✅ Train created:", newTrain.id);
    res.status(201).json(newTrain);
  } catch (error) {
    console.error("❌ Create train error:", error);
    res.status(500).json({ error: "Failed to create train", details: error.message });
  }
});

// ─────────────────────────────────────────
// ADMIN: Update train (UPDATED FOR NEW SCHEMA)
// ─────────────────────────────────────────
router.put("/:id", verifyToken, async (req, res) => {
  const { 
    train, 
    trainNumber, 
    from, 
    to, 
    date, 
    time, 
    seats, 
    price,
    class: trainClass,
    amenities,
    distance,
    duration,
    intermediateStops
  } = req.body;

  try {
    const updatedTrain = await prisma.train.update({
      where: { id: parseInt(req.params.id) },
      data: {
        train,
        trainNumber,
        from,
        to,
        date: date ? new Date(date).toISOString() : undefined,
        time,
        seats: seats ? parseInt(seats) : undefined,
        price: price ? parseFloat(price) : undefined,
        class: trainClass,
        amenities,
        distance: distance ? parseInt(distance) : null,
        duration: duration ? parseInt(duration) : null,
        intermediateStops,
      },
    });
    
    console.log("✅ Train updated:", updatedTrain.id);
    res.json(updatedTrain);
  } catch (error) {
    console.error("❌ Update train error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Train not found" });
    }
    res.status(500).json({ error: "Failed to update train", details: error.message });
  }
});

// ─────────────────────────────────────────
// ADMIN: Delete train
// ✅ onDelete: Cascade in schema handles bookings automatically
// ─────────────────────────────────────────
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await prisma.train.delete({
      where: { id: parseInt(req.params.id) },
    });
    
    console.log("✅ Train deleted:", req.params.id);
    res.json({ message: "Train deleted successfully" });
  } catch (error) {
    console.error("❌ Delete train error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Train not found" });
    }
    res.status(500).json({ error: "Failed to delete train" });
  }
});

export default router;
