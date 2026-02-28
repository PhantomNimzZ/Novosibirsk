// server/controllers/seatController.js
import prisma from "../lib/prisma.js";

/**
 * Get booked seats for a specific train and date
 * GET /api/trains/:trainId/seats?date=YYYY-MM-DD
 */
export const getBookedSeats = async (req, res) => {
  try {
    const { trainId } = req.params;
    const { date } = req.query;

    if (!trainId) {
      return res.status(400).json({ error: "Train ID is required" });
    }

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    console.log(`🔍 Fetching booked seats for train ${trainId} on ${date}`);

    // Get all bookings for this train and date
    // Note: Database stores dates as ISO strings, so we need to compare just the date part
    const bookings = await prisma.booking.findMany({
      where: {
        trainId: parseInt(trainId),
        status: {
          not: "Cancelled", // Exclude cancelled bookings
        },
      },
      select: {
        seat: true,
        passengerName: true,
        status: true,
        date: true,
      },
    });

    // Filter by date (comparing just YYYY-MM-DD part)
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      return bookingDate === date;
    });

    // Extract just the seat numbers
    const bookedSeats = filteredBookings.map(b => b.seat);

    console.log(`✅ Found ${bookedSeats.length} booked seats:`, bookedSeats);

    res.json({
      trainId: parseInt(trainId),
      date,
      bookedSeats,
      count: bookedSeats.length,
    });

  } catch (error) {
    console.error("❌ Get booked seats error:", error);
    res.status(500).json({ 
      error: "Failed to fetch booked seats",
      message: error.message 
    });
  }
};

/**
 * Check if a specific seat is available
 * GET /api/trains/:trainId/seats/:seatNumber/available?date=YYYY-MM-DD
 */
export const checkSeatAvailability = async (req, res) => {
  try {
    const { trainId, seatNumber } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    console.log(`🔍 Checking if seat ${seatNumber} is available on train ${trainId} for ${date}`);

    // Check if seat is already booked (comparing date part only)
    const allBookings = await prisma.booking.findMany({
      where: {
        trainId: parseInt(trainId),
        seat: seatNumber,
        status: {
          not: "Cancelled",
        },
      },
      select: {
        date: true,
        passengerName: true,
      },
    });

    // Filter by date
    const existingBooking = allBookings.find(booking => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      return bookingDate === date;
    });

    const isAvailable = !existingBooking;

    console.log(`${isAvailable ? "✅" : "❌"} Seat ${seatNumber} is ${isAvailable ? "available" : "booked"}`);

    res.json({
      trainId: parseInt(trainId),
      seatNumber,
      date,
      available: isAvailable,
      bookedBy: existingBooking ? existingBooking.passengerName : null,
    });

  } catch (error) {
    console.error("❌ Check seat availability error:", error);
    res.status(500).json({ 
      error: "Failed to check seat availability",
      message: error.message 
    });
  }
};

/**
 * Get seat statistics for a train
 * GET /api/trains/:trainId/seat-stats?date=YYYY-MM-DD
 */
export const getSeatStats = async (req, res) => {
  try {
    const { trainId } = req.params;
    const { date } = req.query;

    // Get train info
    const train = await prisma.train.findUnique({
      where: { id: parseInt(trainId) },
      select: { seats: true, train: true, trainNumber: true },
    });

    if (!train) {
      return res.status(404).json({ error: "Train not found" });
    }

    // Get booked seats count
    const bookedCount = await prisma.booking.count({
      where: {
        trainId: parseInt(trainId),
        date: date || undefined,
        status: {
          not: "Cancelled",
        },
      },
    });

    const totalSeats = train.seats;
    const availableSeats = totalSeats - bookedCount;
    const occupancyRate = (bookedCount / totalSeats) * 100;

    res.json({
      trainId: parseInt(trainId),
      trainName: train.train,
      trainNumber: train.trainNumber,
      date: date || "all dates",
      totalSeats,
      bookedSeats: bookedCount,
      availableSeats,
      occupancyRate: Math.round(occupancyRate),
    });

  } catch (error) {
    console.error("❌ Get seat stats error:", error);
    res.status(500).json({ 
      error: "Failed to fetch seat statistics",
      message: error.message 
    });
  }
};

export default {
  getBookedSeats,
  checkSeatAvailability,
  getSeatStats,
};
