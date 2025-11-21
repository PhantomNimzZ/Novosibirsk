import { useLocation } from "react-router-dom";
import { useState } from "react";
import LiveTracker from "../../components/maps/LiveTracker.jsx";
import { stationCoordinatesByCity } from "../../constants/stationCoordinates.js";

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

  if (!train) return <p style={{ padding: "2rem" }}>No train selected.</p>;

  // 🔍 Extract city key from train ID
  const cityKey = train.train.toLowerCase().includes("durban") ? "durban"
                : train.train.toLowerCase().includes("cape town") ? "cape-town"
                : train.train.toLowerCase().includes("johannesburg") ? "johannesburg"
                : null;

  const stationCoords = cityKey ? stationCoordinatesByCity[cityKey] : {};

  return (
  <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
    <h1>🚆 Booking: {train.train}</h1>
    <p><strong>Route:</strong> {train.from} → {train.to}</p>
    <p><strong>Time:</strong> {train.time} | <strong>Price:</strong> {train.price}</p>

    {/* ✅ Add a container for the live tracker map */}
    <div style={{ marginTop: "1rem" }}>
      <LiveTracker
        trainId={train.train.toLowerCase().replace(/\s+/g, "-")}
        from={train.from}
        to={train.to}
        cityStations={stationCoords}
      />

    </div>

    {/* ✅ Add a container for the booking form */}
    <form onSubmit={handleBooking} style={{ marginTop: "2rem" }}>
      <label>
        Full Name:<br />
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br /><br />
      <label>
        Email Address:<br />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br /><br />
      <label>
        ID/Passport Number:<br />
        <input type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
      </label>
      <br /><br />
      <label>
        Payment Method:<br />
        <input
          type="radio"
          name="payment"
          value="online"
          checked={payment === "online"}
          onChange={(e) => setPayment(e.target.value)}
        /> Online
        <input
          type="radio"
          name="payment"
          value="in-person"
          checked={payment === "in-person"}
          onChange={(e) => setPayment(e.target.value)}
          style={{ marginLeft: "1rem" }}
        /> In Person
      </label>
      <br /><br />
      <button type="submit">Confirm Booking</button>
    </form>
  </div>
  );
};

export default BookNow;
