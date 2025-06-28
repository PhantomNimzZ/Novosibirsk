import { useNavigate } from "react-router-dom";

const Commuter = () => {
  const navigate = useNavigate();

  const cities = [
    { name: "Cape Town", id: "cape-town" },
    { name: "Johannesburg", id: "johannesburg" },
    { name: "Durban", id: "durban" },
  ];

  return (
    <div style={{ textAlign: "center", paddingTop: "5rem", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>🚉 Choose Your City</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => navigate(`/commuter/${city.id}`)}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#12172b",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Commuter;
