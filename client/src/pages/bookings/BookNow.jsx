// client/src/pages/bookings/BookNow.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LiveTracker from "../../components/maps/LiveTracker.jsx";
import { stationCoordinatesByCity } from "../../constants/stationCoordinates";
import { getCityFromTrainId } from "../../utils/routeUtils"; // ✅ Use shared utility
import { API_BASE } from "../../api/config";                // ✅ No more hardcoded URL

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);

  // Clean up sessionStorage on unmount
  useEffect(() => {
    return () => {
      if (bookingSuccess) sessionStorage.removeItem("selectedTrain");
    };
  }, [bookingSuccess]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
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
      seat: "",
      price: parseFloat(String(train.price).replace(/[^0-9.]/g, "")) || 0,
      paymentStatus: "Pending",
      status: "Active",
      trainId: train.trainId || 1,
      payment,
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

      setBookingRef(result.id);
      setBookingSuccess(true);
      sessionStorage.removeItem("selectedTrain");
    } catch (error) {
      console.error("Booking error:", error);
      alert(`There was an error saving your booking: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-1">Booking reference: <strong>#{bookingRef}</strong></p>
          <p className="text-gray-500 mb-1">{train.from} → {train.to}</p>
          <p className="text-gray-500 mb-6">{train.time} | {train.price}</p>
          <p className="text-sm text-gray-400 mb-6">
            A confirmation will be sent to <strong>{email}</strong>
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-[#12172b] text-white rounded-lg font-semibold hover:bg-blue-950 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ✅ Use shared utility instead of inline ternary chain
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

        <div className="mb-8">
          <LiveTracker
            trainId={train.train.toLowerCase().replace(/\s+/g, "-")}
            from={train.from}
            to={train.to}
            cityStations={stationCoords}
          />
        </div>

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
                <input type="radio" name="payment" value="online"
                  checked={payment === "online"} onChange={(e) => setPayment(e.target.value)} />
                Online
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" value="in-person"
                  checked={payment === "in-person"} onChange={(e) => setPayment(e.target.value)} />
                In Person
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold transition mt-4
              ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#12172b] text-white hover:bg-blue-950"
              }`}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookNow;
