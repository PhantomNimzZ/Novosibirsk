// client/src/components/booking/QuickBookingForm.jsx
import { useState } from "react";
import { colors, typography, spacing } from "../../styles/tokens";

/**
 * Quick Booking Form for Commuter Travel
 * Minimal form - just name and payment method
 * No ID, no email, no seat selection
 */
const QuickBookingForm = ({ route, fare, onSubmit }) => {
  const [name, setName] = useState("");
  const [payment, setPayment] = useState("mobile");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const bookingData = {
      name,
      payment,
      from: route.from,
      to: route.to,
      fare,
      type: "commuter",
      date: new Date().toISOString(),
    };

    try {
      // Call parent's onSubmit handler
      await onSubmit(bookingData);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Quick Booking</h3>
      <p style={styles.subtitle}>Get your ticket in seconds</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Name Input */}
        <div style={styles.field}>
          <label style={styles.label}>Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            required
            style={styles.input}
          />
        </div>

        {/* Payment Method */}
        <div style={styles.field}>
          <label style={styles.label}>Payment Method</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="payment"
                value="mobile"
                checked={payment === "mobile"}
                onChange={(e) => setPayment(e.target.value)}
                style={styles.radio}
              />
              <span>Mobile Payment</span>
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={payment === "cash"}
                onChange={(e) => setPayment(e.target.value)}
                style={styles.radio}
              />
              <span>Cash at Station</span>
            </label>
          </div>
        </div>

        {/* Route Summary */}
        <div style={styles.summary}>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Route:</span>
            <span style={styles.summaryValue}>{route.from} → {route.to}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Fare:</span>
            <span style={styles.summaryValue}>R{fare}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Valid:</span>
            <span style={styles.summaryValue}>Today, any departure</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !name}
          style={{
            ...styles.button,
            ...(isSubmitting || !name ? styles.buttonDisabled : {}),
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting && name) {
              e.currentTarget.style.background = colors.primary.navy;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting && name) {
              e.currentTarget.style.background = colors.primary.blue;
            }
          }}
        >
          {isSubmitting ? "Processing..." : "Book Ticket →"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    background: colors.neutral.white,
    borderRadius: '16px',
    padding: spacing.xl,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: `2px solid ${colors.primary.blue}`,
  },
  title: {
    fontSize: typography.scale.xl,
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.xs} 0`,
  },
  subtitle: {
    fontSize: typography.scale.sm,
    color: colors.neutral.gray700,
    margin: `0 0 ${spacing.lg} 0`,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.scale.base,
    fontWeight: typography.weight.medium,
    color: colors.neutral.black,
  },
  input: {
    padding: spacing.md,
    border: `2px solid ${colors.neutral.gray300}`,
    borderRadius: '8px',
    fontSize: typography.scale.base,
    outline: 'none',
    transition: 'border-color 0.3s ease',
    fontFamily: typography.fontFamily.body,
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    border: `2px solid ${colors.neutral.gray300}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: typography.scale.base,
  },
  radio: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  summary: {
    background: colors.primary.pale,
    padding: spacing.md,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: typography.scale.sm,
  },
  summaryLabel: {
    color: colors.neutral.gray700,
  },
  summaryValue: {
    fontWeight: typography.weight.semibold,
    color: colors.neutral.black,
  },
  button: {
    padding: `${spacing.md} ${spacing.xl}`,
    background: colors.primary.blue,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: '10px',
    fontSize: typography.scale.lg,
    fontWeight: typography.weight.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonDisabled: {
    background: colors.neutral.gray300,
    cursor: 'not-allowed',
  },
};

export default QuickBookingForm;
