// client/src/components/admin/EditBookingModal.jsx
import { useState, useEffect } from "react";
import { API_BASE } from "../../api/config";

const EditBookingModal = ({ booking, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    passengerName: "",
    email: "",
    idNumber: "",
    trainNumber: "",
    departure: "",
    destination: "",
    date: "",
    time: "",
    seat: "",
    price: 0,
    paymentStatus: "Pending",
    status: "Active",
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        passengerName: booking.passengerName || "",
        email: booking.email || "",
        idNumber: booking.idNumber || "",
        trainNumber: booking.trainNumber || "",
        departure: booking.departure || "",
        destination: booking.destination || "",
        date: booking.date ? new Date(booking.date).toISOString().split("T")[0] : "",
        time: booking.time || "",
        seat: booking.seat || "",
        price: booking.price || 0,
        paymentStatus: booking.paymentStatus || "Pending",
        status: booking.status || "Active",
      });
    }
  }, [booking]);

  // Fetch booked seats for this train/date to populate dropdown
  const [bookedSeats, setBookedSeats] = useState([]);
  useEffect(() => {
    if (!booking?.trainId || !booking?.date || booking.seat === "General Seating") return;
    const fetchSeats = async () => {
      try {
        const dateStr = new Date(booking.date).toISOString().split("T")[0];
        const response = await fetch(
          `${API_BASE}/api/trains/${booking.trainId}/seats?date=${dateStr}`
        );
        if (response.ok) {
          const data = await response.json();
          // Exclude this booking's current seat from "booked" list
          setBookedSeats(data.bookedSeats.filter((s) => s !== booking.seat));
        }
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };
    fetchSeats();
  }, [booking]);

  // Generate seat options (rows 1-15, columns A-D)
  const generateSeatOptions = () => {
    const seats = [];
    for (let row = 1; row <= 15; row++) {
      for (const col of ["A", "B", "C", "D"]) {
        seats.push(`${row}${col}`);
      }
    }
    return seats;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if new seat is available (if seat changed)
    if (formData.seat !== booking.seat && formData.seat && formData.seat !== "General Seating") {
      try {
        const response = await fetch(
          `${API_BASE}/api/trains/${booking.trainId}/seats/${formData.seat}/available?date=${formData.date}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (!data.available) {
            alert(`❌ Seat ${formData.seat} is already booked by ${data.bookedBy}. Please choose a different seat.`);
            return; // Don't save
          }
        }
      } catch (error) {
        console.error("Error checking seat availability:", error);
        // Continue anyway - don't block if API fails
      }
    }
    
    // Send only editable fields
    const dataToSave = {
      id: booking.id,
      // Editable fields only
      passengerName: formData.passengerName,
      email: formData.email,
      idNumber: formData.idNumber,
      seat: formData.seat,
      price: parseFloat(formData.price),
      paymentStatus: formData.paymentStatus,
      status: formData.status,
      // Keep original train data
      trainId: booking.trainId,
      trainNumber: booking.trainNumber,
      departure: booking.departure,
      destination: booking.destination,
      date: booking.date,
      time: booking.time,
    };

    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Booking #{booking?.id}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Passenger Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passenger Name *
                </label>
                <input
                  type="text"
                  name="passengerName"
                  value={formData.passengerName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Number *
              </label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Route Info - Read Only */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                🔒 Train & Route Information (Read-only)
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Train:</span>{" "}
                  <span className="font-medium">{booking.trainNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Route:</span>{" "}
                  <span className="font-medium">{booking.departure} → {booking.destination}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>{" "}
                  <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>{" "}
                  <span className="font-medium">{booking.time || "N/A"}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ℹ️ To change train/route/schedule, cancel this booking and create a new one.
              </p>
            </div>
            {/* Seat Selection (with availability check) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seat Number
              </label>
              {booking.seat === "General Seating" ? (
                <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600">
                  General Seating (Commuter Train)
                </div>
              ) : (
                <select
                  name="seat"
                  value={formData.seat}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a seat --</option>
                  {generateSeatOptions().map((seat) => {
                    const isBooked = bookedSeats.includes(seat);
                    return (
                      <option key={seat} value={seat} disabled={isBooked}>
                        {seat}{isBooked ? " (booked)" : ""}
                      </option>
                    );
                  })}
                </select>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {booking.seat === "General Seating" 
                  ? "🚇 Commuter trains use general seating only"
                  : "⚠️ Changing seat will check availability to prevent double-booking"
                }
              </p>
            </div>

            {/* Price & Status */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (R) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-yellow-600 mt-1">
                  ⚠️ Changing price will create mismatch with train price
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status *
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
