// client/src/components/booking/TrainResults.jsx
import { useState, useEffect } from "react";
import { colors, typography, spacing } from "../../styles/tokens";
import { API_BASE } from "../../api/config";

/**
 * Train Results Display (Uses Search API)
 * Shows available trains for the selected route, date, and time
 */
const TrainResults = ({ route, dateTime, onSelectTrain }) => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build search query parameters
        const params = new URLSearchParams({
          from: route.from,
          to: route.to,
          time: dateTime.time,
        });

        // Add date if provided (formatted as ISO string)
        if (dateTime.date) {
          const dateStr = new Date(dateTime.date).toISOString();
          params.append("date", dateStr);
        }

        console.log("🔍 Searching trains:", params.toString());

        // Call search API
        const response = await fetch(`${API_BASE}/api/search?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log(`✅ Found ${data.results} trains:`, data.trains);
        
        setTrains(data.trains);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching trains:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    // Only fetch if we have the required data
    if (route?.from && route?.to && dateTime?.time) {
      fetchTrains();
    } else {
      setLoading(false);
      setError("Missing route or date/time information");
    }
  }, [route, dateTime]);

  const getClassColor = (trainClass) => {
    switch (trainClass) {
      case 'Economy': return colors.semantic.info;
      case 'Business': return colors.primary.blue;
      case 'Luxury': return colors.accent.gold;
      default: return colors.neutral.gray700;
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner}>🚆</div>
          <p style={styles.loadingText}>Searching for trains...</p>
          <p style={styles.loadingSubtext}>
            {route.from} → {route.to} • {dateTime.label}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Search Failed</h3>
          <p style={styles.errorText}>{error}</p>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Available Trains</h2>
        <div style={styles.routeInfo}>
          <span>{route.from} → {route.to}</span>
          <span style={styles.separator}>•</span>
          <span>{new Date(dateTime.date).toLocaleDateString('en-ZA', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span style={styles.separator}>•</span>
          <span>{dateTime.label}</span>
        </div>
        <div style={styles.resultCount}>
          {trains.length} {trains.length === 1 ? 'train' : 'trains'} found
        </div>
      </div>

      {/* Train Cards */}
      {trains.length > 0 ? (
        <div style={styles.trainsGrid}>
          {trains.map((train) => {
            const isLowSeats = train.seats < 20;
            
            // Parse amenities
            const amenities = train.amenities ? train.amenities.split(", ") : [];
            
            return (
              <div
                key={train.id}
                style={styles.trainCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Class Badge */}
                <div style={{...styles.classBadge, background: getClassColor(train.class)}}>
                  {train.class}
                </div>

                {/* Train Header */}
                <div style={styles.trainHeader}>
                  <div>
                    <h3 style={styles.trainName}>{train.train}</h3>
                    <p style={styles.trainNumber}>{train.trainNumber}</p>
                  </div>
                  <div style={styles.trainIcon}>🚆</div>
                </div>

                {/* Distance & Duration */}
                {train.distance && train.duration && (
                  <div style={styles.metaInfo}>
                    <span>{train.distance} km</span>
                    <span style={styles.separator}>•</span>
                    <span>{train.duration}h journey</span>
                  </div>
                )}

                {/* Time Info */}
                <div style={styles.timeInfo}>
                  <div style={styles.timeBlock}>
                    <div style={styles.timeLabel}>Departure</div>
                    <div style={styles.timeValue}>{train.time}</div>
                    <div style={styles.timeStation}>{train.from}</div>
                  </div>

                  <div style={styles.timeDuration}>
                    <div style={styles.durationLine} />
                    <div style={styles.durationText}>{train.duration}h</div>
                  </div>

                  <div style={styles.timeBlock}>
                    <div style={styles.timeLabel}>Arrival</div>
                    <div style={styles.timeValue}>
                      {calculateArrival(train.time, train.duration)}
                    </div>
                    <div style={styles.timeStation}>{train.to}</div>
                  </div>
                </div>

                {/* Amenities */}
                {amenities.length > 0 && (
                  <div style={styles.amenities}>
                    {amenities.slice(0, 4).map((amenity, index) => (
                      <span key={index} style={styles.amenityPill}>
                        {amenity}
                      </span>
                    ))}
                    {amenities.length > 4 && (
                      <span style={styles.amenityMore}>
                        +{amenities.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Seats & Price */}
                <div style={styles.footer}>
                  <div style={styles.seatsInfo}>
                    <span style={{
                      ...styles.seatsText,
                      ...(isLowSeats ? styles.seatsTextLow : {}),
                    }}>
                      {train.seats} seats left
                    </span>
                  </div>
                  <div style={styles.priceBlock}>
                    <div style={styles.priceLabel}>from</div>
                    <div style={styles.priceValue}>R{Math.round(train.price)}</div>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  style={styles.bookButton}
                  onClick={() => onSelectTrain(train)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.primary.navy;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.primary.blue;
                  }}
                >
                  Select Train →
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        // Empty State
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🚫</div>
          <h3 style={styles.emptyTitle}>No trains available</h3>
          <p style={styles.emptyText}>
            There are no trains running from <strong>{route.from}</strong> to <strong>{route.to}</strong> at <strong>{dateTime.time}</strong>.
          </p>
          <p style={styles.emptyText}>
            Try selecting a different time or date.
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate arrival time
function calculateArrival(departureTime, durationHours) {
  const [hours, minutes] = departureTime.split(':').map(Number);
  const arrivalHours = (hours + durationHours) % 24;
  return `${String(arrivalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'clamp(1rem, 3vw, 2rem)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
  },
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 1.875rem)',
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.sm} 0`,
  },
  routeInfo: {
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    color: colors.neutral.gray700,
    marginBottom: spacing.xs,
  },
  resultCount: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.primary.blue,
    fontWeight: typography.weight.semibold,
  },
  separator: {
    margin: `0 ${spacing.sm}`,
    opacity: 0.5,
  },
  loadingState: {
    textAlign: 'center',
    padding: spacing['3xl'],
  },
  spinner: {
    fontSize: '4rem',
    animation: 'spin 2s linear infinite',
    display: 'inline-block',
  },
  loadingText: {
    fontSize: typography.scale.lg,
    color: colors.neutral.gray700,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  loadingSubtext: {
    fontSize: typography.scale.sm,
    color: colors.neutral.gray600,
  },
  errorState: {
    textAlign: 'center',
    padding: spacing['3xl'],
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: typography.scale['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.semantic.error,
    margin: `0 0 ${spacing.sm} 0`,
  },
  errorText: {
    fontSize: typography.scale.base,
    color: colors.neutral.gray700,
    marginBottom: spacing.lg,
  },
  retryButton: {
    padding: `${spacing.md} ${spacing.xl}`,
    background: colors.primary.blue,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: '10px',
    fontSize: typography.scale.base,
    fontWeight: typography.weight.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  trainsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
    gap: 'clamp(1rem, 3vw, 1.5rem)',
  },
  trainCard: {
    background: colors.neutral.white,
    borderRadius: '16px',
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  classBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: '20px',
    color: colors.neutral.white,
    fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  trainHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
  },
  trainName: {
    fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.xs} 0`,
  },
  trainNumber: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.neutral.gray700,
    margin: 0,
  },
  trainIcon: {
    fontSize: 'clamp(2rem, 6vw, 3rem)',
  },
  metaInfo: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.neutral.gray700,
    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
  },
  timeInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'clamp(0.75rem, 2vw, 1rem)',
    background: colors.neutral.gray100,
    borderRadius: '12px',
    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
    gap: spacing.sm,
  },
  timeBlock: {
    textAlign: 'center',
    flex: 1,
  },
  timeLabel: {
    fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
    color: colors.neutral.gray700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: spacing.xs,
  },
  timeValue: {
    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
    fontWeight: typography.weight.bold,
    color: colors.primary.blue,
    marginBottom: spacing.xs,
  },
  timeStation: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.neutral.gray700,
  },
  timeDuration: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `0 ${spacing.sm}`,
  },
  durationLine: {
    width: 'clamp(40px, 10vw, 60px)',
    height: '2px',
    background: colors.primary.blue,
    marginBottom: spacing.xs,
  },
  durationText: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.neutral.gray700,
    fontWeight: typography.weight.medium,
  },
  amenities: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
  },
  amenityPill: {
    padding: `${spacing.xs} ${spacing.sm}`,
    background: colors.primary.pale,
    borderRadius: '6px',
    fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
    color: colors.primary.blue,
  },
  amenityMore: {
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
    color: colors.neutral.gray700,
    fontStyle: 'italic',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
  },
  seatsInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
  seatsText: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.semantic.success,
    fontWeight: typography.weight.medium,
  },
  seatsTextLow: {
    color: colors.semantic.warning,
  },
  priceBlock: {
    textAlign: 'right',
  },
  priceLabel: {
    fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
    color: colors.neutral.gray700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  priceValue: {
    fontSize: 'clamp(1.5rem, 5vw, 1.875rem)',
    fontWeight: typography.weight.bold,
    color: colors.primary.blue,
  },
  bookButton: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 1rem)',
    background: colors.primary.blue,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: '10px',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    fontWeight: typography.weight.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '44px',
    touchAction: 'manipulation',
  },
  emptyState: {
    textAlign: 'center',
    padding: spacing['3xl'],
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.sm} 0`,
  },
  emptyText: {
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    color: colors.neutral.gray700,
    maxWidth: '500px',
    margin: '0 auto 0.5rem',
  },
};

// Add spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default TrainResults;
