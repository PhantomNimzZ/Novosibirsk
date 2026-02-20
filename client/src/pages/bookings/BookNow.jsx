// client/src/pages/bookings/BookNow.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LiveTracker from "../../components/maps/LiveTracker.jsx";
import SeatSelector from "../../components/booking/SeatSelector.jsx";
import { stationCoordinatesByCity } from "../../constants/stationCoordinates";
import { getCityFromTrainId } from "../../utils/routeUtils";
import { generatePDF } from "../../utils/generatePDF";
import { API_BASE } from "../../api/config";

const BookNow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ sessionStorage fallback — survives page refresh
  const [train, setTrain] = useState(() => {
    if (location.state?.train) {
      sessionStorage.setItem("selectedTrain", JSON.stringify(location.state.train));
      return location.state.train;
    }
    const saved = sessionStorage.getItem("selectedTrain");
    return saved ? JSON.parse(saved) : null;
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [payment, setPayment] = useState("online");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Mock booked seats (in production, fetch from API based on train + date)
  const [bookedSeats] = useState(["1A", "1B", "2C", "3D", "5A", "7B"]);

  // Clean up sessionStorage on unmount if booking succeeded
  useEffect(() => {
    return () => {
      if (bookingSuccess) sessionStorage.removeItem("selectedTrain");
    };
  }, [bookingSuccess]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!selectedSeat) {
      alert("Please select a seat before confirming your booking.");
      return;
    }

    setIsSubmitting(true);

    const bookingDetails = {
      passengerName: name,
      email,
      idNumber,
      trainNumber: train.trainNumber || train.train,
      departure: train.from,
      destination: train.to,
      date: train.date || new Date().toISOString(),
      time: train.time || "",
      seat: selectedSeat,
      price: parseFloat(String(train.price).replace(/[^0-9.]/g, "")) || 0,
      paymentStatus: payment === "online" ? "Pending" : "Pay at Station",
      status: "Active",
      trainId: train.trainId || 1,
    };

    try {
      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save booking");
      }

      setBookingData(result);
      setBookingSuccess(true);
      sessionStorage.removeItem("selectedTrain");
    } catch (error) {
      console.error("Booking error:", error);
      alert(`There was an error saving your booking: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTicket = () => {
    if (bookingData) {
      generatePDF(bookingData);
    }
  };

  // ─── No train selected ───
  if (!train) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-600">No train selected.</p>
        <button
          onClick={() => navigate("/select")}
          className="px-6 py-2 bg-[#12172b] text-white rounded-lg hover:bg-blue-950 transition"
        >
          Search for trains
        </button>
      </div>
    );
  }

  // ─── Booking success screen ───
  if (bookingSuccess && bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500">Your journey is ready</p>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking Reference:</span>
              <span className="font-semibold">#{bookingData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span className="font-semibold">{train.from} → {train.to}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-semibold">
                {new Date(bookingData.date).toLocaleDateString()} at {train.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seat:</span>
              <span className="font-semibold text-blue-600">{selectedSeat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-semibold">{train.price}</span>
            </div>
          </div>

          {/* Confirmation Email Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-900">
              📧 A confirmation email has been sent to <strong>{email}</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleDownloadTicket}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Ticket (PDF)
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Booking Form ───
  const cityKey = getCityFromTrainId(train.train);
  const stationCoords = cityKey ? stationCoordinatesByCity[cityKey] : {};

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-semibold mb-3">🚆 Booking: {train.train}</h1>

        <p className="text-gray-700 mb-2">
          <strong>Route:</strong> {train.from} → {train.to}
        </p>
        <p className="text-gray-700 mb-6">
          <strong>Time:</strong> {train.time} | <strong>Price:</strong> {train.price}
        </p>

        {/* Live Tracker */}
        <div className="mb-8">
          <LiveTracker
            trainId={train.train.toLowerCase().replace(/\s+/g, "-")}
            from={train.from}
            to={train.to}
            cityStations={stationCoords}
          />
        </div>

        {/* Seat Selection */}
        <div className="mb-8">
          <SeatSelector
            totalSeats={60}
            bookedSeats={bookedSeats}
            selectedSeat={selectedSeat}
            onSeatSelect={setSelectedSeat}
          />
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBooking} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              required
              className="w-full mt-2 p-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Email Address</label>
            <input
              type="email"
              required
              className="w-full mt-2 p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">ID / Passport Number</label>
            <input
              type="text"
              required
              className="w-full mt-2 p-2 border rounded-md"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Payment Method</label>
            <div className="flex items-center gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={payment === "online"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                Online Payment
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="in-person"
                  checked={payment === "in-person"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                Pay at Station
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedSeat}
            className={`w-full py-3 rounded-lg font-semibold transition mt-4
              ${isSubmitting || !selectedSeat
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#12172b] text-white hover:bg-blue-950"
              }`}
          >
            {isSubmitting ? "Processing..." : selectedSeat ? "Confirm Booking" : "Select a seat to continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookNow;
