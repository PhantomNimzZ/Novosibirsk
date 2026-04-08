// server/controllers/admin/exportController.js
import prisma from "../../lib/prisma.js";
import { Parser } from "json2csv";

export const exportBookingsCSV = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { train: true },
    });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found" });
    }

    const formatted = bookings.map((b) => ({
      bookingId: b.id,
      bookingReference: `PRASA-${new Date(b.createdAt).getFullYear()}-${String(b.id).padStart(5, "0")}`,
      passengerName: b.passengerName,
      email: b.email,
      idNumber: b.idNumber,
      trainNumber: b.trainNumber,
      trainId: b.trainId,
      trainName: b.train?.trainName || "N/A",
      trainClass: b.train?.class || "N/A",
      departure: b.departure,
      destination: b.destination,
      travelDate: b.date,
      seatNumber: b.seat,
      price: Math.round(b.price),
      paymentStatus: b.paymentStatus,
      bookingStatus: b.status,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    const json2csv = new Parser();
    const csv = json2csv.parse(formatted);

    res.header("Content-Type", "text/csv");
    res.attachment("bookings_export.csv");
    return res.send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err);
    res.status(500).json({ error: "Failed to export CSV" });
  }
};
