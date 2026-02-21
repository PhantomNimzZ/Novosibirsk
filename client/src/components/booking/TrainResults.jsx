// client/src/components/booking/TrainResults.jsx
import { colors, typography, spacing } from "../../styles/tokens";

/**
 * Train Results Display
 * Shows available trains for the selected route, date, and time
 * Each result includes train details, amenities, and booking option
 */
const TrainResults = ({ route, dateTime, trains, onSelectTrain }) => {
  // Mock train data (would come from API in production)
  const mockTrains = trains || [
    {
      id: 1,
      name: "Shosholoza Meyl",
      number: "SM001",
      class: "Economy",
      departure: dateTime.time,
      arrival: calculateArrival(dateTime.time, route.duration),
      duration: `${route.duration}h`,
      price: dateTime.price,
      seatsAvailable: 45,
      amenities: ["WiFi", "Power Outlets", "Dining Car", "Luggage Storage"],
      comfort: "Standard",
    },
    {
      id: 2,
      name: "Premier Classe",
      number: "PC001",
      class: "Business",
      departure: dateTime.time,
      arrival: calculateArrival(dateTime.time, route.duration),
      duration: `${route.duration}h`,
      price: dateTime.price * 1.5,
      seatsAvailable: 18,
      amenities: ["WiFi", "Power Outlets", "Premium Dining", "Lounge Access", "Extra Legroom"],
      comfort: "Premium",
    },
    {
      id: 3,
      name: "Blue Train",
      number: "BT001",
      class: "Luxury",
      departure: dateTime.time,
      arrival: calculateArrival(dateTime.time, route.duration - 1), // Faster
      duration: `${route.duration - 1}h`,
      price: dateTime.price * 2.5,
      seatsAvailable: 8,
      amenities: ["WiFi", "Power Outlets", "Fine Dining", "Butler Service", "Cabin Suites", "Observation Car"],
      comfort: "Luxury",
    },
  ];

  function calculateArrival(departureTime, durationHours) {
    const [hours, minutes] = departureTime.split(':').map(Number);
    const arrivalHours = (hours + durationHours) % 24;
    return `${String(arrivalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  const getClassColor = (trainClass) => {
    switch (trainClass) {
      case 'Economy': return colors.semantic.info;
      case 'Business': return colors.primary.blue;
      case 'Luxury': return colors.accent.gold;
      default: return colors.neutral.gray700;
    }
  };

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
      </div>

      {/* Train Cards */}
      <div style={styles.trainsGrid}>
        {mockTrains.map((train) => {
          const isLowSeats = train.seatsAvailable < 10;
          
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
                  <h3 style={styles.trainName}>{train.name}</h3>
                  <p style={styles.trainNumber}>{train.number}</p>
                </div>
                <div style={styles.trainIcon}>🚆</div>
              </div>

              {/* Time Info */}
              <div style={styles.timeInfo}>
                <div style={styles.timeBlock}>
                  <div style={styles.timeLabel}>Departure</div>
                  <div style={styles.timeValue}>{train.departure}</div>
                  <div style={styles.timeStation}>{route.from}</div>
                </div>

                <div style={styles.timeDuration}>
                  <div style={styles.durationLine} />
                  <div style={styles.durationText}>{train.duration}</div>
                </div>

                <div style={styles.timeBlock}>
                  <div style={styles.timeLabel}>Arrival</div>
                  <div style={styles.timeValue}>{train.arrival}</div>
                  <div style={styles.timeStation}>{route.to}</div>
                </div>
              </div>

              {/* Amenities */}
              <div style={styles.amenities}>
                {train.amenities.slice(0, 4).map((amenity, index) => (
                  <span key={index} style={styles.amenityPill}>
                    {amenity}
                  </span>
                ))}
                {train.amenities.length > 4 && (
                  <span style={styles.amenityMore}>
                    +{train.amenities.length - 4} more
                  </span>
                )}
              </div>

              {/* Seats & Price */}
              <div style={styles.footer}>
                <div style={styles.seatsInfo}>
                  <span style={{
                    ...styles.seatsText,
                    ...(isLowSeats ? styles.seatsTextLow : {}),
                  }}>
                    {train.seatsAvailable} seats left
                  </span>
                </div>
                <div style={styles.priceBlock}>
                  <div style={styles.priceLabel}>from</div>
                  <div style={styles.priceValue}>R{train.price.toFixed(0)}</div>
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

      {/* Empty State (if no trains) */}
      {mockTrains.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🚫</div>
          <h3 style={styles.emptyTitle}>No trains available</h3>
          <p style={styles.emptyText}>
            There are no trains running on this route for the selected date and time.
            Please try a different date or time.
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
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
  routeInfo: {
    fontSize: typography.scale.base,
    color: colors.neutral.gray700,
  },
  separator: {
    margin: `0 ${spacing.sm}`,
    opacity: 0.5,
  },
  trainsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: spacing.xl,
  },
  trainCard: {
    background: colors.neutral.white,
    borderRadius: '16px',
    padding: spacing.xl,
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
    fontSize: typography.scale.xs,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  trainHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  trainName: {
    fontSize: typography.scale.xl,
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.xs} 0`,
  },
  trainNumber: {
    fontSize: typography.scale.sm,
    color: colors.neutral.gray700,
    margin: 0,
  },
  trainIcon: {
    fontSize: typography.scale['3xl'],
  },
  timeInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    background: colors.neutral.gray100,
    borderRadius: '12px',
    marginBottom: spacing.lg,
  },
  timeBlock: {
    textAlign: 'center',
  },
  timeLabel: {
    fontSize: typography.scale.xs,
    color: colors.neutral.gray700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: spacing.xs,
  },
  timeValue: {
    fontSize: typography.scale['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.primary.blue,
    marginBottom: spacing.xs,
  },
  timeStation: {
    fontSize: typography.scale.sm,
    color: colors.neutral.gray700,
  },
  timeDuration: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `0 ${spacing.lg}`,
  },
  durationLine: {
    width: '60px',
    height: '2px',
    background: colors.primary.blue,
    marginBottom: spacing.xs,
  },
  durationText: {
    fontSize: typography.scale.sm,
    color: colors.neutral.gray700,
    fontWeight: typography.weight.medium,
  },
  amenities: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  amenityPill: {
    padding: `${spacing.xs} ${spacing.sm}`,
    background: colors.primary.pale,
    borderRadius: '6px',
    fontSize: typography.scale.xs,
    color: colors.primary.blue,
  },
  amenityMore: {
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: typography.scale.xs,
    color: colors.neutral.gray700,
    fontStyle: 'italic',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seatsInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
  seatsText: {
    fontSize: typography.scale.sm,
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
    fontSize: typography.scale.xs,
    color: colors.neutral.gray700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  priceValue: {
    fontSize: typography.scale['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.primary.blue,
  },
  bookButton: {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    background: colors.primary.blue,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: '10px',
    fontSize: typography.scale.base,
    fontWeight: typography.weight.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: spacing['3xl'],
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.scale['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.sm} 0`,
  },
  emptyText: {
    fontSize: typography.scale.base,
    color: colors.neutral.gray700,
    maxWidth: '500px',
    margin: '0 auto',
  },
};

export default TrainResults;
