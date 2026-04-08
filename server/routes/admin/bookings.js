// server/routes/admin/bookings.js
import express from "express";
import prisma from "../../lib/prisma.js";
import verifyToken from "../../middleware/authMiddleware.js";

const router = express.Router();

const VALID_STATUS = ["Active", "Cancelled", "Completed"];
const VALID_PAYMENT_STATUS = ["Pending", "Paid", "Refunded", "Failed"];

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const toDateStr = (d) => {
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split("T")[0];
};

const safeInt = (v) => {
  const n = parseInt(v);
  return isNaN(n) ? null : n;
};

// Booking reference uses createdAt year so it never changes
const generateRef = (id, createdAt) => {
  const year = new Date(createdAt).getFullYear();
  return `PRASA-${year}-${String(id).padStart(5, "0")}`;
};

// Only these fields can be set via UPDATE
const ALLOWED_UPDATE_FIELDS = [
  "passengerName", "email", "idNumber",
  "departure", "destination", "date", "time",
  "seat", "price", "paymentStatus", "status", "trainId",
];

// ─────────────────────────────────────────
// CREATE booking (public)
// ─────────────────────────────────────────
router.post("/", async (req, res) => {
  const {
    passengerName, email, idNumber, trainNumber,
    departure, destination, date, time, seat, price, trainId,
  } = req.body;

  // Required fields
  if (!passengerName || !email || !idNumber || !departure || !destination || !date || !trainId) {
    return res.status(400).json({ error: "Missing required booking fields" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ error: "Invalid price" });
  }

  const parsedTrainId = safeInt(trainId);
  if (parsedTrainId === null) {
    return res.status(400).json({ error: "Invalid trainId" });
  }

  const normalizedDate = toDateStr(date);
  if (!normalizedDate) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  try {
    // Verify the train exists and validate route matches
    const train = await prisma.train.findUnique({
      where: { id: parsedTrainId },
      select: { from: true, to: true, trainNumber: true },
    });

    if (!train) {
      return res.status(400).json({ error: "Selected train does not exist" });
    }

    if (train.from !== departure.trim() || train.to !== destination.trim()) {
      return res.status(400).json({
        error: "Route mismatch",
        message: `Train ${train.trainNumber} runs ${train.from} → ${train.to}, but booking says ${departure} → ${destination}`,
      });
    }

    // Seat check + create inside transaction (prevents race conditions)
    const booking = await prisma.$transaction(async (tx) => {
      if (seat && seat !== "General Seating") {
        const conflict = await tx.booking.findFirst({
          where: {
            trainId: parsedTrainId,
            seat: seat,
            date: normalizedDate,
            status: { not: "Cancelled" },
          },
        });

        if (conflict) {
          throw { type: "SEAT_TAKEN", seat, bookedBy: conflict.passengerName };
        }
      }

      return tx.booking.create({
        data: {
          passengerName: passengerName.trim(),
          email: email.trim().toLowerCase(),
          idNumber: idNumber.trim(),
          trainNumber: train.trainNumber,
          departure: departure.trim(),
          destination: destination.trim(),
          date: normalizedDate,
          time: time || "",
          seat: seat || "",
          price: Math.round(parsedPrice),
          paymentStatus: "Pending",
          status: "Active",
          train: { connect: { id: parsedTrainId } },
        },
        include: { train: true },
      });
    });

    console.log(`✅ Booking #${booking.id} (${generateRef(booking.id, booking.createdAt)}) - ${passengerName} - Seat ${seat}`);
    res.status(201).json({ ...booking, bookingReference: generateRef(booking.id, booking.createdAt) });
  } catch (error) {
    if (error.type === "SEAT_TAKEN") {
      return res.status(409).json({
        error: "Seat already booked",
        message: `Seat ${error.seat} is already booked by another passenger`,
        bookedBy: error.bookedBy,
      });
    }
    if (error.code === "P2025") {
      return res.status(400).json({ error: "Selected train does not exist" });
    }
    console.error("Booking creation error:", error);
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
    res.json(bookings.map((b) => ({
      ...b,
      bookingReference: generateRef(b.id, b.createdAt),
    })));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// ─────────────────────────────────────────
// READ single booking (protected)
// ─────────────────────────────────────────
router.get("/:id", verifyToken, async (req, res) => {
  const id = safeInt(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid booking ID" });

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { train: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ ...booking, bookingReference: generateRef(booking.id, booking.createdAt) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

// ─────────────────────────────────────────
// UPDATE booking (protected)
// Only whitelisted fields accepted. id, createdAt, updatedAt
// cannot be overwritten by the client.
// ─────────────────────────────────────────
router.put("/:id", verifyToken, async (req, res) => {
  const bookingId = safeInt(req.params.id);
  if (bookingId === null) return res.status(400).json({ error: "Invalid booking ID" });

  try {
    // Pick only allowed fields
    const data = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    }

    // Validate enums — use !== undefined, not truthiness (empty string would bypass)
    if (data.status !== undefined && !VALID_STATUS.includes(data.status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed: ${VALID_STATUS.join(", ")}`,
      });
    }
    if (data.paymentStatus !== undefined && !VALID_PAYMENT_STATUS.includes(data.paymentStatus)) {
      return res.status(400).json({
        error: `Invalid paymentStatus. Allowed: ${VALID_PAYMENT_STATUS.join(", ")}`,
      });
    }

    // Reject empty strings on fields that should never be blank
    for (const field of ["passengerName", "idNumber", "departure", "destination"]) {
      if (data[field] !== undefined && !data[field].toString().trim()) {
        return res.status(400).json({ error: `${field} cannot be empty` });
      }
    }

    if (data.email !== undefined) {
      if (!isValidEmail(data.email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      data.email = data.email.trim().toLowerCase();
    }

    // Validate and normalize types
    if (data.date !== undefined) {
      data.date = toDateStr(data.date);
      if (!data.date) return res.status(400).json({ error: "Invalid date format" });
    }
    if (data.price !== undefined) {
      const p = parseFloat(data.price);
      if (isNaN(p) || p < 0) return res.status(400).json({ error: "Invalid price" });
      data.price = Math.round(p);
    }
    if (data.trainId !== undefined) {
      data.trainId = safeInt(data.trainId);
      if (data.trainId === null) return res.status(400).json({ error: "Invalid trainId" });
    }

    // Seat conflict check — runs when seat, date, trainId, OR status changes
    // Reinstating a cancelled booking (status → Active) must also check for conflicts
    const isReinstatement = data.status === "Active";
    if (data.seat !== undefined || data.date !== undefined || data.trainId !== undefined || isReinstatement) {
      const currentBooking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { trainId: true, date: true, seat: true, status: true },
      });

      if (currentBooking) {
        // Use ternary (not ||) so empty string seat is respected when clearing
        const seatToCheck = data.seat !== undefined ? data.seat : currentBooking.seat;
        const dateToCheck = data.date !== undefined ? data.date : currentBooking.date;
        const trainToCheck = data.trainId !== undefined ? data.trainId : currentBooking.trainId;

        // Only check if the seat is assigned (skip general seating / empty)
        if (seatToCheck && seatToCheck !== "General Seating" && seatToCheck !== "") {
          const conflict = await prisma.booking.findFirst({
            where: {
              trainId: trainToCheck,
              seat: seatToCheck,
              date: dateToCheck,
              status: { not: "Cancelled" },
              id: { not: bookingId },
            },
          });

          if (conflict) {
            return res.status(409).json({
              error: "Seat already booked",
              message: `Seat ${seatToCheck} is already taken on that date`,
            });
          }
        }
      }
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data,
      include: { train: true },
    });

    res.json({ ...booking, bookingReference: generateRef(booking.id, booking.createdAt) });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Booking not found" });
    }
    console.error("Booking update error:", error);
    res.status(400).json({ error: "Failed to update booking" });
  }
});

// ─────────────────────────────────────────
// DELETE booking (protected) — soft delete
// Rejects if already cancelled. Sets Refunded only if was Paid.
// ─────────────────────────────────────────
router.delete("/:id", verifyToken, async (req, res) => {
  const id = safeInt(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid booking ID" });

  try {
    const current = await prisma.booking.findUnique({
      where: { id },
      select: { status: true, paymentStatus: true, createdAt: true },
    });

    if (!current) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Reject double-cancel
    if (current.status === "Cancelled") {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }

    // Only refund if payment was actually made
    const newPaymentStatus = current.paymentStatus === "Paid" ? "Refunded" : "Failed";

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: "Cancelled", paymentStatus: newPaymentStatus },
    });

    res.json({
      message: "Booking cancelled successfully",
      bookingReference: generateRef(booking.id, current.createdAt),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Booking not found" });
    }
    console.error("Booking cancel error:", error);
    res.status(400).json({ error: "Failed to cancel booking" });
  }
});

export default router;
