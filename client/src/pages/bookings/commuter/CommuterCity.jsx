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
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        🚉 {cityId.replace("-", " ").toUpperCase()} – Commuter Booking
      </h1>

      <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-6 mb-8">
        <div className="mb-4">
          <label className="font-medium">From Station:</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-2 w-full p-2 border rounded-md"
          >
            <option value="">-- Select --</option>
            {stationNames.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="font-medium">To Station:</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-2 w-full p-2 border rounded-md"
          >
            <option value="">-- Select --</option>
            {stationNames.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <p className="font-semibold mb-4">Fare: <span className="text-blue-600">R25</span></p>

        <button
          onClick={handleBook}
          className="w-full bg-[#12172b] text-white py-3 rounded-lg font-semibold hover:bg-blue-950 transition"
        >
          Book Now
        </button>
      </div>

      {/* 🗺️ City Station Map */}
      <div className="w-full max-w-3xl">
        <CityMapPreview cityId={cityId} />
      </div>
    </div>
  );
};

export default CommuterCity;
