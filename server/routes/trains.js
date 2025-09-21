// server/routes/trains.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//Get all Trains
router.get("/", async (req, res) => {
  try {
    const trains = await prisma.train.findMany();
    res.json(trains); // ✅ Must use res.json, not res.send
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching trains");
  }
});

// GET single train
router.get("/:id", async (req, res) => {
  const train = await prisma.train.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!train) return res.status(404).json({ error: "Train not found" });
  res.json(train);
});

// POST create train
router.post("/", async (req, res) => {
  const { name, number, seats, price } = req.body;
  const train = await prisma.train.create({
    data: { name, number, seats, price },
  });
  res.json(train);
});


// PUT update train
router.put("/:id", async (req, res) => {
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

// DELETE train
router.delete("/:id", async (req, res) => {
  const trainId = parseInt(req.params.id);
  try {
    // Delete all bookings for this train first
    await prisma.booking.deleteMany({ where: { trainId } });

    // Then delete the train
    await prisma.train.delete({ where: { id: trainId } });
    res.json({ message: "Train deleted" });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Train not found or cannot delete" });
  }
});



module.exports = router;
