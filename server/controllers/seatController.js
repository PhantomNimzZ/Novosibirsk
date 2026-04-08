// server/controllers/seatController.js
import prisma from "../lib/prisma.js";

const safeInt = (v) => {
  const n = parseInt(v);
  return isNaN(n) ? null : n;
};

/**
 * Get booked seats for a specific train and date
 * GET /api/trains/:trainId/seats?date=YYYY-MM-DD
 */
export const getBookedSeats = async (req, res) => {
  try {
    const trainId = safeInt(req.params.trainId);
    if (trainId === null) return res.status(400).json({ error: "Invalid train ID" });

    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required (YYYY-MM-DD)" });

    const bookings = await prisma.booking.findMany({
      where: { trainId, date, status: { not: "Cancelled" } },
      select: { seat: true },
    });

    res.json({
      trainId,
      date,
      bookedSeats: bookings.map((b) => b.seat),
      count: bookings.length,
    });
  } catch (error) {
    console.error("Get booked seats error:", error);
    res.status(500).json({ error: "Failed to fetch booked seats" });
  }
};

/**
 * Check if a specific seat is available
 * GET /api/trains/:trainId/seats/:seatNumber/available?date=YYYY-MM-DD
 */
export const checkSeatAvailability = async (req, res) => {
  try {
    const trainId = safeInt(req.params.trainId);
    if (trainId === null) return res.status(400).json({ error: "Invalid train ID" });

    const { seatNumber } = req.params;
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required (YYYY-MM-DD)" });

    const existing = await prisma.booking.findFirst({
      where: { trainId, seat: seatNumber, date, status: { not: "Cancelled" } },
      select: { passengerName: true },
    });

    res.json({
      trainId,
      seatNumber,
      date,
      available: !existing,
      bookedBy: existing?.passengerName || null,
    });
  } catch (error) {
    console.error("Check seat availability error:", error);
    res.status(500).json({ error: "Failed to check seat availability" });
  }
};

/**
 * Get seat statistics for a train
 * GET /api/trains/:trainId/seat-stats?date=YYYY-MM-DD
 */
export const getSeatStats = async (req, res) => {
  try {
    const trainId = safeInt(req.params.trainId);
    if (trainId === null) return res.status(400).json({ error: "Invalid train ID" });

    const { date } = req.query;

    const train = await prisma.train.findUnique({
      where: { id: trainId },
      select: { seats: true, trainName: true, trainNumber: true },
    });

    if (!train) return res.status(404).json({ error: "Train not found" });

    const bookedCount = await prisma.booking.count({
      where: {
        trainId,
        ...(date ? { date } : {}),
        status: { not: "Cancelled" },
      },
    });

    const totalSeats = train.seats;
    const availableSeats = totalSeats - bookedCount;
    const occupancyRate = totalSeats > 0 ? (bookedCount / totalSeats) * 100 : 0;

    res.json({
      trainId,
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      date: date || "all dates",
      totalSeats,
      bookedSeats: bookedCount,
      availableSeats,
      occupancyRate: Math.round(occupancyRate),
    });
  } catch (error) {
    console.error("Get seat stats error:", error);
    res.status(500).json({ error: "Failed to fetch seat statistics" });
  }
};

export default { getBookedSeats, checkSeatAvailability, getSeatStats };
