// server/routes/admin/bookings.js
import express from "express";
import prisma from "../../lib/prisma.js"; // ✅ Singleton — no more new PrismaClient()
import verifyToken from "../../middleware/authMiddleware.js";

const router = express.Router();

// ─────────────────────────────────────────
// CREATE a booking (public — passengers book here)
// ─────────────────────────────────────────
router.post("/", async (req, res) => {
  const {
    passengerName,
    email,
    idNumber,
    trainNumber,
    departure,
    destination,
    date,
    time,
    seat,
    price,
    trainId,
  } = req.body;

  // ✅ Basic input validation
  if (!passengerName || !email || !idNumber || !departure || !destination || !date || !trainId) {
    return res.status(400).json({ error: "Missing required booking fields" });
  }

  if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    return res.status(400).json({ error: "Invalid price" });
  }

  if (isNaN(parseInt(trainId))) {
    return res.status(400).json({ error: "Invalid trainId" });
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        passengerName,
        email,
        idNumber,
        trainNumber: trainNumber || "",
        departure,
        destination,
        date: new Date(date).toISOString(),
        time: time || "",
        seat: seat || "",
        price: parseFloat(price),
        paymentStatus: "Pending",
        status: "Active",
        train: {
          connect: { id: parseInt(trainId) },
        },
      },
      include: { train: true },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking creation error:", error);

    // ✅ Friendlier error if trainId doesn't exist
    if (error.code === "P2025") {
      return res.status(400).json({ error: "Selected train does not exist" });
    }

    res.status(500).json({ error: "Failed to create booking" });
  }
});

// ─────────────────────────────────────────
// READ all bookings (protected)
// ─────────────────────────────────────────
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { train: true },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// ─────────────────────────────────────────
// READ single booking (protected)
// ─────────────────────────────────────────
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { train: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

// ─────────────────────────────────────────
// UPDATE booking (protected)
// ─────────────────────────────────────────
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    if (data.price) data.price = parseFloat(data.price);
    if (data.trainId) data.trainId = parseInt(data.trainId);

    const booking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { train: true },
    });

    res.json(booking);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(400).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// DELETE booking (protected)
// ─────────────────────────────────────────
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(400).json({ error: error.message });
  }
});

export default router;
