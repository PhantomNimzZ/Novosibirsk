import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LongDistance = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("🔍 Search triggered with:", from, to, date);

    try {
      const response = await fetch(
        `http://localhost:3001/api/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`
      );
      const data = await response.json();
      console.log("✅ Response received:", data);
      setResults(data);
    } catch (err) {
      console.error("❌ Search failed", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>🚆 Long-Distance Train Booking</h1>
      <form onSubmit={handleSearch} style={{ maxWidth: "500px", margin: "0 auto" }}>
        <label>
          From:
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="e.g. Cape Town"
            required
            style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
          />
        </label>
        <label>
          To:
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="e.g. Johannesburg"
            required
            style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
          />
        </label>
        <label>
          Travel Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
          />
        </label>
        <label>
          Passengers:
          <input
            type="number"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            min="1"
            max="10"
            style={{ width: "100%", marginBottom: "1.5rem", padding: "0.5rem" }}
          />
        </label>
        <button type="submit" style={{ width: "100%", padding: "0.75rem", backgroundColor: "#12172b", color: "white", fontWeight: "bold" }}>
          Search Trains
        </button>
      </form>

      {results.length > 0 && (
        <div style={{ maxWidth: "600px", margin: "3rem auto 0", background: "#fff", padding: "1.5rem", borderRadius: "8px" }}>
          <h2>Available Trains</h2>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {results.map((train) => (
              <li key={train.id} style={{ padding: "1rem 0", borderBottom: "1px solid #ddd" }}>
                <strong>{train.train}</strong><br />
                Departure: {train.time}<br />
                Price: {train.price}<br />
                <button
                  onClick={() => navigate("/book", { state: { train } })}
                  style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#007bff", color: "white", border: "none" }}
                >
                  Book Now
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LongDistance;
