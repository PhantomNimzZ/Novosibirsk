import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import this
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate(); // ✅ Initialize it here

  const handleSearch = async (e) => {
    e.preventDefault();

    console.log("📤 Sending request to backend:", from, to, date);

    try {
      const response = await fetch(`http://localhost:3001/api/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`);
      const data = await response.json();
      console.log("✅ Received data:", data);
      setResults(data);
    } catch (err) {
      console.error("❌ Network error:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🚆 PRASA Train Booking</h1>
      <p>Find and book your next train easily.</p>
      <form onSubmit={handleSearch}>
        <label>
          Departure:
          <input
            type="text"
            placeholder="e.g. Cape Town"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <br /><br />
        <label>
          Destination:
          <input
            type="text"
            placeholder="e.g. Johannesburg"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        <br /><br />
        <label>
          Travel Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <br /><br />
        <button type="submit">Search Trains</button>
      </form>

      {results.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Available Trains</h2>
          <ul>
            {results.map((train) => (
              <li key={train.id}>
                <strong>{train.train}</strong> – {train.time} – {train.price}{" "}
                <button onClick={() => navigate("/book", { state: { train } })}>
                  Book Now
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
