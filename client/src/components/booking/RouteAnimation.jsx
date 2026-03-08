// client/src/components/booking/RouteAnimation.jsx
import { useState, useEffect } from "react";
import { colors, typography, spacing } from "../../styles/tokens";

/**
 * Cinematic Route Animation - Battlefield 1 Operations Style
 * Features: Fog of War lifting, dramatic camera movements, front-line sweep
 */
const RouteAnimation = ({ route, onComplete }) => {
    // 🔍 DEBUG: Log what animation receives
  console.log("🎬 Animation received route:", route);
  console.log("🚉 Intermediate stops:", route.intermediateStops);
  const [phase, setPhase] = useState('intro'); // intro → reveal → journey → arrival → complete
  const [progress, setProgress] = useState(0);
  const [fogReveal, setFogReveal] = useState(0); // 0-100 for fog lifting
  const [cameraZoom, setCameraZoom] = useState(1.5); // Start zoomed in
  const [cameraPan, setCameraPan] = useState({ x: 0, y: 0 });

  // Station coordinates for the route
  const stations = [
    { name: route.from, x: 200, y: 300, arrival: '08:00' },
    ...(route.intermediateStops || []).map((stop, i) => ({
      name: stop.station || stop,
      x: 200 + ((500 / (route.intermediateStops.length + 1)) * (i + 1)),
      y: 300 + (Math.sin(i * 0.5) * 80),
      arrival: stop.arrival || '',
    })),
    { name: route.to, x: 700, y: 300, arrival: route.arrivalTime || '22:00' },
  ];

  useEffect(() => {
    const timeline = [
      { phase: 'intro', duration: 1500 },
      { phase: 'reveal', duration: 3000 },   // Fog of war lifting
      { phase: 'journey', duration: 6000 },  // Train moving
      { phase: 'arrival', duration: 2000 },
      { phase: 'complete', duration: 1000 },
    ];

    let currentTime = 0;
    timeline.forEach(({ phase: nextPhase, duration }) => {
      setTimeout(() => setPhase(nextPhase), currentTime);
      currentTime += duration;
    });

    // Fog reveal animation (sweeping effect)
    const fogInterval = setInterval(() => {
      setFogReveal((prev) => {
        if (prev >= 100) return 100;
        return prev + 1.5; // Smooth fog lifting
      });
    }, 30);

    // Progress animation during journey phase
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 0.8; // Slower, more dramatic
      });
    }, 100);

    // Camera zoom and pan animation
    const cameraInterval = setInterval(() => {
      setCameraZoom((prev) => {
        if (prev <= 1) return 1;
        return prev - 0.005; // Slow zoom out
      });
      
      // Pan camera to follow the route
      setCameraPan((prev) => ({
        x: prev.x + (progress * 0.5 - prev.x) * 0.05,
        y: prev.y + (Math.sin(progress * 0.1) * 10 - prev.y) * 0.05,
      }));
    }, 50);

    // Notify parent when complete
    setTimeout(() => {
      if (onComplete) onComplete();
    }, currentTime);

    return () => {
      clearInterval(fogInterval);
      clearInterval(progressInterval);
      clearInterval(cameraInterval);
    };
  }, [route, onComplete, progress]);

  // Calculate train position
  const trainProgress = progress / 100;
  const trainX = stations[0].x + ((stations[stations.length - 1].x - stations[0].x) * trainProgress);
  const trainY = stations[0].y + ((stations[stations.length - 1].y - stations[0].y) * trainProgress);

  return (
    <div style={styles.container}>
      {/* Film grain overlay */}
      <div style={styles.filmGrain} />

      {/* Vignette */}
      <div style={styles.vignette} />

      {/* Animated Map with Camera Movement */}
      <div style={{
        ...styles.mapContainer,
        transform: `scale(${cameraZoom}) translate(${-cameraPan.x}px, ${-cameraPan.y}px)`,
      }}>
        <svg viewBox="0 0 900 600" style={styles.svg}>
          {/* Map background - vintage paper texture */}
          <defs>
            {/* Sepia filter for vintage look */}
            <filter id="sepia">
              <feColorMatrix
                type="matrix"
                values="0.393 0.769 0.189 0 0
                        0.349 0.686 0.168 0 0
                        0.272 0.534 0.131 0 0
                        0 0 0 1 0"
              />
            </filter>

            {/* Fog of war gradient */}
            <linearGradient id="fogGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.95" />
              <stop offset={`${fogReveal}%`} stopColor="#1a1a1a" stopOpacity="0" />
              <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.95" />
            </linearGradient>

            {/* Animated sweep gradient */}
            <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.accent.orange} stopOpacity="0" />
              <stop offset={`${fogReveal - 5}%`} stopColor={colors.accent.orange} stopOpacity="0.8" />
              <stop offset={`${fogReveal}%`} stopColor={colors.accent.orange} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Base map */}
          <rect width="900" height="600" fill="#2a2520" />

          {/* Topographic lines (decorative) */}
          {[...Array(8)].map((_, i) => (
            <path
              key={`topo-${i}`}
              d={`M 0,${100 + i * 60} Q 225,${80 + i * 60} 450,${100 + i * 60} T 900,${100 + i * 60}`}
              stroke="#3a3530"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
          ))}

          {/* Route path (hidden under fog initially) */}
          <path
            d={stations.map((s, i) => 
              i === 0 ? `M ${s.x},${s.y}` : `L ${s.x},${s.y}`
            ).join(' ')}
            stroke={colors.accent.orange}
            strokeWidth="8"
            fill="none"
            strokeDasharray={phase === 'journey' ? "none" : "2000"}
            strokeDashoffset={phase === 'journey' ? 0 : 2000 - (fogReveal * 20)}
            style={styles.routePath}
            opacity={phase === 'reveal' || phase === 'journey' || phase === 'arrival' || phase === 'complete' ? 1 : 0}
          />

          {/* Sweeping front-line effect */}
          {(phase === 'reveal' || phase === 'journey') && (
            <rect
              x="0"
              y="0"
              width={`${fogReveal * 9}px`}
              height="600"
              fill="url(#sweepGradient)"
              opacity="0.4"
            />
          )}

          {/* Station markers (revealed progressively) */}
          {stations.map((station, index) => {
            const stationRevealProgress = (fogReveal / 100) * stations.length;
            const isRevealed = index < stationRevealProgress;
            const isOrigin = index === 0;
            const isDestination = index === stations.length - 1;
            const isPassed = phase === 'journey' && (index / stations.length) < trainProgress;

            return (
              <g 
                key={index} 
                style={{ 
                  opacity: isRevealed || phase === 'arrival' || phase === 'complete' ? 1 : 0,
                  transition: 'opacity 0.8s ease-out',
                }}
              >
                {/* Glow effect for active stations */}
                {isPassed && (
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r={isOrigin || isDestination ? "35" : "25"}
                    fill={colors.accent.orange}
                    opacity="0.2"
                    style={styles.stationGlow}
                  />
                )}

                {/* Marker */}
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={isOrigin || isDestination ? "22" : "14"}
                  fill={isPassed ? colors.semantic.success : colors.neutral.gray700}
                  stroke={isPassed ? colors.accent.orange : colors.neutral.gray500}
                  strokeWidth="4"
                  style={{
                    ...styles.stationMarker,
                    animation: isPassed ? 'pulse 2s ease-in-out infinite' : 'none',
                  }}
                />

                {/* Inner dot */}
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={isOrigin || isDestination ? "10" : "6"}
                  fill={isPassed ? colors.accent.orange : colors.neutral.gray400}
                />

                {/* Station name */}
                <text
                  x={station.x}
                  y={station.y - 35}
                  textAnchor="middle"
                  fill={colors.neutral.white}
                  fontSize={isOrigin || isDestination ? "20" : "16"}
                  fontWeight="bold"
                  style={styles.stationText}
                  opacity={isRevealed ? 1 : 0}
                >
                  {station.name}
                </text>

                {/* Arrival time */}
                {station.arrival && (
                  <text
                    x={station.x}
                    y={station.y + 50}
                    textAnchor="middle"
                    fill={colors.neutral.white}
                    fontSize="14"
                    opacity="0.7"
                    fontFamily="monospace"
                  >
                    {station.arrival}
                  </text>
                )}
              </g>
            );
          })}

          {/* Animated train (appears during journey phase) */}
          {phase === 'journey' && (
            <g>
              {/* Train glow */}
              <circle
                cx={trainX}
                cy={trainY}
                r="30"
                fill={colors.primary.blue}
                opacity="0.3"
                style={styles.trainGlow}
              />

              {/* Train body */}
              <circle
                cx={trainX}
                cy={trainY}
                r="16"
                fill={colors.primary.blue}
                stroke={colors.neutral.white}
                strokeWidth="3"
                style={styles.trainIcon}
              />

              {/* Train emoji */}
              <text
                x={trainX}
                y={trainY - 35}
                textAnchor="middle"
                fontSize="32"
                style={styles.trainEmoji}
              >
                🚆
              </text>

              {/* Speed lines */}
              <line
                x1={trainX - 40}
                y1={trainY}
                x2={trainX - 60}
                y2={trainY}
                stroke={colors.neutral.white}
                strokeWidth="2"
                opacity="0.4"
                style={styles.speedLine}
              />
              <line
                x1={trainX - 40}
                y1={trainY - 10}
                x2={trainX - 55}
                y2={trainY - 10}
                stroke={colors.neutral.white}
                strokeWidth="2"
                opacity="0.3"
                style={styles.speedLine}
              />
              <line
                x1={trainX - 40}
                y1={trainY + 10}
                x2={trainX - 55}
                y2={trainY + 10}
                stroke={colors.neutral.white}
                strokeWidth="2"
                opacity="0.3"
                style={styles.speedLine}
              />
            </g>
          )}

          {/* Fog of War overlay */}
          {(phase === 'intro' || phase === 'reveal') && (
            <rect
              x="0"
              y="0"
              width="900"
              height="600"
              fill="url(#fogGradient)"
              style={{ transition: 'opacity 1s ease-out' }}
            />
          )}
        </svg>
      </div>

      {/* Text Overlays with Battlefield 1 style */}
      <div style={styles.textOverlay}>
        {phase === 'intro' && (
          <div style={styles.phaseText}>
            <div style={styles.operationBadge}>OPERATION</div>
            <h1 style={styles.bigText}>YOUR JOURNEY</h1>
            <div style={styles.dividerLine} />
            <p style={styles.subText}>Departing from {route.from}</p>
          </div>
        )}

        {phase === 'reveal' && (
          <div style={styles.phaseText}>
            <div style={styles.revealmessage}>
              <div style={styles.compassIcon}>⊕</div>
              <p style={styles.revealText}>Plotting route...</p>
            </div>
          </div>
        )}

        {phase === 'journey' && (
          <div style={styles.phaseText}>
            <div style={styles.progressContainer}>
              {/* Military-style progress indicator */}
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>EN ROUTE</span>
                <span style={styles.progressPercent}>{Math.round(progress)}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${progress}%`}} />
              </div>
              <div style={styles.routeStats}>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>DISTANCE</div>
                  <div style={styles.statValue}>{route.distance} km</div>
                </div>
                <div style={styles.statDivider}>|</div>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>DURATION</div>
                  <div style={styles.statValue}>~{route.duration}h</div>
                </div>
                <div style={styles.statDivider}>|</div>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>ETA</div>
                  <div style={styles.statValue}>{route.arrivalTime || '22:00'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 'arrival' && (
          <div style={styles.phaseText}>
            <div style={styles.operationBadge}>DESTINATION</div>
            <h1 style={styles.bigText}>{route.to}</h1>
            <div style={styles.dividerLine} />
            <p style={styles.subText}>Arrival: {route.arrivalTime || '22:00'}</p>
          </div>
        )}

        {phase === 'complete' && (
          <div style={styles.phaseText}>
            <div style={styles.checkmark}>✓</div>
            <h2 style={styles.completeText}>ROUTE CONFIRMED</h2>
          </div>
        )}
      </div>

      {/* Cinematic letterbox bars */}
      <div style={styles.letterboxTop} />
      <div style={styles.letterboxBottom} />

      {/* Corner decorations (BF1 style) */}
      <div style={styles.cornerTopLeft}>╔</div>
      <div style={styles.cornerTopRight}>╗</div>
      <div style={styles.cornerBottomLeft}>╚</div>
      <div style={styles.cornerBottomRight}>╝</div>

      {/* Inline CSS for animations */}
      <style>{`
        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }

        @keyframes checkmarkPop {
          0% { transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 107, 53, 0.6)); }
          50% { filter: drop-shadow(0 0 20px rgba(255, 107, 53, 0.9)); }
        }

        @keyframes filmGrainAnim {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }

        @keyframes speedLineDash {
          from { transform: translateX(0); opacity: 0.6; }
          to { transform: translateX(-20px); opacity: 0; }
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
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  filmGrain: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
    opacity: 0.15,
    pointerEvents: 'none',
    zIndex: 10,
    animation: 'filmGrainAnim 8s steps(10) infinite',
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.8) 100%)',
    pointerEvents: 'none',
    zIndex: 9,
  },
  mapContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transformOrigin: 'center center',
  },
  svg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    filter: 'contrast(1.1) brightness(0.95)',
  },
  routePath: {
    transition: 'stroke-dashoffset 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    animation: 'glow 2s ease-in-out infinite',
  },
  stationGlow: {
    animation: 'pulse 3s ease-in-out infinite',
  },
  stationMarker: {
    transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  stationText: {
    textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.8)',
    transition: 'opacity 0.8s ease-out',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.05em',
  },
  trainIcon: {
    filter: 'drop-shadow(0 0 12px rgba(0, 102, 204, 0.9))',
    transition: 'all 0.3s ease-out',
  },
  trainGlow: {
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  trainEmoji: {
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
  },
  speedLine: {
    animation: 'speedLineDash 0.5s linear infinite',
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
    zIndex: 11,
    pointerEvents: 'none',
  },
  phaseText: {
    textAlign: 'center',
    animation: 'fadeInText 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    color: colors.neutral.white,
  },
  operationBadge: {
    display: 'inline-block',
    padding: '8px 24px',
    background: 'rgba(255, 107, 53, 0.2)',
    border: `2px solid ${colors.accent.orange}`,
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '0.2em',
    marginBottom: spacing.lg,
    fontFamily: "'Courier New', monospace",
  },
  bigText: {
    fontSize: '4rem',
    fontWeight: 900,
    margin: `${spacing.md} 0`,
    textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 0 20px rgba(255,107,53,0.3)',
    letterSpacing: '0.1em',
    fontFamily: "'Georgia', serif",
    textTransform: 'uppercase',
  },
  dividerLine: {
    width: '200px',
    height: '2px',
    background: colors.accent.orange,
    margin: `${spacing.md} auto`,
    boxShadow: '0 0 10px rgba(255, 107, 53, 0.5)',
  },
  subText: {
    fontSize: typography.scale.xl,
    margin: 0,
    opacity: 0.9,
    textShadow: '0 2px 6px rgba(0,0,0,0.8)',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.05em',
  },
  revealmessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.md,
  },
  compassIcon: {
    fontSize: '60px',
    animation: 'pulse 2s ease-in-out infinite',
    textShadow: '0 0 20px rgba(255, 107, 53, 0.8)',
  },
  revealText: {
    fontSize: typography.scale['2xl'],
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.1em',
    textShadow: '0 2px 8px rgba(0,0,0,0.9)',
  },
  progressContainer: {
    width: '500px',
    maxWidth: '85vw',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    fontFamily: "'Courier New', monospace",
  },
  progressLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.2em',
    color: colors.accent.orange,
  },
  progressPercent: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  progressBar: {
    width: '100%',
    height: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: `2px solid ${colors.accent.orange}`,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${colors.accent.orange} 0%, #ff8c42 100%)`,
    transition: 'width 0.3s ease-out',
    boxShadow: `0 0 20px ${colors.accent.orange}`,
  },
  routeStats: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: spacing.lg,
    fontFamily: "'Courier New', monospace",
  },
  statItem: {
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '12px',
    opacity: 0.7,
    letterSpacing: '0.15em',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: colors.accent.orange,
  },
  statDivider: {
    fontSize: '20px',
    opacity: 0.3,
  },
  checkmark: {
    fontSize: '100px',
    color: colors.semantic.success,
    animation: 'checkmarkPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    marginBottom: spacing.md,
    textShadow: '0 0 30px rgba(76, 175, 80, 0.8)',
  },
  completeText: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: 0,
    letterSpacing: '0.2em',
    fontFamily: "'Courier New', monospace",
    textShadow: '0 4px 12px rgba(0,0,0,0.9)',
  },
  letterboxTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100px',
    background: 'linear-gradient(180deg, #000 0%, transparent 100%)',
    zIndex: 12,
  },
  letterboxBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100px',
    background: 'linear-gradient(0deg, #000 0%, transparent 100%)',
    zIndex: 12,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: '100px',
    left: '40px',
    fontSize: '40px',
    color: colors.accent.orange,
    opacity: 0.4,
    zIndex: 13,
    fontFamily: 'monospace',
  },
  cornerTopRight: {
    position: 'absolute',
    top: '100px',
    right: '40px',
    fontSize: '40px',
    color: colors.accent.orange,
    opacity: 0.4,
    zIndex: 13,
    fontFamily: 'monospace',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: '100px',
    left: '40px',
    fontSize: '40px',
    color: colors.accent.orange,
    opacity: 0.4,
    zIndex: 13,
    fontFamily: 'monospace',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: '100px',
    right: '40px',
    fontSize: '40px',
    color: colors.accent.orange,
    opacity: 0.4,
    zIndex: 13,
    fontFamily: 'monospace',
  },
};

export default RouteAnimation;
