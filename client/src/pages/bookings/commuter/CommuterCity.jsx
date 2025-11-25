import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import CityMapPreview from "../../../components/maps/CityMapPreview";
import { stationCoordinatesByCity } from "../../../constants/stationCoordinates";

const CommuterCity = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();

  const cityStations = stationCoordinatesByCity[cityId] || {};
  const stationNames = Object.keys(cityStations);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleBook = () => {
    if (!from || !to || from === to) {
      alert("Please select different departure and destination stations.");
      return;
    }

    const train = {
      train: `Commuter Line - ${cityId}`,
      from,
      to,
      time: "Every 30 min",
      price: "R25",
    };

    navigate("/book", { state: { train } });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🚉 {cityId.replace("-", " ").toUpperCase()} - Commuter Booking</h1>
      <label>
        From Station:
        <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ marginLeft: "1rem" }}>
          <option value="">-- Select --</option>
          {stationNames.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <br /><br />
      <label>
        To Station:
        <select value={to} onChange={(e) => setTo(e.target.value)} style={{ marginLeft: "1rem" }}>
          <option value="">-- Select --</option>
          {stationNames.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <br /><br />
      <p><strong>Fare:</strong> R25</p>
      <button onClick={handleBook}>Book Now</button>

      {/* 🗺️ City Station Map */}
      <CityMapPreview cityId={cityId} />
    </div>
  );
};

export default CommuterCity;
