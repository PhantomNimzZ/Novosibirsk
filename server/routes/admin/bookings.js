import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

import verifyToken from "../../middleware/authMiddleware.js";


// CREATE a booking (public)
router.post("/", async (req, res) => {
  try {
    const booking = await prisma.booking.create({
      data: {
        passengerName: req.body.passengerName,
        email: req.body.email,
        idNumber: req.body.idNumber,
        trainNumber: req.body.trainNumber,
        departure: req.body.departure,
        destination: req.body.destination,
        date: new Date(req.body.date),
        time: req.body.time,
        seat: req.body.seat,
        price: req.body.price,
        paymentStatus: "Pending",
        status: "Active",
        train: {
          connect: { id: req.body.trainId },
        },
      },
      include: { train: true },
    });
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// READ all bookings (protected)
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { train: true },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ single booking (protected)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { train: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE booking (protected)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    if (data.price) data.price = parseFloat(data.price);

    const booking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { train: true },
    });

    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE booking (protected)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;