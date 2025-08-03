import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Debug: check if token already exists
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      console.log("🔑 Existing token found in localStorage:", token);
    } else {
      console.log("🚫 No token found in localStorage.");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Login failed");
        return;
      }

      const data = await res.json();
      localStorage.setItem("adminToken", data.token);
      console.log("✅ Token saved to localStorage:", data.token);

      alert("✅ Login successful!");
      navigate("/admin");
    } catch (err) {
      console.error("❌ Login error:", err);
      alert("Login failed due to a network or server error.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🔐 Admin Login</h1>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem",
            background: "#007bff",
            color: "#fff",
            border: "none",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
