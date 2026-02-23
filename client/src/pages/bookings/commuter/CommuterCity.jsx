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
    
    return Math.max(15, stops * 10);
  };

  const currentFare = calculateFare(from, to);

  const handleBooking = async (formData) => {
    try {
      const bookingPayload = {
        passengerName: formData.name,
        email: "commuter@prasa.co.za",
        idNumber: "N/A",
        trainNumber: `Commuter-${cityId}`,
        departure: formData.from,
        destination: formData.to,
        date: new Date().toISOString(),
        time: "Any",
        seat: "General Seating",
        price: formData.fare,
        paymentStatus: formData.payment === "mobile" ? "Pending" : "Cash",
        status: "Active",
        trainId: 1,
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Booking error:", error);
      throw error;
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
        // Booking View - Mobile-First Layout
        <div style={styles.contentWrapper}>
          {/* Station Selection Card */}
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

          {/* Map - Collapsible on Mobile */}
          {from && to && from !== to && (
            <div style={styles.mapContainer}>
              <CityMapPreview cityId={cityId} />
            </div>
          )}

          {/* Quick Booking Form */}
          {from && to && from !== to && (
            <QuickBookingForm
              route={{ from, to }}
              fare={currentFare}
              onSubmit={handleBooking}
            />
          )}

          {/* Service Info */}
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
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: colors.neutral.gray100,
    padding: 'clamp(0.75rem, 2vw, 1.5rem)', // Responsive padding
  },
  header: {
    textAlign: 'center',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    padding: '0 0.5rem',
  },
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 1.875rem)', // Responsive
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.xs} 0`,
  },
  subtitle: {
    fontSize: 'clamp(0.875rem, 3vw, 1rem)', // Responsive
    color: colors.neutral.gray700,
    margin: 0,
  },
  successContainer: {
    paddingTop: 'clamp(1rem, 3vw, 2rem)',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(1rem, 3vw, 1.5rem)',
    maxWidth: '600px', // Constrain width on larger screens
    margin: '0 auto',
  },
  stationSelector: {
    background: colors.neutral.white,
    borderRadius: '16px',
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 'clamp(1.125rem, 4vw, 1.25rem)', // Responsive
    fontWeight: typography.weight.semibold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.md} 0`,
  },
  selectField: {
    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
  },
  label: {
    display: 'block',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', // Responsive
    fontWeight: typography.weight.medium,
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  select: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 1rem)', // Touch-friendly padding
    border: `2px solid ${colors.neutral.gray300}`,
    borderRadius: '8px',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', // Responsive, min 14px for iOS
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    fontFamily: typography.fontFamily.body,
    minHeight: '44px', // Touch-friendly
    touchAction: 'manipulation',
    appearance: 'none', // Remove default arrow
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    paddingRight: '2.5rem', // Space for arrow
  },
  fareDisplay: {
    marginTop: 'clamp(0.75rem, 2vw, 1rem)',
    padding: 'clamp(0.75rem, 3vw, 1rem)',
    background: colors.primary.pale,
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: `2px solid ${colors.primary.blue}`,
  },
  fareLabel: {
    fontSize: 'clamp(1rem, 3vw, 1.125rem)', // Responsive
    fontWeight: typography.weight.medium,
    color: colors.neutral.black,
  },
  fareValue: {
    fontSize: 'clamp(1.5rem, 5vw, 1.875rem)', // Responsive
    fontWeight: typography.weight.bold,
    color: colors.primary.blue,
  },
  mapContainer: {
    background: colors.neutral.white,
    borderRadius: '16px',
    padding: 'clamp(0.5rem, 2vw, 1rem)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxHeight: '300px', // Limit height on mobile
    overflow: 'hidden',
  },
  infoCard: {
    display: 'flex',
    gap: 'clamp(0.5rem, 2vw, 0.75rem)',
    padding: 'clamp(0.75rem, 3vw, 1rem)',
    background: colors.primary.pale,
    border: `1px solid ${colors.primary.blue}`,
    borderRadius: '12px',
  },
  infoIcon: {
    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', // Responsive
    flexShrink: 0,
  },
  infoList: {
    margin: `${spacing.xs} 0 0 0`,
    paddingLeft: 'clamp(1rem, 3vw, 1.25rem)',
    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', // Responsive
    color: colors.neutral.gray900,
    lineHeight: 1.6,
  },
};

export default CommuterCity;
