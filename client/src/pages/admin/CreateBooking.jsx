import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreateBooking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    passengerName: "",
    email: "",
    idNumber: "",
    trainId: "",
    trainNumber: "",
    departure: "",
    destination: "",
    date: "",
    time: "",
    seat: "",
    price: "",
    paymentStatus: "Pending",
    status: "Active",
  });

  const [trains, setTrains] = useState([]);

  // Fetch trains for dropdown
  useEffect(() => {
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
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const bookingData = {
      ...formData,
      price: parseFloat(formData.price),
      trainId: parseInt(formData.trainId),
    };

    try {
      const res = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) throw new Error("Failed to create booking");
      const data = await res.json();
      alert(`Booking created successfully for ${data.passengerName}!`);
      navigate("/admin/manage-bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. See console for details.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create a Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="passengerName"
          placeholder="Passenger Name"
          value={formData.passengerName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          value={formData.idNumber}
          onChange={handleChange}
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
              trainNumber: selectedTrain?.number || "",
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
          placeholder="Departure Station"
          value={formData.departure}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination Station"
          value={formData.destination}
          onChange={handleChange}
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
          placeholder="Seat Number"
          value={formData.seat}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Booking
        </button>
      </form>
    </div>
  );
}

export default CreateBooking;
