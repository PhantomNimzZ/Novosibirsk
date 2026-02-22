// client/src/components/booking/QRTicket.jsx
import { colors, typography, spacing } from "../../styles/tokens";

/**
 * QR Code Ticket Display
 * Shows a scannable QR code with booking details
 * For commuter tickets - simple and instant
 */
const QRTicket = ({ booking, onBookAnother, onDownload }) => {
  // Generate QR code data (in production, this would be a real QR code library)
  const qrData = `PRASA-${booking.id}-${booking.from}-${booking.to}`;

  return (
    <div style={styles.container}>
      {/* Success Icon */}
      <div style={styles.successIcon}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="40" fill={colors.semantic.success} opacity="0.1" />
          <circle cx="40" cy="40" r="30" fill={colors.semantic.success} opacity="0.2" />
          <path
            d="M25 40 L35 50 L55 30"
            stroke={colors.semantic.success}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      <h2 style={styles.title}>Ticket Confirmed!</h2>
      <p style={styles.subtitle}>Show this QR code at the station</p>

      {/* QR Code (Mock - would use real QR library in production) */}
      <div style={styles.qrContainer}>
        <div style={styles.qrCode}>
          {/* Mock QR pattern */}
          <svg viewBox="0 0 200 200" style={styles.qrSvg}>
            <rect width="200" height="200" fill="white" />
            {/* Corners */}
            <rect x="10" y="10" width="40" height="40" fill="black" />
            <rect x="150" y="10" width="40" height="40" fill="black" />
            <rect x="10" y="150" width="40" height="40" fill="black" />
            
            {/* Random pattern (mock) */}
            {Array.from({ length: 20 }).map((_, i) => (
              <rect
                key={i}
                x={20 + (i % 10) * 15}
                y={60 + Math.floor(i / 10) * 15}
                width="10"
                height="10"
                fill={Math.random() > 0.5 ? "black" : "white"}
              />
            ))}
            
            {/* More mock pattern */}
            {Array.from({ length: 20 }).map((_, i) => (
              <rect
                key={`b${i}`}
                x={20 + (i % 10) * 15}
                y={100 + Math.floor(i / 10) * 15}
                width="10"
                height="10"
                fill={Math.random() > 0.5 ? "black" : "white"}
              />
            ))}
          </svg>
        </div>
        <p style={styles.qrNote}>Ticket #{booking.id}</p>
      </div>

      {/* Ticket Details */}
      <div style={styles.details}>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Route:</span>
          <span style={styles.detailValue}>{booking.from} → {booking.to}</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Passenger:</span>
          <span style={styles.detailValue}>{booking.name}</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Valid:</span>
          <span style={styles.detailValue}>Today, any departure</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Fare:</span>
          <span style={styles.detailValue}>R{booking.fare}</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Payment:</span>
          <span style={styles.detailValue}>
            {booking.payment === "mobile" ? "Mobile Payment" : "Cash at Station"}
          </span>
        </div>
      </div>

      {/* Important Notice */}
      <div style={styles.notice}>
        <div style={styles.noticeIcon}>ℹ️</div>
        <div style={styles.noticeText}>
          <strong>Remember:</strong> Arrive 10 minutes early. Have valid ID ready.
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button
          style={styles.buttonSecondary}
          onClick={onDownload}
          onMouseEnter={(e) => e.currentTarget.style.background = colors.neutral.gray200}
          onMouseLeave={(e) => e.currentTarget.style.background = colors.neutral.gray100}
        >
          📥 Download Ticket
        </button>
        <button
          style={styles.buttonPrimary}
          onClick={onBookAnother}
          onMouseEnter={(e) => e.currentTarget.style.background = colors.primary.navy}
          onMouseLeave={(e) => e.currentTarget.style.background = colors.primary.blue}
        >
          Book Another Trip
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: colors.neutral.white,
    borderRadius: '20px',
    padding: spacing['2xl'],
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  },
  successIcon: {
    marginBottom: spacing.lg,
    animation: 'scaleIn 0.5s ease-out',
  },
  title: {
    fontSize: typography.scale['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.semantic.success,
    margin: `0 0 ${spacing.sm} 0`,
  },
  subtitle: {
    fontSize: typography.scale.base,
    color: colors.neutral.gray700,
    margin: `0 0 ${spacing.xl} 0`,
  },
  qrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  qrCode: {
    width: '200px',
    height: '200px',
    padding: spacing.md,
    background: colors.neutral.white,
    border: `4px solid ${colors.primary.blue}`,
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  qrSvg: {
    width: '100%',
    height: '100%',
  },
  qrNote: {
    fontSize: typography.scale.sm,
    color: colors.neutral.gray700,
    margin: 0,
    fontFamily: typography.fontFamily.mono,
  },
  details: {
    background: colors.neutral.gray100,
    borderRadius: '12px',
    padding: spacing.lg,
    marginBottom: spacing.lg,
    textAlign: 'left',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${spacing.sm} 0`,
    borderBottom: `1px solid ${colors.neutral.gray300}`,
  },
  detailLabel: {
    fontSize: typography.scale.sm,
    color: colors.neutral.gray700,
  },
  detailValue: {
    fontSize: typography.scale.sm,
    fontWeight: typography.weight.semibold,
    color: colors.neutral.black,
  },
  notice: {
    display: 'flex',
    gap: spacing.sm,
    padding: spacing.md,
    background: colors.primary.pale,
    border: `1px solid ${colors.primary.blue}`,
    borderRadius: '8px',
    marginBottom: spacing.xl,
    textAlign: 'left',
  },
  noticeIcon: {
    fontSize: typography.scale.xl,
    flexShrink: 0,
  },
  noticeText: {
    fontSize: typography.scale.sm,
    color: colors.neutral.gray900,
    lineHeight: 1.5,
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: spacing.md,
  },
  buttonPrimary: {
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
  buttonSecondary: {
    padding: `${spacing.md} ${spacing.lg}`,
    background: colors.neutral.gray100,
    color: colors.neutral.black,
    border: `2px solid ${colors.neutral.gray300}`,
    borderRadius: '10px',
    fontSize: typography.scale.base,
    fontWeight: typography.weight.medium,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default QRTicket;
