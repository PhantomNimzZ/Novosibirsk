import prisma from "../../lib/prisma.js";
import { Parser } from "json2csv";

export const exportBookingsCSV = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        train: true
      }
    });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    const formatted = bookings.map(b => ({
      bookingId: b.id,
      passengerName: b.passengerName,
      email: b.email,
      idNumber: b.idNumber,
      trainNumber: b.trainNumber,

      trainId: b.trainId,
      routeName: b.train?.name || "N/A",

      departure: b.departure,
      destination: b.destination,
      travelDate: b.date,
      seatNumber: b.seat,

      price: b.price,
      paymentStatus: b.paymentStatus,
      bookingStatus: b.status,

      createdAt: b.createdAt,
      updatedAt: b.updatedAt
    }));

    const json2csv = new Parser();
    const csv = json2csv.parse(formatted);

    res.header("Content-Type", "text/csv");
    res.attachment("bookings_export.csv");
    return res.send(csv);

  } catch (err) {
    console.error("CSV Export Error:", err);
    res.status(500).json({ message: "Failed to export CSV", error: err.message });
  }
};
