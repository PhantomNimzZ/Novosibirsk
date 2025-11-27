import { useLocation } from "react-router-dom";
import { useState } from "react";
import LiveTracker from "../../components/maps/LiveTracker.jsx";
import { stationCoordinatesByCity } from "../../constants/stationCoordinates";

const BookNow = () => {
  const location = useLocation();
  const train = location.state?.train;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [payment, setPayment] = useState("online");

  const handleBooking = async (e) => {
    e.preventDefault();

    const bookingDetails = {
      train: train.train,
      from: train.from,
      to: train.to,
      date: train.date || "N/A",
      time: train.time,
      price: train.price,
      name,
      email,
      idNumber,
      payment,
    };

    try {
      const response = await fetch("http://localhost:3001/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails),
      });

      const result = await response.json();
      alert("🎉 Booking saved successfully!");
    } catch (error) {
      console.error("❌ Booking error:", error);
      alert("There was an error saving your booking.");
    }
  };

  if (!train)
    return (
      <p className="p-6 text-center text-lg">No train selected.</p>
    );

  // Extract city key
  const cityKey = train.train.toLowerCase().includes("durban")
    ? "durban"
    : train.train.toLowerCase().includes("cape town")
    ? "cape-town"
    : train.train.toLowerCase().includes("johannesburg")
    ? "johannesburg"
    : null;

  const stationCoords = cityKey ? stationCoordinatesByCity[cityKey] : {};

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-semibold mb-3">
          🚆 Booking: {train.train}
        </h1>

        <p className="text-gray-700 mb-2">
          <strong>Route:</strong> {train.from} → {train.to}
        </p>
        <p className="text-gray-700 mb-6">
          <strong>Time:</strong> {train.time} |{" "}
          <strong>Price:</strong> {train.price}
        </p>

        {/* LIVE TRACKER MAP */}
        <div className="mb-8">
          <LiveTracker
            trainId={train.train.toLowerCase().replace(/\s+/g, "-")}
            from={train.from}
            to={train.to}
            cityStations={stationCoords}
          />
        </div>

        {/* BOOKING FORM */}
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
                Online
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="in-person"
                  checked={payment === "in-person"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                In Person
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#12172b] text-white py-3 rounded-lg font-semibold hover:bg-blue-950 transition mt-4"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookNow;
