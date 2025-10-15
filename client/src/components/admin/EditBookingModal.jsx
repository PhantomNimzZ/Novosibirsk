import React, { useState, useEffect } from "react";

const EditBookingModal = ({ booking, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    passengerName: "",
    email: "",
    idNumber: "",
    departure: "",
    destination: "",
    date: "",
    time: "",
    seat: "",
    price: "",
    paymentStatus: "",
    status: "",
    trainId: "",
  });

  const [trains, setTrains] = useState([]);

  // Load booking data into the form and fetch trains
  useEffect(() => {
    if (booking) {
      setFormData({
        passengerName: booking.passengerName || "",
        email: booking.email || "",
        idNumber: booking.idNumber || "",
        departure: booking.departure || "",
        destination: booking.destination || "",
        date: booking.date ? booking.date.split("T")[0] : "",
        time: booking.time || "",
        seat: booking.seat || "",
        price: booking.price || "",
        paymentStatus: booking.paymentStatus || "Pending",
        status: booking.status || "Active",
        trainId: booking.trainId || "",
      });
    }

    const fetchTrains = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("http://localhost:3001/api/trains", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch trains");
        const data = await res.json();
        setTrains(data);
      } catch (err) {
        console.error("Error fetching trains:", err);
      }
    };

    fetchTrains();
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:3001/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          trainId: parseInt(formData.trainId),
          price: parseFloat(formData.price),
        }),
      });

      if (!res.ok) throw new Error("Failed to update booking");
      const updatedBooking = await res.json();
      onSave(updatedBooking);
      onClose();
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking. See console for details.");
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
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            placeholder="ID Number"
            required
          />

          {/* Train selection dropdown */}
          <select
            name="trainId"
            value={formData.trainId}
            onChange={(e) => {
              const selectedTrain = trains.find(t => t.id === parseInt(e.target.value));
              setFormData({
                ...formData,
                trainId: e.target.value,
              });
            }}
            required
          >
            <option value="">Select Train</option>
            {trains.map((train) => (
              <option key={train.id} value={train.id}>
                {train.name} ({train.number})
              </option>
            ))}
          </select>

          <input
            type="text"
            name="departure"
            value={formData.departure}
            onChange={handleChange}
            placeholder="Departure"
            required
          />
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Destination"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="seat"
            value={formData.seat}
            onChange={handleChange}
            placeholder="Seat"
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
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
