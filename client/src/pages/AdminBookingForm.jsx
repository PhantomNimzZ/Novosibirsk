import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminBookingForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    from: "",
    to: "",
    train: "",
    date: "",
    time: "",
    payment: "",
    price: "",
    idNumber: "", // ✅ Add this
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, from, to, train, date, time, payment, price } = form;

    if (!name || !email || !from || !to || !train || !date || !time || !payment || !price) {
      alert("❌ Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("❌ Invalid email format.");
      return;
    }

    if (isNaN(payment) || isNaN(price)) {
      alert("❌ Payment and price must be numeric.");
      return;
    }

    // Continue with submission
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`❌ Error: ${data.message}`);
        return;
      }

      alert("✅ Booking created successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Failed to create booking.");
    }
  };


  return (
    <div style={{ padding: "2rem" }}>
      <h2>➕ Create Booking</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <input type="text" name="name" placeholder="Passenger Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="text" name="from" placeholder="From" value={form.from} onChange={handleChange} required />
        <input type="text" name="to" placeholder="To" value={form.to} onChange={handleChange} required />
        <input type="text" name="train" placeholder="Train Name" value={form.train} onChange={handleChange} required />
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input type="time" name="time" value={form.time} onChange={handleChange} required />
        <input type="text" name="payment" placeholder="Payment Amount" value={form.payment} onChange={handleChange} required />
        <input type="text" name="price" placeholder="Ticket Price" value={form.price} onChange={handleChange} required /> {/* ✅ NEW INPUT */}

        <button type="submit" style={{ padding: "0.5rem", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdminBookingForm;
