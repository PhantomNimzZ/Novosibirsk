import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`http://localhost:3001/api/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text(); // fallback to text for debugging
          throw new Error(`Failed to fetch: ${res.status} - ${text}`);
        }

        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error("❌ Error loading booking:", err);
        alert("Failed to load booking details.");
      }
    };

    fetchBooking();
  }, [id]);


  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, from, to, train, date, time, payment, price, idNumber } = booking;

    if (!name || !email || !from || !to || !train || !date || !time || !payment || !price || !idNumber) {
      alert("❌ Please fill in all fields.");
      setLoading(false);
      return;
    }


    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`http://localhost:3001/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(booking),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`❌ Update failed: ${data.message}`);
        return;
      }

      alert("✅ Booking updated successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Something went wrong during update.");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "500px", margin: "auto" }}>
      <h2>✏️ Edit Booking</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {["name", "email", "from", "to", "train", "date", "time", "payment", "price", "idNumber"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={booking[field] || ""}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem" }}
          />
        ))}


        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.6rem",
            backgroundColor: loading ? "#aaa" : "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditBooking;
