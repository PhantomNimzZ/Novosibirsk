// client/src/pages/info/ContactUs.jsx
import { useNavigate } from "react-router-dom";
import { colors, typography, spacing } from "../../styles/tokens";

const ContactUs = () => {
  const navigate = useNavigate();

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
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>📞 Contact Us</h1>
          <p style={styles.heroSub}>Get in touch with PRASA for bookings, enquiries, and support</p>
        </div>

        <div style={styles.grid}>
          {/* General Enquiries */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>🏢</div>
            <h3 style={styles.cardTitle}>Head Office</h3>
            <div style={styles.cardBody}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Address</span>
                <span style={styles.infoValue}>PRASA House, 1040 Burnett Street, Hatfield, Pretoria, 0083</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Phone</span>
                <a href="tel:+27110136700" style={styles.infoLink}>+27 11 013 6700</a>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email</span>
                <a href="mailto:info@prasa.com" style={styles.infoLink}>info@prasa.com</a>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>🎫</div>
            <h3 style={styles.cardTitle}>Shosholoza Meyl Bookings</h3>
            <div style={styles.cardBody}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Call Centre</span>
                <a href="tel:+27110130231" style={styles.infoLink}>011 013 0231/2/3</a>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Toll Free</span>
                <a href="tel:0801229091" style={styles.infoLink}>080 122 9091</a>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>WhatsApp</span>
                <a href="https://wa.me/27605672272" style={styles.infoLink} target="_blank" rel="noopener noreferrer">060 567 2272</a>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Website</span>
                <a href="https://www.shosholozameyl.co.za" style={styles.infoLink} target="_blank" rel="noopener noreferrer">shosholozameyl.co.za</a>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>🛟</div>
            <h3 style={styles.cardTitle}>Customer Support</h3>
            <div style={styles.cardBody}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>PRASA Call Centre</span>
                <a href="tel:+27877432120" style={styles.infoLink}>087 743 2120</a>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Services</span>
                <span style={styles.infoValue}>Metrorail, Shosholoza Meyl, City to City, Translux, Premier Classe</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Hours</span>
                <span style={styles.infoValue}>Mon–Fri: 06:00 – 20:00, Sat: 07:00 – 14:00</span>
              </div>
            </div>
          </div>

          {/* Emergency */}
          <div style={{ ...styles.card, borderColor: "#DC3545" }}>
            <div style={styles.cardIcon}>🚨</div>
            <h3 style={styles.cardTitle}>Safety & Emergencies</h3>
            <div style={styles.cardBody}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Emergency</span>
                <a href="tel:0218187234" style={{ ...styles.infoLink, color: "#DC3545", fontWeight: 700 }}>021 818 7234/35</a>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Report</span>
                <span style={styles.infoValue}>Report suspicious activity, vandalism, or safety concerns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div style={styles.socialSection}>
          <h3 style={styles.socialTitle}>Follow PRASA</h3>
          <div style={styles.socialRow}>
            <a href="https://www.facebook.com/PRASAGroup" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Facebook</a>
            <a href="https://twitter.com/ABOREKENG" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>X (Twitter)</a>
            <a href="https://www.instagram.com/praborekeng" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Instagram</a>
            <a href="https://www.linkedin.com/company/prasa" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>LinkedIn</a>
          </div>
        </div>

        {/* Demo Notice */}
        <div style={styles.demoNotice}>
          <strong>ℹ️ Demo Application</strong> — This is a demonstration booking system.
          For real PRASA services, please visit{" "}
          <a href="https://www.prasa.com" target="_blank" rel="noopener noreferrer" style={styles.demoLink}>www.prasa.com</a>
        </div>

        {/* Quick Links */}
        <div style={styles.quickLinks}>
          <button style={styles.quickLink} onClick={() => navigate("/long-distance")}>Book Long-Distance →</button>
          <button style={styles.quickLink} onClick={() => navigate("/commuter")}>Book Commuter →</button>
          <button style={styles.quickLink} onClick={() => navigate("/schedules")}>View Schedules →</button>
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
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))", gap: "1.25rem", marginBottom: spacing.xl },
  card: { background: "white", borderRadius: "14px", padding: "clamp(1.25rem, 3vw, 1.75rem)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderWidth: "1px", borderStyle: "solid", borderColor: "#E8E4DE" },
  cardIcon: { fontSize: "2rem", marginBottom: spacing.sm },
  cardTitle: { fontSize: "1.15rem", fontWeight: 700, color: colors.neutral.black, margin: `0 0 ${spacing.md}` },
  cardBody: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  infoRow: { display: "flex", gap: "1rem", fontSize: "0.9rem", alignItems: "flex-start" },
  infoLabel: { fontWeight: 600, color: colors.neutral.gray700, minWidth: "100px", flexShrink: 0 },
  infoValue: { color: colors.neutral.gray900, lineHeight: 1.5 },
  infoLink: { color: colors.primary.blue, textDecoration: "none", fontWeight: 600, lineHeight: 1.5 },
  socialSection: { textAlign: "center", marginBottom: spacing.xl },
  socialTitle: { fontSize: "1.1rem", fontWeight: 700, color: colors.neutral.black, marginBottom: spacing.md },
  socialRow: { display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" },
  socialLink: { padding: "10px 20px", background: "white", borderRadius: "10px", color: colors.primary.blue, textDecoration: "none", fontWeight: 600, fontSize: "0.9rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderWidth: "1px", borderStyle: "solid", borderColor: "#E8E4DE" },
  demoNotice: { background: "#FFF9E6", borderWidth: "1px", borderStyle: "solid", borderColor: "#F0D060", borderRadius: "12px", padding: "1rem 1.25rem", fontSize: "0.85rem", color: "#6B5900", marginBottom: spacing.xl, lineHeight: 1.6, textAlign: "center" },
  demoLink: { color: colors.primary.blue, fontWeight: 600 },
  quickLinks: { display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", paddingBottom: spacing.xl },
  quickLink: { padding: "12px 24px", background: colors.primary.blue, color: "white", border: "none", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" },
};

export default ContactUs;
