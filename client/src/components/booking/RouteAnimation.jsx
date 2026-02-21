// client/src/components/booking/RouteAnimation.jsx
import { useState, useEffect } from "react";
import { colors, typography, spacing } from "../../styles/tokens";

/**
 * Cinematic Route Animation
 * Inspired by Battlefield 1 Operations intro
 * Shows an animated journey from origin to destination with camera movements
 */
const RouteAnimation = ({ route, onComplete }) => {
  const [phase, setPhase] = useState('intro'); // intro → journey → arrival → complete
  const [progress, setProgress] = useState(0);

  // Station coordinates for the route
  const stations = [
    { name: route.from, x: 200, y: 100, arrival: '08:00' },
    ...(route.intermediateStops || []),
    { name: route.to, x: 700, y: 500, arrival: route.arrivalTime || '22:00' },
  ];

  useEffect(() => {
    const timeline = [
      { phase: 'intro', duration: 2000 },
      { phase: 'journey', duration: 5000 },
      { phase: 'arrival', duration: 2000 },
      { phase: 'complete', duration: 1000 },
    ];

    let currentTime = 0;
    timeline.forEach(({ phase: nextPhase, duration }) => {
      setTimeout(() => setPhase(nextPhase), currentTime);
      currentTime += duration;
    });

    // Progress animation during journey phase
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 100);

    // Notify parent when complete
    setTimeout(() => {
      if (onComplete) onComplete();
    }, currentTime);

    return () => clearInterval(progressInterval);
  }, [route, onComplete]);

  return (
    <div style={styles.container}>
      {/* Background Overlay */}
      <div style={styles.overlay} />

      {/* Animated Map */}
      <svg viewBox="0 0 900 600" style={styles.svg}>
        {/* Map background (faded) */}
        <rect width="900" height="600" fill={colors.primary.navy} opacity="0.9" />

        {/* Route path */}
        <path
          d={`M ${stations[0].x},${stations[0].y} L ${stations[stations.length - 1].x},${stations[stations.length - 1].y}`}
          stroke={colors.accent.orange}
          strokeWidth="6"
          fill="none"
          strokeDasharray="2000"
          strokeDashoffset={phase === 'journey' ? 2000 - (progress * 20) : 2000}
          style={styles.routePath}
        />

        {/* Station markers */}
        {stations.map((station, index) => {
          const isVisible = phase === 'journey' && progress > (index / stations.length) * 100;
          const isOrigin = index === 0;
          const isDestination = index === stations.length - 1;

          return (
            <g key={index} style={{ opacity: isVisible || phase === 'arrival' || phase === 'complete' ? 1 : 0 }}>
              {/* Marker */}
              <circle
                cx={station.x}
                cy={station.y}
                r={isOrigin || isDestination ? "20" : "12"}
                fill={isDestination && phase === 'arrival' ? colors.semantic.success : colors.accent.orange}
                stroke={colors.neutral.white}
                strokeWidth="3"
                style={styles.stationMarker}
              />

              {/* Station name */}
              <text
                x={station.x}
                y={station.y - 30}
                textAnchor="middle"
                fill={colors.neutral.white}
                fontSize="18"
                fontWeight="bold"
                style={styles.stationText}
              >
                {station.name}
              </text>

              {/* Arrival time */}
              {station.arrival && (
                <text
                  x={station.x}
                  y={station.y + 45}
                  textAnchor="middle"
                  fill={colors.neutral.white}
                  fontSize="14"
                  opacity="0.8"
                >
                  {station.arrival}
                </text>
              )}
            </g>
          );
        })}

        {/* Animated train */}
        {phase === 'journey' && (
          <g>
            <circle
              cx={stations[0].x + ((stations[stations.length - 1].x - stations[0].x) * progress / 100)}
              cy={stations[0].y + ((stations[stations.length - 1].y - stations[0].y) * progress / 100)}
              r="10"
              fill={colors.primary.blue}
              style={styles.trainIcon}
            />
            <text
              x={stations[0].x + ((stations[stations.length - 1].x - stations[0].x) * progress / 100)}
              y={stations[0].y + ((stations[stations.length - 1].y - stations[0].y) * progress / 100) - 20}
              textAnchor="middle"
              fontSize="24"
            >
              🚆
            </text>
          </g>
        )}
      </svg>

      {/* Text Overlays */}
      <div style={styles.textOverlay}>
        {phase === 'intro' && (
          <div style={styles.phaseText}>
            <h1 style={styles.bigText}>Your Journey Begins</h1>
            <p style={styles.subText}>Departing from {route.from}</p>
          </div>
        )}

        {phase === 'journey' && (
          <div style={styles.phaseText}>
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${progress}%`}} />
              </div>
              <p style={styles.progressText}>
                {Math.round(progress)}% Complete • {route.distance} km • ~{route.duration} hours
              </p>
            </div>
          </div>
        )}

        {phase === 'arrival' && (
          <div style={styles.phaseText}>
            <h1 style={styles.bigText}>Welcome to {route.to}</h1>
            <p style={styles.subText}>Estimated arrival: {route.arrivalTime || '22:00'}</p>
          </div>
        )}

        {phase === 'complete' && (
          <div style={styles.phaseText}>
            <div style={styles.checkmark}>✓</div>
            <h2 style={styles.completeText}>Route Confirmed</h2>
          </div>
        )}
      </div>

      {/* Cinematic letterbox bars */}
      <div style={styles.letterboxTop} />
      <div style={styles.letterboxBottom} />

      {/* Inline CSS for animations */}
      <style>{`
        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes checkmarkPop {
          0% { transform: scale(0) rotate(0deg); }
          50% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    background: colors.neutral.black,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `radial-gradient(circle at center, transparent 0%, ${colors.neutral.black} 100%)`,
    pointerEvents: 'none',
    zIndex: 2,
  },
  svg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  routePath: {
    transition: 'stroke-dashoffset 0.5s ease-out',
    filter: 'drop-shadow(0 0 10px rgba(255, 107, 53, 0.5))',
  },
  stationMarker: {
    animation: 'pulse 2s ease-in-out infinite',
    transition: 'opacity 0.5s ease-in',
  },
  stationText: {
    textShadow: `0 2px 4px ${colors.neutral.black}`,
    transition: 'opacity 0.5s ease-in',
  },
  trainIcon: {
    filter: 'drop-shadow(0 0 8px rgba(0, 102, 204, 0.8))',
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    pointerEvents: 'none',
  },
  phaseText: {
    textAlign: 'center',
    animation: 'fadeInText 1s ease-out',
    color: colors.neutral.white,
  },
  bigText: {
    fontSize: typography.scale['5xl'],
    fontWeight: typography.weight.bold,
    margin: `0 0 ${spacing.md} 0`,
    textShadow: `0 4px 8px ${colors.neutral.black}`,
    letterSpacing: '0.05em',
  },
  subText: {
    fontSize: typography.scale.xl,
    margin: 0,
    opacity: 0.9,
    textShadow: `0 2px 4px ${colors.neutral.black}`,
  },
  progressContainer: {
    width: '400px',
    maxWidth: '80vw',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    background: colors.accent.orange,
    transition: 'width 0.3s ease-out',
    boxShadow: `0 0 10px ${colors.accent.orange}`,
  },
  progressText: {
    fontSize: typography.scale.lg,
    margin: 0,
    opacity: 0.9,
  },
  checkmark: {
    fontSize: '80px',
    color: colors.semantic.success,
    animation: 'checkmarkPop 0.5s ease-out',
    marginBottom: spacing.md,
  },
  completeText: {
    fontSize: typography.scale['3xl'],
    fontWeight: typography.weight.bold,
    margin: 0,
  },
  letterboxTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '80px',
    background: colors.neutral.black,
    zIndex: 4,
  },
  letterboxBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '80px',
    background: colors.neutral.black,
    zIndex: 4,
  },
};

export default RouteAnimation;
