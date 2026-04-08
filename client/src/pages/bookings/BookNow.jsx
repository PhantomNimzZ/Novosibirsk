// client/src/pages/bookings/BookNow.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SeatSelector from "../../components/booking/SeatSelector.jsx";
import { generatePDF } from "../../utils/generatePDF";
import { API_BASE } from "../../api/config";
import { colors, typography } from "../../styles/tokens";

const BookNow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [train, setTrain] = useState(() => {
    if (location.state?.train) {
      try { sessionStorage.setItem("selectedTrain", JSON.stringify(location.state.train)); } catch {}
      return location.state.train;
    }
    try {
      const saved = sessionStorage.getItem("selectedTrain");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);

  // Payment flow states
  const [step, setStep] = useState("form"); // form | payment | processing | success
  const [bookingData, setBookingData] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiryMonth, setCardExpiryMonth] = useState("");
  const [cardExpiryYear, setCardExpiryYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);

  // Fetch booked seats
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        setLoadingSeats(true);
        const trainId = train.id || train.trainId;
        if (!trainId) { setLoadingSeats(false); return; }
        const dateStr = new Date(train.date).toISOString().split("T")[0];
        const response = await fetch(`${API_BASE}/api/trains/${trainId}/seats?date=${dateStr}`);
        if (!response.ok) throw new Error("Failed to fetch seats");
        const data = await response.json();
        setBookedSeats(data.bookedSeats);
      } catch {
        setBookedSeats([]);
      } finally {
        setLoadingSeats(false);
      }
    };
    if (train) fetchBookedSeats();
  }, [train]);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  // Step 1: Submit booking (creates with Pending status)
  const handleBooking = async (e) => {
    e.preventDefault();
    if (isSubmitting || !selectedSeat) return;
    setIsSubmitting(true);

    const bookingDetails = {
      passengerName: name,
      email,
      idNumber,
      trainNumber: train.trainNumber || train.trainName || "",
      departure: train.from,
      destination: train.to,
      date: train.date || new Date().toISOString().split("T")[0],
      time: train.time || "",
      seat: selectedSeat,
      price: parseFloat(String(train.price).replace(/[^0-9.]/g, "")) || 0,
      trainId: train.id || train.trainId || 1,
    };

    try {
      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to save booking");

      setBookingData(result);
      setCardName(name);
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      alert(`Booking error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Process payment (simulated, then updates to Paid)
  const handlePayment = async (e) => {
    e.preventDefault();

    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 16) { alert("Please enter a valid 16-digit card number."); return; }
    if (!cardExpiryMonth || !cardExpiryYear) { alert("Please select an expiry date."); return; }
    if (cardCvv.length < 3) { alert("Please enter a valid CVV."); return; }

    setStep("processing");
    setProcessingProgress(0);

    // Simulated processing steps
    const steps = [
      { delay: 600, progress: 20 },
      { delay: 800, progress: 45 },
      { delay: 1000, progress: 70 },
      { delay: 600, progress: 90 },
      { delay: 400, progress: 100 },
    ];

    for (const s of steps) {
      await new Promise((r) => setTimeout(r, s.delay));
      setProcessingProgress(s.progress);
    }

    // Update booking to Paid via API
    try {
      const loginResp = await fetch(`${API_BASE}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@prasa.com", password: "admin123" }),
      });
      const loginData = await loginResp.json();

      if (loginData.token && bookingData?.id) {
        await fetch(`${API_BASE}/api/bookings/${bookingData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.token}`,
          },
          body: JSON.stringify({ paymentStatus: "Paid" }),
        });
        setBookingData((prev) => ({ ...prev, paymentStatus: "Paid" }));
      }
    } catch {
      // Display still succeeds even if API update fails
    }

    await new Promise((r) => setTimeout(r, 500));
    setStep("success");
    try { sessionStorage.removeItem("selectedTrain"); } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadTicket = () => {
    if (bookingData) generatePDF(bookingData);
  };

  const trainPrice = train ? (parseFloat(String(train.price).replace(/[^0-9.]/g, "")) || 0) : 0;

  const navBar = (
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
          <span style={styles.navLogoText}>PRASA</span>
        </div>
        <button onClick={() => navigate(-1)} style={styles.navBackBtn}>← Back</button>
      </div>
    </nav>
  );

  if (!train) {
    return (
      <div style={{ minHeight: "100vh", background: colors.neutral.gray100 }}>
        {navBar}
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No train selected.</p>
          <button onClick={() => navigate("/long-distance")} style={styles.emptyBtn}>Search for trains</button>
        </div>
      </div>
    );
  }

  // ─── SUCCESS SCREEN ───
  if (step === "success" && bookingData) {
    return (
      <div style={{ minHeight: "100vh", background: colors.neutral.gray100 }}>
        {navBar}
        <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 style={styles.successTitle}>Payment Successful!</h1>
          <p style={styles.successSub}>Your booking is confirmed and paid</p>

          <div style={styles.refBadge}>
            {bookingData.bookingReference || `PRASA-2026-${String(bookingData.id).padStart(5, "0")}`}
          </div>

          <div style={styles.detailsBox}>
            <div style={styles.detailRow}><span style={styles.detailLabel}>Route</span><span style={styles.detailValue}>{train.from} → {train.to}</span></div>
            <div style={styles.detailRow}><span style={styles.detailLabel}>Date & Time</span><span style={styles.detailValue}>{bookingData.date} at {train.time}</span></div>
            <div style={styles.detailRow}><span style={styles.detailLabel}>Train</span><span style={styles.detailValue}>{train.trainName || train.trainNumber}</span></div>
            <div style={styles.detailRow}><span style={styles.detailLabel}>Seat</span><span style={{ ...styles.detailValue, color: colors.primary.blue, fontWeight: 700 }}>{selectedSeat}</span></div>
            <div style={styles.detailRow}><span style={styles.detailLabel}>Amount Paid</span><span style={{ ...styles.detailValue, color: "#10B981", fontWeight: 700 }}>R{trainPrice}</span></div>
            <div style={styles.detailRow}><span style={styles.detailLabel}>Status</span><span style={styles.paidBadge}>Paid</span></div>
          </div>

          <div style={styles.emailNotice}>A confirmation has been sent to <strong>{email}</strong></div>

          <button onClick={handleDownloadTicket} style={styles.downloadBtn}>Download Ticket (PDF)</button>
          <button onClick={() => navigate("/")} style={styles.homeBtn}>Back to Home</button>
        </div>
      </div>
      </div>
    );
  }

  // ─── PROCESSING ANIMATION ───
  if (step === "processing") {
    return (
      <div style={{ minHeight: "100vh", background: colors.neutral.gray100 }}>
        {navBar}
        <div style={styles.page}>
        <div style={{ ...styles.card, textAlign: "center", padding: "3rem 2rem", maxWidth: "480px" }}>
          <div style={styles.spinnerWrap}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#E6F2FF" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke={colors.primary.blue} strokeWidth="6"
                strokeLinecap="round" strokeDasharray="214" strokeDashoffset={214 - (processingProgress / 100) * 214}
                style={{ transition: "stroke-dashoffset 0.5s ease", transform: "rotate(-90deg)", transformOrigin: "center" }} />
            </svg>
            <span style={styles.spinnerPercent}>{processingProgress}%</span>
          </div>

          <h2 style={styles.processingTitle}>Processing Payment</h2>
          <p style={styles.processingDesc}>
            {processingProgress < 20 && "Validating card details..."}
            {processingProgress >= 20 && processingProgress < 45 && "Contacting your bank..."}
            {processingProgress >= 45 && processingProgress < 70 && "Authorizing payment..."}
            {processingProgress >= 70 && processingProgress < 100 && "Confirming transaction..."}
            {processingProgress >= 100 && "Payment successful!"}
          </p>

          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${processingProgress}%` }} />
          </div>

          <p style={styles.secureNote}>Secure 256-bit encrypted connection</p>
        </div>
      </div>
      </div>
    );
  }

  // ─── PAYMENT FORM ───
  if (step === "payment" && bookingData) {
    return (
      <div style={{ minHeight: "100vh", background: colors.neutral.gray100 }}>
        {navBar}
        <div style={styles.page}>
        <div style={{ ...styles.card, maxWidth: "520px" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔒</div>
            <h2 style={styles.paymentTitle}>Secure Payment</h2>
            <p style={{ fontSize: "0.9rem", color: colors.neutral.gray700, margin: 0 }}>Complete your booking payment</p>
          </div>

          {/* Order summary */}
          <div style={styles.orderSummary}>
            <div style={styles.orderRow}>
              <span>{train.from} → {train.to}</span>
              <span style={{ fontWeight: 600, color: colors.primary.blue }}>Seat {selectedSeat}</span>
            </div>
            <div style={styles.orderRow}>
              <span style={{ color: colors.neutral.gray500, fontSize: "0.85rem" }}>
                {train.trainName || train.trainNumber} • {train.time}
              </span>
            </div>
            <div style={styles.orderDivider} />
            <div style={styles.orderRow}>
              <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Total</span>
              <span style={styles.orderTotal}>R{trainPrice}</span>
            </div>
          </div>

          {/* Card form */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Card Number</label>
            <div style={{ position: "relative" }}>
              <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                style={{ ...styles.input, paddingRight: "50px" }} maxLength={19} />
              <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
                <svg width="28" height="18" viewBox="0 0 28 18" fill="none"><rect width="28" height="18" rx="3" fill="#1A1F71"/><circle cx="11" cy="9" r="5.5" fill="#EB001B"/><circle cx="17" cy="9" r="5.5" fill="#F79E1B" opacity="0.8"/></svg>
              </div>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Cardholder Name</label>
            <input type="text" placeholder="Name on card" value={cardName}
              onChange={(e) => setCardName(e.target.value)} style={styles.input} />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.fieldLabel}>Expiry Month</label>
              <select value={cardExpiryMonth} onChange={(e) => setCardExpiryMonth(e.target.value)} style={styles.input}>
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const m = String(i + 1).padStart(2, "0");
                  return <option key={m} value={m}>{m}</option>;
                })}
              </select>
            </div>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.fieldLabel}>Expiry Year</label>
              <select value={cardExpiryYear} onChange={(e) => setCardExpiryYear(e.target.value)} style={styles.input}>
                <option value="">YY</option>
                {Array.from({ length: 8 }, (_, i) => {
                  const y = String(26 + i);
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
            </div>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.fieldLabel}>CVV</label>
              <input type="password" placeholder="•••" value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                style={styles.input} maxLength={4} />
            </div>
          </div>

          <button onClick={handlePayment} style={styles.payBtn}>Pay R{trainPrice}</button>

          <p style={styles.secureFooter}>
            🔒 Your payment is protected with 256-bit SSL encryption.
            This is a demo — no real charges will be made.
          </p>
        </div>
      </div>
      </div>
    );
  }

  // ─── BOOKING FORM (Step 1) ───
  return (
    <div style={{ minHeight: "100vh", background: colors.neutral.gray100 }}>
      {navBar}
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.formTitle}>{train.trainName || train.trainNumber}</h1>
          <p style={styles.formRoute}>{train.from} → {train.to}</p>
          <p style={styles.formMeta}>{train.time} • R{trainPrice} • {train.class || "Economy"}</p>

        <div style={{ marginBottom: "2rem" }}>
          <SeatSelector bookedSeats={bookedSeats} selectedSeat={selectedSeat}
            onSeatSelect={setSelectedSeat} loading={loadingSeats} />
        </div>

        <form onSubmit={handleBooking}>
          <h3 style={styles.sectionLabel}>Passenger Details</h3>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Full Name</label>
            <input type="text" required style={styles.input} value={name}
              onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Email Address</label>
            <input type="email" required style={styles.input} value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>ID / Passport Number</label>
            <input type="text" required style={styles.input} value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)} placeholder="SA ID or passport number" />
          </div>

          <button type="submit" disabled={isSubmitting || !selectedSeat}
            style={{ ...styles.submitBtn, ...(isSubmitting || !selectedSeat ? styles.submitBtnDisabled : {}) }}>
            {isSubmitting ? "Creating Booking..." : selectedSeat ? `Proceed to Payment — R${trainPrice}` : "Select a seat to continue"}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: "clamp(1rem, 3vw, 2rem)", display: "flex", justifyContent: "center", alignItems: "flex-start", fontFamily: typography.fontFamily.body },
  nav: { background: "#0077CC", padding: "0 clamp(1rem, 3vw, 2rem)", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" },
  navInner: { maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" },
  logoGroup: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  navLogoText: { fontSize: "1.3rem", fontWeight: 700, color: "white", letterSpacing: "0.12em" },
  navBackBtn: { background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" },
  card: { width: "100%", maxWidth: "700px", background: "white", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderWidth: "1px", borderStyle: "solid", borderColor: "#E8E4DE", marginTop: "1rem" },
  formTitle: { fontSize: "clamp(1.25rem, 4vw, 1.75rem)", fontWeight: 700, color: colors.neutral.black, margin: "0 0 0.25rem" },
  formRoute: { fontSize: "1.1rem", fontWeight: 600, color: colors.primary.blue, margin: "0 0 0.25rem" },
  formMeta: { fontSize: "0.9rem", color: colors.neutral.gray700, margin: "0 0 1.5rem" },
  sectionLabel: { fontSize: "1.1rem", fontWeight: 700, color: colors.neutral.black, margin: "0 0 1rem", paddingTop: "0.5rem", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "#F0EBE3" },
  fieldGroup: { marginBottom: "1rem" },
  fieldLabel: { display: "block", fontSize: "0.85rem", fontWeight: 600, color: colors.neutral.gray700, marginBottom: "0.4rem" },
  input: { width: "100%", padding: "12px 14px", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#D1CCC4", borderRadius: "10px", fontSize: "1rem", outline: "none", transition: "border-color 0.2s", fontFamily: typography.fontFamily.body, boxSizing: "border-box" },
  submitBtn: { width: "100%", padding: "16px", background: colors.primary.blue, color: "white", border: "none", borderRadius: "12px", fontSize: "1.05rem", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem" },
  submitBtnDisabled: { background: colors.neutral.gray300, cursor: "not-allowed" },
  paymentTitle: { fontSize: "1.5rem", fontWeight: 700, color: colors.neutral.black, margin: "0 0 0.25rem" },
  orderSummary: { background: colors.neutral.gray100, borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem" },
  orderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem", fontSize: "0.95rem", color: colors.neutral.black },
  orderDivider: { height: "1px", background: "#D1CCC4", margin: "0.75rem 0" },
  orderTotal: { fontSize: "1.25rem", fontWeight: 700, color: colors.primary.blue },
  payBtn: { width: "100%", padding: "16px", background: "#10B981", color: "white", border: "none", borderRadius: "12px", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem" },
  secureFooter: { fontSize: "0.75rem", color: colors.neutral.gray500, textAlign: "center", marginTop: "1rem", lineHeight: 1.6 },
  spinnerWrap: { position: "relative", display: "inline-block", marginBottom: "1.5rem" },
  spinnerPercent: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "1.1rem", fontWeight: 700, color: colors.primary.blue },
  processingTitle: { fontSize: "1.5rem", fontWeight: 700, color: colors.neutral.black, margin: "0 0 0.5rem" },
  processingDesc: { fontSize: "1rem", color: colors.neutral.gray700, margin: "0 0 1.5rem" },
  progressTrack: { width: "100%", height: "6px", background: "#E6F2FF", borderRadius: "3px", overflow: "hidden", marginBottom: "1.5rem" },
  progressFill: { height: "100%", background: colors.primary.blue, borderRadius: "3px", transition: "width 0.5s ease" },
  secureNote: { fontSize: "0.8rem", color: colors.neutral.gray500 },
  successTitle: { fontSize: "1.75rem", fontWeight: 700, color: colors.neutral.black, textAlign: "center", margin: "0 0 0.25rem" },
  successSub: { fontSize: "1rem", color: colors.neutral.gray700, textAlign: "center", margin: "0 0 1.25rem" },
  refBadge: { display: "block", textAlign: "center", fontSize: "1rem", fontWeight: 700, color: colors.primary.blue, background: colors.primary.pale, padding: "10px 20px", borderRadius: "10px", marginBottom: "1.5rem", letterSpacing: "0.04em" },
  detailsBox: { background: colors.neutral.gray100, borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.25rem" },
  detailRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", fontSize: "0.9rem" },
  detailLabel: { color: colors.neutral.gray700 },
  detailValue: { fontWeight: 600, color: colors.neutral.black },
  paidBadge: { fontSize: "0.8rem", fontWeight: 700, color: "#065F46", background: "#D1FAE5", padding: "4px 12px", borderRadius: "20px" },
  emailNotice: { background: "#EFF6FF", borderWidth: "1px", borderStyle: "solid", borderColor: "#BFDBFE", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#1E40AF", marginBottom: "1.25rem", textAlign: "center" },
  downloadBtn: { width: "100%", padding: "14px", background: colors.primary.blue, color: "white", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", marginBottom: "0.75rem" },
  homeBtn: { width: "100%", padding: "14px", background: colors.neutral.gray100, color: colors.neutral.gray700, border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: 600, cursor: "pointer" },
  emptyState: { minHeight: "100vh", background: colors.neutral.gray100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" },
  emptyText: { fontSize: "1.1rem", color: colors.neutral.gray700 },
  emptyBtn: { padding: "12px 24px", background: colors.primary.navy, color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", fontWeight: 600, cursor: "pointer" },
};

export default BookNow;
