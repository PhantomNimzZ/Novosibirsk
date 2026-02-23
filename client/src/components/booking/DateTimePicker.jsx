// client/src/components/booking/DateTimePicker.jsx
import { useState } from "react";
import { colors, typography, spacing } from "../../styles/tokens";

/**
 * Date and Time Picker for Long-Distance Booking (Mobile-Responsive)
 * Shows a calendar for date selection and time slots for departure times
 */
const DateTimePicker = ({ route, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const availableDates = generateDates();

  const timeSlots = [
    { time: "06:00", label: "Early Morning", price: 350, available: 45 },
    { time: "09:30", label: "Morning", price: 420, available: 12 },
    { time: "14:00", label: "Afternoon", price: 450, available: 28 },
    { time: "18:30", label: "Evening", price: 400, available: 8 },
    { time: "22:00", label: "Night", price: 380, available: 34 },
  ];

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeClick = (slot) => {
    setSelectedTime(slot);
    
    if (onSelect) {
      onSelect({
        date: selectedDate,
        time: slot.time,
        label: slot.label,
        price: slot.price,
      });
    }
  };

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      dayName: days[date.getDay()],
      dayNum: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear(),
      full: `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`,
    };
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Select Travel Date & Time</h2>
        <p style={styles.subtitle}>
          {route.from} → {route.to} • {route.distance} km • ~{route.duration} hours
        </p>
      </div>

      {/* Date Selector (Horizontal Scroll) */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Choose Date</h3>
        <div style={styles.dateScroller}>
          {availableDates.map((date, index) => {
            const formatted = formatDate(date);
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            
            return (
              <div
                key={index}
                style={{
                  ...styles.dateCard,
                  ...(isSelected ? styles.dateCardSelected : {}),
                  ...(isToday(date) ? styles.dateCardToday : {}),
                }}
                onClick={() => handleDateClick(date)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = colors.primary.blue;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = colors.neutral.gray300;
                  }
                }}
              >
                <div style={styles.dateDayName}>{formatted.dayName}</div>
                <div style={styles.dateDayNum}>{formatted.dayNum}</div>
                <div style={styles.dateMonth}>{formatted.month}</div>
                {isToday(date) && (
                  <div style={styles.todayBadge}>Today</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selector */}
      {selectedDate && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            Choose Departure Time for {formatDate(selectedDate).full}
          </h3>
          <div style={styles.timeSlotsGrid}>
            {timeSlots.map((slot, index) => {
              const isSelected = selectedTime?.time === slot.time;
              const isLowSeats = slot.available < 10;
              
              return (
                <div
                  key={index}
                  style={{
                    ...styles.timeSlot,
                    ...(isSelected ? styles.timeSlotSelected : {}),
                  }}
                  onClick={() => handleTimeClick(slot)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  <div style={styles.timeSlotTime}>{slot.time}</div>
                  <div style={styles.timeSlotLabel}>{slot.label}</div>
                  <div style={styles.timeSlotPrice}>R{slot.price}</div>
                  <div style={{
                    ...styles.timeSlotSeats,
                    ...(isLowSeats ? styles.timeSlotSeatsLow : {}),
                  }}>
                    {slot.available} seats left
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedDate && selectedTime && (
        <div style={styles.footer}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryRow}>
              <span>Date:</span>
              <strong>{formatDate(selectedDate).full}</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>Departure:</span>
              <strong>{selectedTime.time} ({selectedTime.label})</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>Price:</span>
              <strong style={{ color: colors.primary.blue }}>R{selectedTime.price}</strong>
            </div>
          </div>
          <button
            style={styles.continueButton}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.primary.navy}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.primary.blue}
          >
            Continue to Train Selection →
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: 'clamp(1rem, 3vw, 2rem)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 'clamp(1rem, 3vw, 2rem)',
  },
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 1.875rem)',
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.sm} 0`,
  },
  subtitle: {
    fontSize: 'clamp(0.75rem, 2.5vw, 1rem)',
    color: colors.neutral.gray700,
    margin: 0,
    padding: '0 0.5rem',
  },
  section: {
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
  },
  sectionTitle: {
    fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
    fontWeight: typography.weight.semibold,
    color: colors.neutral.black,
    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
    padding: '0 0.5rem',
  },
  dateScroller: {
    display: 'flex',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
    overflowX: 'auto',
    paddingBottom: spacing.md,
    scrollbarWidth: 'thin',
    scrollbarColor: `${colors.primary.blue} ${colors.neutral.gray100}`,
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
    scrollSnapType: 'x proximity', // Snap to cards
    padding: '0 0.5rem 1rem',
  },
  dateCard: {
    minWidth: 'clamp(70px, 15vw, 80px)', // Responsive width
    padding: 'clamp(0.75rem, 2vw, 1rem)',
    background: colors.neutral.white,
    border: `2px solid ${colors.neutral.gray300}`,
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    flexShrink: 0,
    scrollSnapAlign: 'start', // Snap alignment
    minHeight: '100px', // Consistent height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    touchAction: 'manipulation', // Optimize touch
  },
  dateCardSelected: {
    background: colors.primary.blue,
    color: colors.neutral.white,
    borderColor: colors.primary.blue,
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 102, 204, 0.3)',
  },
  dateCardToday: {
    borderColor: colors.accent.orange,
  },
  dateDayName: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    opacity: 0.8,
    marginBottom: '0.25rem',
  },
  dateDayNum: {
    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
    fontWeight: typography.weight.bold,
    marginBottom: '0.25rem',
  },
  dateMonth: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    opacity: 0.8,
  },
  todayBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: colors.accent.orange,
    color: colors.neutral.white,
    fontSize: '0.625rem',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: typography.weight.semibold,
  },
  timeSlotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 160px), 1fr))', // Mobile-first
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    padding: '0 0.5rem',
  },
  timeSlot: {
    padding: 'clamp(0.75rem, 3vw, 1rem)',
    background: colors.neutral.white,
    border: `2px solid ${colors.neutral.gray300}`,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    minHeight: '120px', // Consistent height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    touchAction: 'manipulation',
  },
  timeSlotSelected: {
    background: colors.primary.pale,
    borderColor: colors.primary.blue,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0, 102, 204, 0.2)',
  },
  timeSlotTime: {
    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
    fontWeight: typography.weight.bold,
    color: colors.primary.blue,
    marginBottom: '0.25rem',
  },
  timeSlotLabel: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.neutral.gray700,
    marginBottom: '0.5rem',
  },
  timeSlotPrice: {
    fontSize: 'clamp(1rem, 3vw, 1.125rem)',
    fontWeight: typography.weight.semibold,
    color: colors.neutral.black,
    marginBottom: '0.5rem',
  },
  timeSlotSeats: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: colors.semantic.success,
  },
  timeSlotSeatsLow: {
    color: colors.semantic.warning,
    fontWeight: typography.weight.semibold,
  },
  footer: {
    marginTop: 'clamp(1.5rem, 4vw, 2rem)',
    padding: '0 0.5rem',
  },
  summaryCard: {
    background: colors.primary.pale,
    border: `2px solid ${colors.primary.blue}`,
    borderRadius: '12px',
    padding: 'clamp(0.75rem, 3vw, 1rem)',
    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${spacing.sm} 0`,
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    gap: '1rem', // Prevent text collision
  },
  continueButton: {
    width: '100%',
    padding: 'clamp(0.75rem, 3vw, 1rem)',
    background: colors.primary.blue,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: '12px',
    fontSize: 'clamp(1rem, 3vw, 1.125rem)',
    fontWeight: typography.weight.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '44px', // Touch-friendly
    touchAction: 'manipulation',
  },
};

export default DateTimePicker;
