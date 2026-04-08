// client/src/pages/info/FAQ.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { colors, typography, spacing } from "../../styles/tokens";

const FAQS = [
  {
    category: "Booking & Tickets",
    items: [
      {
        q: "How do I book a long-distance train ticket?",
        a: "You can book online through this platform by selecting your route, choosing a date and time, picking your preferred train class, and completing payment. Alternatively, call the Shosholoza Meyl booking centre at 011 013 0231/2/3 or visit your nearest ticket office.",
      },
      {
        q: "Can I book a return ticket?",
        a: "Currently, tickets are sold as single journeys. To travel return, simply book two separate tickets — one for each direction.",
      },
      {
        q: "How far in advance can I book?",
        a: "Long-distance train tickets can be booked up to 90 days in advance. Commuter tickets are valid for same-day travel only.",
      },
      {
        q: "Can I cancel or change my booking?",
        a: "Cancellations can be made up to 24 hours before departure for a full refund. Changes to date or time are subject to availability. Contact the booking centre or visit the admin portal for assistance.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept Visa, Mastercard, and mobile payments for online bookings. Cash payments are accepted at station ticket offices. Commuter tickets can also be purchased with cash at the station.",
      },
    ],
  },
  {
    category: "Train Services",
    items: [
      {
        q: "What is the difference between Shosholoza Meyl and Premier Classe?",
        a: "Shosholoza Meyl offers Economy (seated) and Tourist Sleeper classes at affordable prices. Premier Classe is a luxury sleeper service with private compartments, all meals included, complimentary tea and coffee, and access to a lounge car.",
      },
      {
        q: "What routes are available?",
        a: "Long-distance services connect Cape Town, Johannesburg, Pretoria, Durban, Port Elizabeth, East London, and Bloemfontein via various intermediate stops. Commuter Metrorail services operate within Cape Town, Johannesburg, and Durban.",
      },
      {
        q: "Are trains wheelchair accessible?",
        a: "PRASA is working to improve accessibility across the network. Please contact the booking centre in advance to arrange assistance at stations and on board.",
      },
      {
        q: "Is there WiFi on the trains?",
        a: "WiFi is not currently available on Shosholoza Meyl or Metrorail services. Premier Classe trains offer limited connectivity. We recommend downloading entertainment before your journey.",
      },
      {
        q: "Can I bring luggage on the train?",
        a: "Yes. Economy class passengers may bring up to 50kg of luggage. Tourist Sleeper and Premier Classe passengers may bring up to 75kg. Luggage must be stored in designated areas or your compartment.",
      },
    ],
  },
  {
    category: "Commuter / Metrorail",
    items: [
      {
        q: "Do I need to reserve a seat for commuter trains?",
        a: "No. Commuter Metrorail services use general seating — no reservations are required. Simply purchase your ticket and board the next available train.",
      },
      {
        q: "How often do commuter trains run?",
        a: "Metrorail trains typically run every 20-45 minutes during peak hours and every 60 minutes during off-peak times. Schedules vary by city and line.",
      },
      {
        q: "How much does a commuter ticket cost?",
        a: "Commuter fares are calculated by the number of stops travelled, starting from R10. A typical 3-5 stop journey costs R20-R40.",
      },
    ],
  },
  {
    category: "Safety & Policies",
    items: [
      {
        q: "Is it safe to travel by train in South Africa?",
        a: "PRASA has invested significantly in security improvements across the network. Security personnel are present at major stations and on trains. We recommend travelling during daylight hours and keeping valuables secure.",
      },
      {
        q: "What should I do in an emergency?",
        a: "Contact on-board staff immediately or call the PRASA emergency line at 021 818 7234/35. Emergency exits are clearly marked on all coaches.",
      },
      {
        q: "What is PRASA's refund policy?",
        a: "Full refunds are available for cancellations made at least 24 hours before departure. Cancellations within 24 hours may incur a 25% fee. No-shows are non-refundable. Refunds are processed within 7-14 business days.",
      },
    ],
  },
];

const FAQ = () => {
  const navigate = useNavigate();
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (key) => {
    setOpenItem(openItem === key ? null : key);
  };

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
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Frequently Asked Questions</h1>
          <p style={styles.heroSub}>Everything you need to know about travelling with PRASA</p>
        </div>

        {FAQS.map((section, si) => (
          <div key={si} style={styles.section}>
            <h2 style={styles.sectionTitle}>{section.category}</h2>
            <div style={styles.itemList}>
              {section.items.map((item, ii) => {
                const key = `${si}-${ii}`;
                const isOpen = openItem === key;
                return (
                  <div key={key} style={styles.item}>
                    <button
                      onClick={() => toggleItem(key)}
                      style={styles.question}
                    >
                      <span style={styles.questionText}>{item.q}</span>
                      <span style={{
                        ...styles.chevron,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}>▼</span>
                    </button>
                    {isOpen && (
                      <div style={styles.answer}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div style={styles.contactCta}>
          <p style={styles.contactText}>Can't find what you're looking for?</p>
          <div style={styles.contactBtns}>
            <button style={styles.ctaBtn} onClick={() => navigate("/contact")}>Contact Us</button>
            <button style={{ ...styles.ctaBtn, background: colors.primary.navy }} onClick={() => navigate("/schedules")}>View Schedules</button>
          </div>
        </div>

        {/* Demo Notice */}
        <div style={styles.demoNotice}>
          This is a demonstration application. For official PRASA information, visit{" "}
          <a href="https://www.prasa.com" target="_blank" rel="noopener noreferrer" style={styles.demoLink}>www.prasa.com</a>
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
  content: { maxWidth: "800px", margin: "0 auto", padding: "clamp(1rem, 3vw, 2rem)" },
  hero: { textAlign: "center", marginBottom: spacing.xl },
  heroTitle: { fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, color: colors.neutral.black, margin: `0 0 ${spacing.sm}` },
  heroSub: { fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", color: colors.neutral.gray700, margin: 0 },
  section: { marginBottom: "2rem" },
  sectionTitle: { fontSize: "1.15rem", fontWeight: 700, color: colors.primary.navy, margin: "0 0 0.75rem", paddingBottom: "0.5rem", borderBottomWidth: "2px", borderBottomStyle: "solid", borderBottomColor: colors.primary.pale },
  itemList: { display: "flex", flexDirection: "column", gap: "0" },
  item: { background: "white", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "#E8E4DE" },
  question: {
    width: "100%",
    padding: "1rem 1.25rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    textAlign: "left",
    fontFamily: typography.fontFamily.body,
  },
  questionText: { fontSize: "0.95rem", fontWeight: 600, color: colors.neutral.black, lineHeight: 1.4 },
  chevron: { fontSize: "0.65rem", color: colors.neutral.gray500, transition: "transform 0.3s ease", flexShrink: 0 },
  answer: { padding: "0 1.25rem 1.25rem", fontSize: "0.9rem", color: colors.neutral.gray700, lineHeight: 1.7 },
  contactCta: { textAlign: "center", padding: "2rem 0" },
  contactText: { fontSize: "1rem", color: colors.neutral.gray700, margin: `0 0 ${spacing.md}` },
  contactBtns: { display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" },
  ctaBtn: { padding: "12px 28px", background: colors.primary.blue, color: "white", border: "none", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer" },
  demoNotice: { fontSize: "0.8rem", color: colors.neutral.gray500, textAlign: "center", padding: "1rem 0 2rem", lineHeight: 1.6 },
  demoLink: { color: colors.primary.blue, fontWeight: 600 },
};

export default FAQ;
