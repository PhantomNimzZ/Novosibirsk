// client/src/pages/info/TrainSchedules.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { colors, typography, spacing } from "../../styles/tokens";

const ROUTES = [
  {
    id: "ct-jhb",
    name: "Cape Town – Johannesburg",
    via: "Worcester, De Aar, Kimberley, Bloemfontein, Kroonstad",
    distance: 1530,
    duration: 26,
    trains: [
      { service: "Shosholoza Meyl", type: "Economy", departs: "06:00", arrives: "08:00+1", frequency: "Daily", price: 410 },
      { service: "Shosholoza Meyl", type: "Tourist Sleeper", departs: "14:00", arrives: "16:00+1", frequency: "Daily", price: 689 },
      { service: "Premier Classe", type: "Luxury Sleeper", departs: "09:30", arrives: "11:30+1", frequency: "Daily", price: 2142 },
    ],
  },
  {
    id: "jhb-dbn",
    name: "Johannesburg – Durban",
    via: "Ladysmith, Pietermaritzburg",
    distance: 660,
    duration: 13,
    trains: [
      { service: "Shosholoza Meyl", type: "Economy", departs: "06:00", arrives: "19:00", frequency: "Daily", price: 178 },
      { service: "Shosholoza Meyl", type: "Tourist Sleeper", departs: "18:30", arrives: "07:30+1", frequency: "Daily", price: 297 },
      { service: "Premier Classe", type: "Luxury Sleeper", departs: "09:30", arrives: "22:30", frequency: "Daily", price: 924 },
    ],
  },
  {
    id: "ct-dbn",
    name: "Cape Town – Durban",
    via: "Worcester, Kimberley, Bloemfontein, Ladysmith, P.Maritzburg",
    distance: 1670,
    duration: 38,
    trains: [
      { service: "Shosholoza Meyl", type: "Economy", departs: "06:00", arrives: "20:00+1", frequency: "Daily", price: 446 },
      { service: "Shosholoza Meyl", type: "Tourist Sleeper", departs: "14:00", arrives: "04:00+2", frequency: "Daily", price: 751 },
    ],
  },
  {
    id: "ct-pe",
    name: "Cape Town – Port Elizabeth",
    via: "Worcester, De Aar",
    distance: 1050,
    duration: 20,
    trains: [
      { service: "Shosholoza Meyl", type: "Economy", departs: "06:00", arrives: "02:00+1", frequency: "Daily", price: 283 },
      { service: "Shosholoza Meyl", type: "Tourist Sleeper", departs: "14:00", arrives: "10:00+1", frequency: "Daily", price: 473 },
    ],
  },
  {
    id: "jhb-el",
    name: "Johannesburg – East London",
    via: "Kroonstad, Bloemfontein",
    distance: 1060,
    duration: 20,
    trains: [
      { service: "Shosholoza Meyl", type: "Economy", departs: "06:00", arrives: "02:00+1", frequency: "Daily", price: 283 },
      { service: "Shosholoza Meyl", type: "Tourist Sleeper", departs: "18:30", arrives: "14:30+1", frequency: "Daily", price: 477 },
    ],
  },
  {
    id: "ct-el",
    name: "Cape Town – East London",
    via: "Worcester, De Aar, Kimberley, Bloemfontein",
    distance: 1310,
    duration: 24,
    trains: [
      { service: "Shosholoza Meyl", type: "Economy", departs: "06:00", arrives: "06:00+1", frequency: "Daily", price: 354 },
      { service: "Shosholoza Meyl", type: "Tourist Sleeper", departs: "14:00", arrives: "14:00+1", frequency: "Daily", price: 590 },
    ],
  },
];

