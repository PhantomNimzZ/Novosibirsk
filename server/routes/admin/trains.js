// server/routes/admin/trains.js
import express from "express";
import prisma from "../../lib/prisma.js"; // ✅ Singleton
import verifyToken from "../../middleware/authMiddleware.js";

const router = express.Router();

// ─────────────────────────────────────────
// PUBLIC: Get all trains
// ─────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const trains = await prisma.train.findMany();
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
// ADMIN: Create train
// ─────────────────────────────────────────
router.post("/", verifyToken, async (req, res) => {
  const { name, number, seats, price } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Train name and number are required" });
  }

  try {
    const train = await prisma.train.create({
      data: {
        name,
        number,
        seats: parseInt(seats) || 0,
        price: parseFloat(price) || 0,
      },
    });
    res.status(201).json(train);
  } catch (error) {
    res.status(500).json({ error: "Failed to create train" });
  }
});

// ─────────────────────────────────────────
// ADMIN: Update train
// ─────────────────────────────────────────
router.put("/:id", verifyToken, async (req, res) => {
  const { name, number, seats, price } = req.body;

  try {
    const train = await prisma.train.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        number,
        seats: parseInt(seats),
        price: parseFloat(price),
      },
    });
    res.json(train);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Train not found" });
    }
    res.status(500).json({ error: "Failed to update train" });
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
    res.json({ message: "Train deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Train not found" });
    }
    res.status(500).json({ error: "Failed to delete train" });
  }
});

export default router;
