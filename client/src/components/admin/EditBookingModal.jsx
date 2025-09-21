import React, { useState, useEffect } from "react";

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
    price: "",
    paymentStatus: "",
    status: "",
  });

  // Load booking data into the form when modal opens
  useEffect(() => {
    if (booking) {
      setFormData({
        passengerName: booking.passengerName || "",
        email: booking.email || "",
        idNumber: booking.idNumber || "",
        trainNumber: booking.trainNumber || "",
        departure: booking.departure || "",
        destination: booking.destination || "",
        date: booking.date ? booking.date.split("T")[0] : "",
        time: booking.time || "",
        seat: booking.seat || "",
        price: booking.price || "",
        paymentStatus: booking.paymentStatus || "",
        status: booking.status || "",
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update booking");
      const updatedBooking = await res.json();
      onSave(updatedBooking);
      onClose();
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  if (!booking) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Booking</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            name="passengerName"
            value={formData.passengerName}
            onChange={handleChange}
            placeholder="Passenger Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            placeholder="ID Number"
          />
          <input
            type="text"
            name="trainNumber"
            value={formData.trainNumber}
            onChange={handleChange}
            placeholder="Train Number"
          />
          <input
            type="text"
            name="departure"
            value={formData.departure}
            onChange={handleChange}
            placeholder="Departure"
          />
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Destination"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
          <input
            type="text"
            name="seat"
            value={formData.seat}
            onChange={handleChange}
            placeholder="Seat"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
          />
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;
