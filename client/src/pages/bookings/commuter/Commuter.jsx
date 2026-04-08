// client/src/pages/bookings/commuter/Commuter.jsx
import { useNavigate } from "react-router-dom";
import { colors, typography } from "../../../styles/tokens";

const Commuter = () => {
  const navigate = useNavigate();

  const cities = [
    { name: "Cape Town", id: "cape-town", image: "/images/cape-town.avif", desc: "Southern, Northern, Central & Cape Flats lines" },
    { name: "Johannesburg", id: "johannesburg", image: "/images/johannesburg.avif", desc: "Soweto, Pretoria, East Rand & West Rand lines" },
    { name: "Durban", id: "durban", image: "/images/durban.avif", desc: "Coastal, Inland, KwaMashu & Umlazi lines" },
  ];

  return (
    <div style={styles.page}>
      {/* Nav Bar */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logoGroup} onClick={() => navigate("/")} role="button">
            <svg width="36" height="36" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="3" />
              {[...Array(12)].map((_, i) => (
                <line key={i} x1="50" y1="12" x2="50" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${i * 30} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="8" fill="white" />
            </svg>
            <span style={styles.logoText}>PRASA</span>
          </div>
          <button onClick={() => navigate("/")} style={styles.backBtn}>← Back to Home</button>
        </div>
      </nav>

      <div style={styles.content}>
        <h1 style={styles.title}>Commuter / Metrorail</h1>
        <p style={styles.subtitle}>Select your city to book a commuter ticket</p>

        <div style={styles.cityGrid}>
          {cities.map((city) => (
            <div
              key={city.id}
              style={styles.cityCard}
              onClick={() => navigate(`/commuter/${city.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
              }}
            >
              <div style={{ ...styles.cityImage, backgroundImage: `url(${city.image})` }} />
              <div style={styles.cityBody}>
                <h3 style={styles.cityName}>{city.name}</h3>
                <p style={styles.cityDesc}>{city.desc}</p>
                <span style={styles.cityArrow}>Book Commuter Ticket →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", background: colors.neutral.gray100, fontFamily: typography.fontFamily.body },
  nav: { background: "#0077CC", padding: "0 clamp(1rem, 3vw, 2rem)", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" },
  navInner: { maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" },
  logoGroup: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  logoText: { fontSize: "1.3rem", fontWeight: 700, color: "white", letterSpacing: "0.12em" },
  backBtn: { background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" },
  content: { maxWidth: "900px", margin: "0 auto", padding: "clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)", textAlign: "center" },
  title: { fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, color: colors.neutral.black, margin: "0 0 0.5rem" },
  subtitle: { fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", color: colors.neutral.gray700, margin: "0 0 2rem" },
  cityGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" },
  cityCard: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#E8E4DE",
    cursor: "pointer",
    transition: "all 0.35s ease",
    textAlign: "left",
  },
  cityImage: {
    height: "160px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  cityBody: {
    padding: "1.25rem",
  },
  cityName: { fontSize: "1.25rem", fontWeight: 700, color: colors.neutral.black, margin: "0 0 0.4rem" },
  cityDesc: { fontSize: "0.85rem", color: colors.neutral.gray700, margin: "0 0 1rem", lineHeight: 1.5 },
  cityArrow: { fontSize: "0.9rem", fontWeight: 600, color: colors.primary.blue },
};

export default Commuter;
