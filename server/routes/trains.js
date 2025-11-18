import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
import verifyToken from "../middleware/authMiddleware.js"; // ✅ Import middleware
const prisma = new PrismaClient();

// PUBLIC: Get all trains
router.get("/", async (req, res) => {
  try {
    const trains = await prisma.train.findMany();
    res.json(trains);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching trains");
  }
});

// PUBLIC: Get single train
router.get("/:id", async (req, res) => {
  const train = await prisma.train.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!train) return res.status(404).json({ error: "Train not found" });
  res.json(train);
});

// ADMIN: Create train
router.post("/", verifyToken, async (req, res) => {
  const { name, number, seats, price } = req.body;
  const train = await prisma.train.create({
    data: { name, number, seats, price },
  });
  res.json(train);
});

// ADMIN: Update train
router.put("/:id", verifyToken, async (req, res) => {
  const { name, number, seats, price } = req.body;
  try {
    const train = await prisma.train.update({
      where: { id: parseInt(req.params.id) },
      data: { name, number, seats, price },
    });
    res.json(train);
  } catch (err) {
    res.status(404).json({ error: "Train not found" });
  }
});

// ADMIN: Delete train
router.delete("/:id", verifyToken, async (req, res) => {
  const trainId = parseInt(req.params.id);
  try {
    await prisma.booking.deleteMany({ where: { trainId } });
    await prisma.train.delete({ where: { id: trainId } });
    res.json({ message: "Train deleted" });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Train not found or cannot delete" });
  }
});

export default router;
