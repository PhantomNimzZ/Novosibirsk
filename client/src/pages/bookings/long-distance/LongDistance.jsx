// client/src/pages/bookings/long-distance/LongDistance.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../api/config"; // ✅ Centralised URL

const LongDistance = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // ✅ Track whether a search was made
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(false);

    try {
      const response = await fetch(
        // ✅ passengers now included in the query
        `${API_BASE}/api/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}&passengers=${passengers}`
      );
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    } finally {
      setHasSearched(true);
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12172b] text-white px-4 py-10">
      <h1 className="text-center text-3xl font-semibold mb-10">
        🚆 Long-Distance Train Booking
      </h1>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="max-w-md mx-auto bg-white text-black p-6 rounded-2xl shadow-lg"
      >
        <label className="block mb-4">
          <span className="font-medium">From:</span>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="e.g. Cape Town"
            required
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium">To:</span>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="e.g. Johannesburg"
            required
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium">Travel Date:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </label>

        <label className="block mb-6">
          <span className="font-medium">Passengers:</span>
          <input
            type="number"
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            min="1"
            max="10"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </label>

        <button
          type="submit"
          disabled={isSearching}
          className={`w-full py-3 font-semibold rounded-lg transition shadow-md text-white
            ${isSearching ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isSearching ? "Searching..." : "Search Trains"}
        </button>
      </form>

      {/* Results */}
      {hasSearched && (
        <div className="max-w-xl mx-auto mt-10">
          {results.length > 0 ? (
            <div className="bg-white text-black p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Available Trains</h2>
              <ul>
                {results.map((train) => (
                  <li key={train.id} className="border-b last:border-none py-4">
                    <p className="font-semibold text-lg">{train.train}</p>
                    <p>Departure: {train.time}</p>
                    <p>Price: {train.price}</p>
                    {passengers > 1 && (
                      <p className="text-sm text-gray-500">for {passengers} passengers</p>
                    )}
                    <button
                      onClick={() => navigate("/book", { state: { train } })}
                      className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      Book Now
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            // ✅ Empty state — previously nothing was shown
            <div className="text-center py-8 opacity-70">
              <p className="text-lg">No trains found for this route.</p>
              <p className="text-sm mt-2">Try a different date or destination.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LongDistance;
