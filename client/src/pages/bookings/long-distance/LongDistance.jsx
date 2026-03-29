// client/src/pages/bookings/long-distance/LongDistance.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteSelector from "../../../components/booking/RouteSelector";
import DateTimePicker from "../../../components/booking/DateTimePicker";
import TrainResults from "../../../components/booking/TrainResults";
import RouteAnimation from "../../../components/booking/RouteAnimation";
import { colors, spacing } from "../../../styles/tokens";

/**
 * Complete Long-Distance Booking Flow
 * Step 1: Select Route (interactive map)
 * Step 2: Select Date & Time
 * Step 3: View Available Trains
 * Step 4: Select Train → Navigate to seat selection
 */
const LongDistance = () => {
  const navigate = useNavigate();

  // Flow state
  const [step, setStep] = useState(1); // 1: Route, 2: DateTime, 3: TrainResults
  
  // Data state
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  
  // Animation state
  const [showAnimation, setShowAnimation] = useState(false);

  // Step 1: Route Selection
  const handleRouteSelect = (route) => {

    setSelectedRoute(route);
    setStep(2);
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: Date/Time Selection
  const handleDateTimeSelect = (dateTime) => {

    setSelectedDateTime(dateTime);
    setStep(3);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3: Train Selection
  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
    
    // Play route animation
    setShowAnimation(true);
  };

  // After animation completes
  const handleAnimationComplete = () => {
    setShowAnimation(false);
    
    // Navigate to seat selection with all booking data
    navigate("/book", {
      state: {
        train: {
          train: selectedTrain.name,
          trainNumber: selectedTrain.number,
          trainId: selectedTrain.id,
          from: selectedRoute.from,
          to: selectedRoute.to,
          date: selectedDateTime.date,
          time: selectedDateTime.time,
          price: `R${selectedTrain.price}`,
        },
      },
    });
  };

  // Reset to step
  const goToStep = (targetStep) => {
    setStep(targetStep);
    if (targetStep === 1) {
      setSelectedRoute(null);
      setSelectedDateTime(null);
      setSelectedTrain(null);
    } else if (targetStep === 2) {
      setSelectedDateTime(null);
      setSelectedTrain(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      <div style={styles.container}>
      {/* Progress Indicator */}
      <div style={styles.progressBar}>
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(step / 3) * 100}%`,
            }}
          />
        </div>
        <div style={styles.progressSteps}>
          <div style={{ ...styles.progressStep, ...(step >= 1 ? styles.progressStepActive : {}) }}>
            <div style={styles.progressStepNumber}>1</div>
            <div style={styles.progressStepLabel}>Route</div>
          </div>
          <div style={{ ...styles.progressStep, ...(step >= 2 ? styles.progressStepActive : {}) }}>
            <div style={styles.progressStepNumber}>2</div>
            <div style={styles.progressStepLabel}>Date & Time</div>
          </div>
          <div style={{ ...styles.progressStep, ...(step >= 3 ? styles.progressStepActive : {}) }}>
            <div style={styles.progressStepNumber}>3</div>
            <div style={styles.progressStepLabel}>Select Train</div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div style={styles.stepContent}>
        {/* Step 1: Route Selection */}
        {step === 1 && (
          <RouteSelector onRouteSelect={handleRouteSelect} />
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 2 && selectedRoute && (
          <div>
            {/* Breadcrumb */}
            <div style={styles.breadcrumb}>
              <button style={styles.breadcrumbLink} onClick={() => goToStep(1)}>
                ← Change Route
              </button>
              <span style={styles.breadcrumbCurrent}>
                {selectedRoute.from} → {selectedRoute.to}
              </span>
            </div>

            <DateTimePicker
              route={selectedRoute}
              onSelect={handleDateTimeSelect}
            />
          </div>
        )}

        {/* Step 3: Train Results */}
        {step === 3 && selectedRoute && selectedDateTime && (
          <div>
            {/* Breadcrumb */}
            <div style={styles.breadcrumb}>
              <button style={styles.breadcrumbLink} onClick={() => goToStep(1)}>
                ← Change Route
              </button>
              <span style={styles.breadcrumbSeparator}>|</span>
              <button style={styles.breadcrumbLink} onClick={() => goToStep(2)}>
                Change Date/Time
              </button>
            </div>

            <TrainResults
              route={selectedRoute}
              dateTime={selectedDateTime}
              onSelectTrain={handleTrainSelect}
            />
          </div>
        )}
      </div>

      {/* Route Animation Overlay */}
      {showAnimation && selectedRoute && (
        <RouteAnimation
          route={{
            from: selectedRoute.from,
            to: selectedRoute.to,
            distance: selectedRoute.distance,
            duration: selectedRoute.duration,
            arrivalTime: selectedDateTime?.time || "22:00",
            intermediateStops: selectedRoute.intermediateStops || [], 
          }}
          onComplete={handleAnimationComplete}
        />
      )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: colors.neutral.gray100,
    display: 'flex',
    flexDirection: 'column',
  },
  nav: { background: "#0077CC", padding: "0 clamp(1rem, 3vw, 2rem)", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" },
  navInner: { maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" },
  logoGroup: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  logoText: { fontSize: "1.3rem", fontWeight: 700, color: "white", letterSpacing: "0.12em" },
  backBtn: { background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" },
  container: {
    flex: 1,
    background: colors.neutral.gray100,
  },
  progressBar: {
    background: colors.neutral.white,
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.neutral.gray300}`,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  progressTrack: {
    width: '100%',
    height: '4px',
    background: colors.neutral.gray300,
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    background: colors.primary.blue,
    transition: 'width 0.5s ease',
    borderRadius: '2px',
  },
  progressSteps: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '600px',
    margin: '0 auto',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.xs,
    opacity: 0.4,
    transition: 'opacity 0.3s ease',
  },
  progressStepActive: {
    opacity: 1,
  },
  progressStepNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: colors.primary.blue,
    color: colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
  },
  progressStepLabel: {
    fontSize: '12px',
    color: colors.neutral.gray700,
    textAlign: 'center',
  },
  stepContent: {
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: `${spacing.lg} ${spacing.xl}`,
    maxWidth: '1200px',
    margin: '0 auto',
    fontSize: '14px',
  },
  breadcrumbLink: {
    background: 'none',
    border: 'none',
    color: colors.primary.blue,
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
    fontSize: '14px',
  },
  breadcrumbSeparator: {
    color: colors.neutral.gray500,
  },
  breadcrumbCurrent: {
    color: colors.neutral.gray700,
    fontWeight: 600,
  },
};

export default LongDistance;
