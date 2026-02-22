// client/src/pages/bookings/commuter/CommuterCity.jsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import CityMapPreview from "../../../components/maps/CityMapPreview";
import QuickBookingForm from "../../../components/booking/QuickBookingForm";
import QRTicket from "../../../components/booking/QRTicket";
import { stationCoordinatesByCity } from "../../../constants/stationCoordinates";
import { API_BASE } from "../../../api/config";
import { colors, typography, spacing } from "../../../styles/tokens";

const CommuterCity = () => {
  const { cityId } = useParams();

  const cityStations = stationCoordinatesByCity[cityId] || {};
  const stationNames = Object.keys(cityStations);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Calculate fare based on number of stops (R10 per stop, R15 minimum)
  const calculateFare = (fromStation, toStation) => {
    if (!fromStation || !toStation) return 15;
    
    const fromIndex = stationNames.indexOf(fromStation);
    const toIndex = stationNames.indexOf(toStation);
    const stops = Math.abs(toIndex - fromIndex);
    
    return Math.max(15, stops * 10); // Minimum R15, R10 per stop
  };

  const currentFare = calculateFare(from, to);

  const handleBooking = async (formData) => {
    try {
      const bookingPayload = {
        passengerName: formData.name,
        email: "commuter@prasa.co.za", // Default for commuter
        idNumber: "N/A", // Not required for commuter
        trainNumber: `Commuter-${cityId}`,
        departure: formData.from,
        destination: formData.to,
        date: new Date().toISOString(),
        time: "Any", // Commuter trains run frequently
        seat: "General Seating", // No assigned seats
        price: formData.fare,
        paymentStatus: formData.payment === "mobile" ? "Pending" : "Cash",
        status: "Active",
        trainId: 1, // Generic commuter train ID
      };

      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const result = await response.json();

      // Set booking data for ticket display
      setBookingData({
        id: result.id,
        name: formData.name,
        from: formData.from,
        to: formData.to,
        fare: formData.fare,
        payment: formData.payment,
        date: new Date().toISOString(),
      });

      setBookingComplete(true);
      
      // Scroll to ticket
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Booking error:", error);
      throw error; // Let the form component handle the error
    }
  };

  const handleBookAnother = () => {
    setBookingComplete(false);
    setBookingData(null);
    setFrom("");
    setTo("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadTicket = () => {
    // Simple ticket download (would generate proper QR code PDF in production)
    const ticketText = `
PRASA Commuter Ticket
─────────────────────
Ticket #${bookingData.id}
Passenger: ${bookingData.name}
Route: ${bookingData.from} → ${bookingData.to}
Fare: R${bookingData.fare}
Valid: Today, any departure
Payment: ${bookingData.payment === "mobile" ? "Mobile" : "Cash at Station"}
    `.trim();

    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PRASA-Commuter-Ticket-${bookingData.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const cityName = cityId.replace("-", " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🚉 {cityName} Metro</h1>
        <p style={styles.subtitle}>Quick commuter booking</p>
      </div>

      {bookingComplete && bookingData ? (
        // Success View - QR Ticket
        <div style={styles.successContainer}>
          <QRTicket
            booking={bookingData}
            onBookAnother={handleBookAnother}
            onDownload={handleDownloadTicket}
          />
        </div>
      ) : (
        // Booking View
        <div style={styles.contentGrid}>
          {/* Left Column: Station Selection + Form */}
          <div style={styles.leftColumn}>
            {/* Station Selectors */}
            <div style={styles.stationSelector}>
              <h3 style={styles.sectionTitle}>Select Stations</h3>
              
              <div style={styles.selectField}>
                <label style={styles.label}>From:</label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  style={styles.select}
                >
                  <option value="">-- Select Station --</option>
                  {stationNames.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={styles.selectField}>
                <label style={styles.label}>To:</label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  style={styles.select}
                >
                  <option value="">-- Select Station --</option>
                  {stationNames.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {from && to && from !== to && (
                <div style={styles.fareDisplay}>
                  <span style={styles.fareLabel}>Fare:</span>
                  <span style={styles.fareValue}>R{currentFare}</span>
                </div>
              )}
            </div>

            {/* Quick Booking Form (only shown when route selected) */}
            {from && to && from !== to && (
              <QuickBookingForm
                route={{ from, to }}
                fare={currentFare}
                onSubmit={handleBooking}
              />
            )}
          </div>

          {/* Right Column: Map */}
          <div style={styles.rightColumn}>
            <div style={styles.mapContainer}>
              <CityMapPreview cityId={cityId} />
            </div>
            
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>ℹ️</div>
              <div>
                <strong>Service Info:</strong>
                <ul style={styles.infoList}>
                  <li>Trains every 30 minutes</li>
                  <li>Valid for today only</li>
                  <li>General seating (no seat assignment)</li>
                  <li>Show ticket QR code at platform</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: colors.neutral.gray100,
    padding: spacing.xl,
  },
  header: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.scale['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.sm} 0`,
  },
  subtitle: {
    fontSize: typography.scale.base,
    color: colors.neutral.gray700,
    margin: 0,
  },
  successContainer: {
    paddingTop: spacing['2xl'],
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: spacing.xl,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xl,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  stationSelector: {
    background: colors.neutral.white,
    borderRadius: '16px',
    padding: spacing.xl,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: typography.scale.xl,
    fontWeight: typography.weight.semibold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.lg} 0`,
  },
  selectField: {
    marginBottom: spacing.md,
  },
  label: {
    display: 'block',
    fontSize: typography.scale.base,
    fontWeight: typography.weight.medium,
    color: colors.neutral.black,
    marginBottom: spacing.sm,
  },
  select: {
    width: '100%',
    padding: spacing.md,
    border: `2px solid ${colors.neutral.gray300}`,
    borderRadius: '8px',
    fontSize: typography.scale.base,
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    fontFamily: typography.fontFamily.body,
  },
  fareDisplay: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    background: colors.primary.pale,
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: `2px solid ${colors.primary.blue}`,
  },
  fareLabel: {
    fontSize: typography.scale.lg,
    fontWeight: typography.weight.medium,
    color: colors.neutral.black,
  },
  fareValue: {
    fontSize: typography.scale['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.primary.blue,
  },
  mapContainer: {
    background: colors.neutral.white,
    borderRadius: '16px',
    padding: spacing.md,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  infoCard: {
    display: 'flex',
    gap: spacing.md,
    padding: spacing.lg,
    background: colors.primary.pale,
    border: `1px solid ${colors.primary.blue}`,
    borderRadius: '12px',
  },
  infoIcon: {
    fontSize: typography.scale.xl,
    flexShrink: 0,
  },
  infoList: {
    margin: `${spacing.xs} 0 0 0`,
    paddingLeft: spacing.lg,
    fontSize: typography.scale.sm,
    color: colors.neutral.gray900,
    lineHeight: 1.6,
  },
};

export default CommuterCity;
