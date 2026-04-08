// client/src/pages/admin/CreateBooking.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../api/config";

const CreateBooking = () => {
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    passengerName: "",
    email: "",
    idNumber: "",
    seat: "",
    paymentStatus: "Pending",
  });

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE}/api/trains`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch trains");

      const data = await response.json();
      
      // Filter out Metro Rail trains (only show long-distance)
      const longDistanceTrains = data.filter(train => 
        !train.trainName?.includes("Metro Rail")
      );
      
      setTrains(longDistanceTrains);
    } catch (error) {
      console.error("Error fetching trains:", error);
      alert("Failed to load trains");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTrainSelect = (e) => {
    const trainId = parseInt(e.target.value);
    const train = trains.find((t) => t.id === trainId);
    setSelectedTrain(train);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTrain) {
      alert("Please select a train");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      
      const bookingData = {
        passengerName: formData.passengerName,
        email: formData.email,
        idNumber: formData.idNumber,
        trainNumber: selectedTrain.trainNumber,
        departure: selectedTrain.from,
        destination: selectedTrain.to,
        date: selectedTrain.date,
        time: selectedTrain.time,
        seat: formData.seat || "General Seating",
        price: selectedTrain.price,
        paymentStatus: formData.paymentStatus,
        status: "Active",
        trainId: selectedTrain.id,
      };

      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      alert("Booking created successfully!");
      navigate("/admin/manage-bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Booking</h1>
        <p className="text-sm text-gray-600 mt-1">
          Create a manual booking for a passenger
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Train */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Train *
            </label>
            <select
              onChange={handleTrainSelect}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a train --</option>
              {trains.map((train) => (
                <option key={train.id} value={train.id}>
                  {train.trainName} ({train.trainNumber}) - {train.from} → {train.to} at{" "}
                  {train.time} - R{train.price}
                </option>
              ))}
            </select>
          </div>

          {/* Train Details Preview */}
          {selectedTrain && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Selected Train Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-blue-700">Route:</span>{" "}
                  <span className="font-medium">{selectedTrain.from} → {selectedTrain.to}</span>
                </div>
                <div>
                  <span className="text-blue-700">Date:</span>{" "}
                  <span className="font-medium">
                    {new Date(selectedTrain.date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Time:</span>{" "}
                  <span className="font-medium">{selectedTrain.time}</span>
                </div>
                <div>
                  <span className="text-blue-700">Price:</span>{" "}
                  <span className="font-medium">R{selectedTrain.price}</span>
                </div>
                <div>
                  <span className="text-blue-700">Class:</span>{" "}
                  <span className="font-medium">{selectedTrain.class || "Standard"}</span>
                </div>
                <div>
                  <span className="text-blue-700">Available Seats:</span>{" "}
                  <span className="font-medium">{selectedTrain.seats}</span>
                </div>
              </div>
            </div>
          )}

          {/* Passenger Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Passenger Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="passengerName"
                  value={formData.passengerName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  placeholder="1234567890123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seat Number
                </label>
                <input
                  type="text"
                  name="seat"
                  value={formData.seat}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5A (leave blank for general seating)"
                />
              </div>
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
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/bookings")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedTrain}
              className={`px-4 py-2 rounded-md text-white transition ${
                loading || !selectedTrain
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBooking;
