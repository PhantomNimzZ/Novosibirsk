// client/src/pages/bookings/commuter/CommuterCity.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CityMapPreview from "../../../components/maps/CityMapPreview";
import QuickBookingForm from "../../../components/booking/QuickBookingForm";
import QRTicket from "../../../components/booking/QRTicket";
import {
  getAllStations,
  areOnSameLine,
  getRoute,
  findTransferRoute,
  calculateRouteInfo,
} from "../../../constants/metroLines";
import { API_BASE } from "../../../api/config";
import { colors, typography, spacing } from "../../../styles/tokens";

const CommuterCity = () => {
  const { cityId } = useParams();

  const allStations = getAllStations(cityId);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routeValidation, setRouteValidation] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Validate route whenever stations change
  useEffect(() => {
    if (!from || !to || from === to) {
      setRouteValidation(null);
      setSelectedRoute(null);
      return;
    }

    const validation = areOnSameLine(cityId, from, to);

    if (validation.isDirectRoute) {
      // Direct route on same line
      const lineName = validation.sharedLines[0];
      const route = getRoute(cityId, from, to, lineName);
      const routeInfo = calculateRouteInfo(route);

      setRouteValidation({
        valid: true,
        type: "direct",
        lineName,
        route,
        ...routeInfo,
      });
      setSelectedRoute(route);
    } else {
      // Try to find transfer route
      const transferRoute = findTransferRoute(cityId, from, to);

      if (transferRoute) {
        // Calculate total stops and fare
        const leg1Info = calculateRouteInfo(transferRoute.legs[0].stations);
        const leg2Info = calculateRouteInfo(transferRoute.legs[1].stations);
        const totalStops = leg1Info.stops + leg2Info.stops;
        const totalFare = Math.max(15, totalStops * 10);

        setRouteValidation({
          valid: true,
          type: "transfer",
          ...transferRoute,
          stops: totalStops,
          fare: totalFare,
        });
        setSelectedRoute([...transferRoute.legs[0].stations, ...transferRoute.legs[1].stations.slice(1)]);
      } else {
        // No route found
        setRouteValidation({
          valid: false,
          type: "none",
          fromLines: validation.station1Lines,
          toLines: validation.station2Lines,
        });
        setSelectedRoute(null);
      }
    }
  }, [from, to, cityId]);

  // Find a train that serves this route
  const findMatchingTrain = async (fromStation, toStation, dateStr) => {
    try {
      const response = await fetch(`${API_BASE}/api/trains`);
      if (!response.ok) return null;
      
      const allTrains = await response.json();
      
      // Find metro trains that include both stations on their line
      const matching = allTrains.filter(train => {
        if (!train.trainName?.includes("Metro Rail")) return false;
        
        try {
          const stops = JSON.parse(train.intermediateStops || "[]");
          const fromIndex = stops.indexOf(fromStation);
          const toIndex = stops.indexOf(toStation);
          // Both stations must be on this line (either direction)
          return fromIndex !== -1 && toIndex !== -1;
        } catch {
          return train.from === fromStation && train.to === toStation;
        }
      }).filter(train => 
        new Date(train.date).toISOString().split('T')[0] === dateStr
      );
      
      return matching.length > 0 ? matching[0] : null;
    } catch (error) {
      console.error("Error finding train:", error);
      return null;
    }
  };

  const handleBooking = async (formData) => {
    try {
      // Block transfer routes with helpful guidance
      if (routeValidation.type === "transfer") {
        alert(
          "⚠️ TRANSFER REQUIRED\n\n" +
          "This route requires a transfer and must be booked as two separate journeys:\n\n" +
          `📍 Leg 1: ${routeValidation.legs[0].from} → ${routeValidation.legs[0].to}\n` +
          `   Line: ${routeValidation.legs[0].line}\n\n` +
          `📍 Leg 2: ${routeValidation.legs[1].from} → ${routeValidation.legs[1].to}\n` +
          `   Line: ${routeValidation.legs[1].line}\n\n` +
          "💡 TIP: Book the first leg now, then book the second leg separately.\n\n" +
          `Total estimated fare: R${routeValidation.fare}`
        );
        return; // Don't proceed with booking
      }

      // Find a matching train before creating booking
      const dateStr = new Date().toISOString().split('T')[0];
      const matchingTrain = await findMatchingTrain(formData.from, formData.to, dateStr);
      
      if (!matchingTrain) {
        alert("No trains available for this route today. Please try again later or contact support.");
        return;
      }

      const bookingPayload = {
        passengerName: formData.name,
        email: "commuter@prasa.co.za",
        idNumber: "N/A",
        trainNumber: matchingTrain.trainNumber,
        departure: matchingTrain.from,
        destination: matchingTrain.to,
        date: matchingTrain.date,
        time: matchingTrain.time,
        seat: "General Seating",
        price: formData.fare,
        trainId: matchingTrain.id,
      };

      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Booking failed");
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
        trainNumber: matchingTrain.trainNumber,
        time: matchingTrain.time,
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
    setRouteValidation(null);
    setSelectedRoute(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadTicket = () => {
    const ticketText = `
PRASA Commuter Ticket
─────────────────────
Ticket #${bookingData.id}
Passenger: ${bookingData.name}
Route: ${bookingData.from} → ${bookingData.to}
Train: ${bookingData.trainNumber}
Departure: ${bookingData.time || 'Any'}
Fare: R${bookingData.fare}
Valid: Today
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
                <option value="">-- Select Origin --</option>
                {allStations.map((s) => (
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
                <option value="">-- Select Destination --</option>
                {allStations.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Route Validation Messages */}
          {routeValidation && (
            <>
              {routeValidation.valid && routeValidation.type === "direct" && (
                <div style={styles.routeInfo}>
                  <div style={styles.routeIcon}>✓</div>
                  <div style={styles.routeDetails}>
                    <div style={styles.routeTitle}>Direct Route Available</div>
                    <div style={styles.routeMetaLine}>
                      🚆 <strong>{routeValidation.lineName}</strong>
                    </div>
                    <div style={styles.routeMeta}>
                      {from} → {routeValidation.route.slice(1, -1).join(" → ")} → {to}
                    </div>
                    <div style={styles.routeStats}>
                      <span>{routeValidation.stops} stops</span>
                      <span style={styles.statSeparator}>•</span>
                      <span>~{routeValidation.stops * 5} minutes</span>
                      <span style={styles.statSeparator}>•</span>
                      <span style={styles.fareHighlight}>R{routeValidation.fare}</span>
                    </div>
                  </div>
                </div>
              )}

              {routeValidation.valid && routeValidation.type === "transfer" && (
                <div style={{...styles.routeInfo, ...styles.routeInfoTransfer}}>
                  <div style={styles.routeIcon}>⚠️</div>
                  <div style={styles.routeDetails}>
                    <div style={styles.routeTitle}>Transfer Required</div>
                    <div style={styles.transferLegs}>
                      <div style={styles.transferLeg}>
                        <span style={styles.transferLegNumber}>1</span>
                        <strong>{routeValidation.legs[0].line}</strong>
                        <div style={styles.transferLegRoute}>
                          {routeValidation.legs[0].from} → {routeValidation.legs[0].to}
                        </div>
                      </div>
                      <div style={styles.transferArrow}>↓ Transfer at {routeValidation.legs[1].from}</div>
                      <div style={styles.transferLeg}>
                        <span style={styles.transferLegNumber}>2</span>
                        <strong>{routeValidation.legs[1].line}</strong>
                        <div style={styles.transferLegRoute}>
                          {routeValidation.legs[1].from} → {routeValidation.legs[1].to}
                        </div>
                      </div>
                    </div>
                    <div style={styles.routeStats}>
                      <span>{routeValidation.stops} total stops</span>
                      <span style={styles.statSeparator}>•</span>
                      <span>~{routeValidation.stops * 5 + 10} minutes (inc. transfer)</span>
                      <span style={styles.statSeparator}>•</span>
                      <span style={styles.fareHighlight}>R{routeValidation.fare}</span>
                    </div>
                    <div style={styles.transferNotice}>
                      ℹ️ Transfer routes require two separate bookings. Click "Book Now" for guidance.
                    </div>
                  </div>
                </div>
              )}

              {!routeValidation.valid && (
                <div style={{...styles.routeInfo, ...styles.routeInfoError}}>
                  <div style={styles.routeIcon}>✕</div>
                  <div style={styles.routeDetails}>
                    <div style={styles.routeTitle}>No Direct Route</div>
                    <div style={styles.errorText}>
                      <strong>{from}</strong> ({routeValidation.fromLines.join(", ")}) and{" "}
                      <strong>{to}</strong> ({routeValidation.toLines.join(", ")}) are not connected.
                    </div>
                    <div style={styles.errorSuggestion}>
                      Please choose stations on the same line or a route with a transfer point.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Map - Only show when route is valid */}
          {routeValidation?.valid && selectedRoute && (
            <div style={styles.mapContainer}>
              <CityMapPreview 
                cityId={cityId} 
                from={from} 
                to={to} 
                routeInfo={routeValidation}
              />
            </div>
          )}

          {/* Quick Booking Form - Only show when route is valid */}
          {routeValidation?.valid && (
            <QuickBookingForm
              route={{ from, to }}
              fare={routeValidation.fare}
              onSubmit={handleBooking}
            />
          )}

          {/* Service Info */}
          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>ℹ️</div>
            <div>
              <strong>Service Info:</strong>
              <ul style={styles.infoList}>
                <li>Trains run every 20-45 minutes</li>
                <li>Tickets valid for today only</li>
                <li>General seating (no reservations)</li>
                <li>Show QR code at platform entrance</li>
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
    padding: 'clamp(0.75rem, 2vw, 1.5rem)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    padding: '0 0.5rem',
  },
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 1.875rem)',
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.xs} 0`,
  },
  subtitle: {
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
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
    maxWidth: '600px',
    margin: '0 auto',
  },
  stationSelector: {
    background: colors.neutral.white,
    borderRadius: '16px',
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
    fontWeight: typography.weight.semibold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.md} 0`,
  },
  selectField: {
    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
  },
  label: {
    display: 'block',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    fontWeight: typography.weight.medium,
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  select: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 1rem)',
    border: `2px solid ${colors.neutral.gray300}`,
    borderRadius: '8px',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    fontFamily: typography.fontFamily.body,
    minHeight: '44px',
    touchAction: 'manipulation',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    paddingRight: '2.5rem',
  },
  routeInfo: {
    display: 'flex',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    padding: 'clamp(1rem, 3vw, 1.25rem)',
    background: colors.semantic.success + '15',
    border: `2px solid ${colors.semantic.success}`,
    borderRadius: '12px',
  },
  routeInfoTransfer: {
    background: colors.semantic.warning + '15',
    border: `2px solid ${colors.semantic.warning}`,
  },
  routeInfoError: {
    background: colors.semantic.error + '15',
    border: `2px solid ${colors.semantic.error}`,
  },
  routeIcon: {
    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
    flexShrink: 0,
  },
  routeDetails: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 'clamp(1rem, 3vw, 1.125rem)',
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
    color: colors.neutral.black,
  },
  routeMetaLine: {
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    marginBottom: spacing.xs,
    color: colors.neutral.gray900,
  },
  routeMeta: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.neutral.gray700,
    marginBottom: spacing.sm,
  },
  routeStats: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.neutral.gray700,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  statSeparator: {
    opacity: 0.5,
  },
  fareHighlight: {
    fontWeight: typography.weight.bold,
    color: colors.primary.blue,
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
  },
  transferLegs: {
    marginBottom: spacing.sm,
  },
  transferLeg: {
    padding: `${spacing.sm} 0`,
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
  },
  transferLegNumber: {
    display: 'inline-block',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: colors.primary.blue,
    color: colors.neutral.white,
    textAlign: 'center',
    lineHeight: '24px',
    marginRight: spacing.sm,
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontWeight: typography.weight.bold,
  },
  transferLegRoute: {
    marginLeft: '36px',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.neutral.gray700,
  },
  transferArrow: {
    marginLeft: '36px',
    color: colors.neutral.gray700,
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontWeight: typography.weight.semibold,
  },
  transferNotice: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    background: colors.semantic.warning + '20',
    borderRadius: '8px',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.neutral.gray900,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    color: colors.neutral.gray900,
    marginBottom: spacing.sm,
  },
  errorSuggestion: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.neutral.gray700,
    fontStyle: 'italic',
  },
  mapContainer: {
    background: colors.neutral.white,
    borderRadius: '16px',
    padding: 'clamp(0.5rem, 2vw, 1rem)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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
    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
    flexShrink: 0,
  },
  infoList: {
    margin: `${spacing.xs} 0 0 0`,
    paddingLeft: 'clamp(1rem, 3vw, 1.25rem)',
    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
    color: colors.neutral.gray900,
    lineHeight: 1.6,
  },
};

export default CommuterCity;
