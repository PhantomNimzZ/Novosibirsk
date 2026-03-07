// client/src/pages/admin/CreateCommuterBooking.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../api/config";
import { metroLines } from "../../constants/metroLines";

// City ID mapping
const cityMapping = {
  "cape-town": "Cape Town",
  "durban": "Durban",
  "johannesburg": "Johannesburg",
  "pretoria": "Pretoria",
  "port-elizabeth": "Port Elizabeth",
};

const CreateCommuterBooking = () => {
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTrains, setAvailableTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    passengerName: "",
    email: "",
    idNumber: "",
    paymentStatus: "Pending",
  });

  const navigate = useNavigate();

  // Get available lines for selected city
  const availableLines = selectedCityId ? Object.keys(metroLines[selectedCityId]) : [];

  // Get stations for selected line
  const availableStations = selectedCityId && selectedLine 
    ? metroLines[selectedCityId][selectedLine] 
    : [];

  // Fetch available trains when route and date selected
  useEffect(() => {
    if (fromStation && toStation && selectedDate) {
      fetchAvailableTrains();
    }
  }, [fromStation, toStation, selectedDate]);

  const fetchAvailableTrains = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      
      const response = await fetch(
        `${API_BASE}/api/trains`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch trains");

      const allTrains = await response.json();
      
      // ✅ APPROACH B: Find trains where route is in forward direction (UNIDIRECTIONAL)
      const matching = allTrains.filter(train => {
        if (!train.train?.includes("Metro Rail")) return false;
        
        // Check if this train serves both stations in forward direction
        try {
          const stops = JSON.parse(train.intermediateStops || "[]");
          const fromIndex = stops.indexOf(fromStation);
          const toIndex = stops.indexOf(toStation);
          
          // ✅ UNIDIRECTIONAL: Only forward direction (matches seed data)
          return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
        } catch (error) {
          // Fallback to exact match if intermediateStops not available
          return train.from === fromStation && train.to === toStation;
        }
      }).filter(train => 
        new Date(train.date).toISOString().split('T')[0] === selectedDate
      );

      console.log(`Found ${matching.length} trains that serve ${fromStation} → ${toStation} on ${selectedDate}`);
      
      setAvailableTrains(matching);
      if (matching.length > 0) {
        setSelectedTrain(matching[0]);
      } else {
        setSelectedTrain(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trains:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    setSelectedCityId(e.target.value);
    setSelectedLine("");
    setFromStation("");
    setToStation("");
    setAvailableTrains([]);
    setSelectedTrain(null);
  };

  const handleLineChange = (e) => {
    setSelectedLine(e.target.value);
    setFromStation("");
    setToStation("");
    setAvailableTrains([]);
    setSelectedTrain(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTrain) {
      alert("No trains available for this route and date. Please try a different date.");
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
        seat: "General Seating", // Always general seating for commuter
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

      alert("Commuter booking created successfully!");
      navigate("/admin/manage-bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create Commuter Booking</h1>
        <p className="text-sm text-gray-600 mt-1">
          Book a metro/commuter train ticket - valid for any train on selected date
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Select City */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mr-3">1</span>
              Select City
            </h3>
            <select
              value={selectedCityId}
              onChange={handleCityChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose a city --</option>
              {Object.entries(cityMapping).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Line */}
          {selectedCityId && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mr-3">2</span>
                Select Metro Line
              </h3>
              <select
                value={selectedLine}
                onChange={handleLineChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose a line --</option>
                {availableLines.map(line => (
                  <option key={line} value={line}>{line}</option>
                ))}
              </select>
            </div>
          )}

          {/* Step 3: Select Route */}
          {selectedLine && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mr-3">3</span>
                Select Route
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Station</label>
                  <select
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select --</option>
                    {availableStations.map(station => (
                      <option key={station} value={station}>{station}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Station</label>
                  <select
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select --</option>
                    {availableStations.filter(s => s !== fromStation).map(station => (
                      <option key={station} value={station}>{station}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Select Date (NO TIME - General Ticket) */}
          {fromStation && toStation && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mr-3">4</span>
                Select Travel Date
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date (General ticket - valid for any train)
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  ℹ️ Commuter tickets are valid for any train on this route for the selected date
                </p>
              </div>

              {/* Train Preview */}
              {selectedTrain && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    ✅ Trains Available on {selectedDate}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-700">Route:</span>{" "}
                      <span className="font-medium">{selectedTrain.from} → {selectedTrain.to}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Available Times:</span>{" "}
                      <span className="font-medium">
                        {availableTrains.map(t => t.time).join(", ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Price:</span>{" "}
                      <span className="font-medium">R{selectedTrain.price}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Seat:</span>{" "}
                      <span className="font-medium">General Seating</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    {availableTrains.length} train(s) available - ticket valid for any departure
                  </p>
                </div>
              )}

              {availableTrains.length === 0 && selectedDate && !loading && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-800 font-medium">No trains available for this route and date</p>
                  <p className="text-sm text-yellow-600 mt-1">
                    Try selecting a different date (March 10-16, 2026)
                  </p>
                </div>
              )}

              {loading && (
                <div className="mt-4 flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Checking availability...</span>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Passenger Details */}
          {selectedTrain && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mr-3">5</span>
                Passenger Details
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status *</label>
                    <select
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Pay at Station">Pay at Station</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/manage-bookings")}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedTrain}
              className={`px-6 py-2 rounded-md text-white transition ${
                loading || !selectedTrain
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create Commuter Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommuterBooking;