const TrainSchedules = () => {
  const navigate = useNavigate();
  const [expandedRoute, setExpandedRoute] = useState(null);

  const toggleRoute = (id) => {
    setExpandedRoute(expandedRoute === id ? null : id);
  };

  const getServiceColor = (service) => {
    if (service.includes("Premier")) return { bg: "#FFF8F0", border: "#FFB84D", text: "#92400E" };
    return { bg: "#F0F7FF", border: "#0066CC", text: "#003366" };
  };

  const getTypeIcon = (type) => {
    if (type.includes("Luxury")) return "✨";
    if (type.includes("Sleeper")) return "🛏️";
    return "💺";
  };

  return (
    <div style={styles.page}>
      {/* Header */}
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
        {/* Hero */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>🚆 Train Schedules</h1>
          <p style={styles.heroSub}>
            Long-distance rail services connecting South Africa's major cities
          </p>
        </div>

        {/* Service Legend */}
        <div style={styles.legendRow}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: colors.primary.blue }} />
            <div>
              <div style={styles.legendName}>Shosholoza Meyl</div>
              <div style={styles.legendDesc}>Economy & Tourist Sleeper</div>
            </div>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: "#FFB84D" }} />
            <div>
              <div style={styles.legendName}>Premier Classe</div>
              <div style={styles.legendDesc}>Luxury Sleeper with meals</div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div style={styles.notice}>
          <strong>ℹ️ Demo Schedules</strong> — These schedules are for demonstration purposes.
          For actual train times and bookings, visit{" "}
          <a href="https://www.shosholozameyl.co.za" target="_blank" rel="noopener noreferrer" style={styles.noticeLink}>
            shosholozameyl.co.za
          </a>{" "}
          or call <strong>011 013 0231</strong>.
        </div>

        {/* Route Cards */}
        <div style={styles.routeList}>
          {ROUTES.map((route) => {
            const isExpanded = expandedRoute === route.id;
            return (
              <div key={route.id} style={styles.routeCard}>
                <div
                  style={styles.routeHeader}
                  onClick={() => toggleRoute(route.id)}
                  role="button"
                >
                  <div style={styles.routeMain}>
                    <h3 style={styles.routeName}>{route.name}</h3>
                    <p style={styles.routeVia}>via {route.via}</p>
                  </div>
                  <div style={styles.routeStats}>
                    <span style={styles.routeStat}>{route.distance} km</span>
                    <span style={styles.routeStatSep}>•</span>
                    <span style={styles.routeStat}>~{route.duration}h</span>
                    <span style={styles.routeStatSep}>•</span>
                    <span style={styles.routeStatPrice}>from R{Math.min(...route.trains.map(t => t.price))}</span>
                  </div>
                  <div style={{ ...styles.chevron, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▼</div>
                </div>

                {isExpanded && (
                  <div style={styles.timetable}>
                    <div style={styles.tableHeader}>
                      <span style={styles.thService}>Service</span>
                      <span style={styles.thCell}>Type</span>
                      <span style={styles.thCell}>Departs</span>
                      <span style={styles.thCell}>Arrives</span>
                      <span style={styles.thCell}>Frequency</span>
                      <span style={styles.thPrice}>Price (pp)</span>
                    </div>
                    {route.trains.map((train, i) => {
                      const sc = getServiceColor(train.service);
                      return (
                        <div key={i} style={{ ...styles.tableRow, background: i % 2 === 0 ? "#FAFAFA" : "white" }}>
                          <span style={styles.tdService}>
                            <span style={{ ...styles.serviceBadge, background: sc.bg, borderColor: sc.border, color: sc.text }}>
                              {train.service}
                            </span>
                          </span>
                          <span style={styles.tdCell}>{getTypeIcon(train.type)} {train.type}</span>
                          <span style={{ ...styles.tdCell, fontWeight: 600 }}>{train.departs}</span>
                          <span style={styles.tdCell}>{train.arrives}</span>
                          <span style={styles.tdCell}>{train.frequency}</span>
                          <span style={styles.tdPrice}>R{train.price}</span>
                        </div>
                      );
                    })}
                    <div style={styles.tableFooter}>
                      <button
                        style={styles.bookRouteBtn}
                        onClick={() => navigate("/long-distance")}
                      >
                        Book this route →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Commuter Section */}
        <div style={styles.commuterSection}>
          <h2 style={styles.sectionTitle}>🚇 Commuter / Metrorail Services</h2>
          <p style={styles.sectionDesc}>
            Daily metro services operate in Cape Town, Johannesburg, and Durban with trains running every 20-45 minutes.
            Commuter tickets are general seating — no reservations required.
          </p>
          <button style={styles.commuterBtn} onClick={() => navigate("/commuter")}>
            View Commuter Services →
          </button>
        </div>

        {/* Contact CTA */}
        <div style={styles.contactCta}>
          <p style={styles.contactText}>Need help planning your journey?</p>
          <button style={styles.contactBtn} onClick={() => navigate("/contact")}>
            Contact Us →
          </button>
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
  content: { maxWidth: "1100px", margin: "0 auto", padding: "clamp(1rem, 3vw, 2rem)" },
  hero: { textAlign: "center", marginBottom: spacing.xl },
  heroTitle: { fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, color: colors.neutral.black, margin: `0 0 ${spacing.sm}` },
  heroSub: { fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", color: colors.neutral.gray700, margin: 0 },
  legendRow: { display: "flex", justifyContent: "center", gap: "clamp(1.5rem, 4vw, 3rem)", marginBottom: spacing.lg, flexWrap: "wrap" },
  legendItem: { display: "flex", alignItems: "center", gap: "0.75rem" },
  legendDot: { width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0 },
  legendName: { fontSize: "0.9rem", fontWeight: 600, color: colors.neutral.black },
  legendDesc: { fontSize: "0.75rem", color: colors.neutral.gray700 },
  notice: { background: "#FFF9E6", border: "1px solid #F0D060", borderRadius: "12px", padding: "1rem 1.25rem", fontSize: "0.85rem", color: "#6B5900", marginBottom: spacing.xl, lineHeight: 1.6 },
  noticeLink: { color: colors.primary.blue, fontWeight: 600 },
  routeList: { display: "flex", flexDirection: "column", gap: "1rem", marginBottom: spacing.xl },
  routeCard: { background: "white", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #E8E4DE" },
  routeHeader: { display: "flex", alignItems: "center", padding: "clamp(1rem, 3vw, 1.25rem)", cursor: "pointer", gap: "1rem" },
  routeMain: { flex: 1 },
  routeName: { fontSize: "clamp(1rem, 3vw, 1.15rem)", fontWeight: 700, color: colors.neutral.black, margin: 0 },
  routeVia: { fontSize: "0.8rem", color: colors.neutral.gray700, margin: "4px 0 0" },
  routeStats: { display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: colors.neutral.gray700, flexShrink: 0, flexWrap: "wrap" },
  routeStat: { whiteSpace: "nowrap" },
  routeStatSep: { opacity: 0.4 },
  routeStatPrice: { fontWeight: 700, color: colors.primary.blue, whiteSpace: "nowrap" },
  chevron: { fontSize: "0.7rem", color: colors.neutral.gray500, transition: "transform 0.3s ease", flexShrink: 0 },
  timetable: { borderTop: "1px solid #F0EBE3", padding: "0" },
  tableHeader: { display: "flex", padding: "0.75rem clamp(1rem, 3vw, 1.25rem)", background: "#F8F6F3", fontSize: "0.7rem", fontWeight: 600, color: colors.neutral.gray700, textTransform: "uppercase", letterSpacing: "0.04em", gap: "0.5rem" },
  thService: { flex: 2, minWidth: "120px" },
  thCell: { flex: 1.5, minWidth: "80px" },
  thPrice: { flex: 1, minWidth: "70px", textAlign: "right" },
  tableRow: { display: "flex", padding: "0.75rem clamp(1rem, 3vw, 1.25rem)", fontSize: "0.85rem", alignItems: "center", gap: "0.5rem" },
  tdService: { flex: 2, minWidth: "120px" },
  serviceBadge: { display: "inline-block", fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", borderWidth: "1px", borderStyle: "solid" },
  tdCell: { flex: 1.5, minWidth: "80px", color: colors.neutral.gray900 },
  tdPrice: { flex: 1, minWidth: "70px", textAlign: "right", fontWeight: 700, color: colors.primary.blue, fontSize: "0.95rem" },
  tableFooter: { padding: "1rem clamp(1rem, 3vw, 1.25rem)", borderTop: "1px solid #F0EBE3", textAlign: "right" },
  bookRouteBtn: { background: colors.primary.blue, color: "white", border: "none", padding: "10px 24px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" },
  commuterSection: { background: "white", borderRadius: "14px", padding: "clamp(1.25rem, 3vw, 2rem)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #E8E4DE", marginBottom: spacing.xl, textAlign: "center" },
  sectionTitle: { fontSize: "clamp(1.25rem, 3vw, 1.5rem)", fontWeight: 700, color: colors.neutral.black, margin: `0 0 ${spacing.sm}` },
  sectionDesc: { fontSize: "0.9rem", color: colors.neutral.gray700, lineHeight: 1.6, margin: `0 0 ${spacing.lg}`, maxWidth: "600px", marginLeft: "auto", marginRight: "auto" },
  commuterBtn: { background: "#FF6B35", color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer" },
  contactCta: { textAlign: "center", padding: spacing.lg },
  contactText: { fontSize: "1rem", color: colors.neutral.gray700, margin: `0 0 ${spacing.md}` },
  contactBtn: { background: colors.primary.navy, color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer" },
};

export default TrainSchedules;
