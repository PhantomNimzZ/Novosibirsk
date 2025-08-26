import { useState } from "react";

function CreateBooking() {
  const [formData, setFormData] = useState({
    passengerName: "",
    trainNumber: "",
    departure: "",
    destination: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking created:", formData);
    alert("Booking created (dummy for now)!");
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
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="trainNumber"
          placeholder="Train Number"
          value={formData.trainNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="departure"
          placeholder="Departure Station"
          value={formData.departure}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination Station"
          value={formData.destination}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Booking
        </button>
      </form>
    </div>
  );
}

export default CreateBooking;
