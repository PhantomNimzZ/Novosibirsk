// client/src/components/booking/RouteSelector.jsx
import { useState } from "react";
import { colors, typography, spacing } from "../../styles/tokens";

/**
 * Interactive Route Selector (Mobile-Responsive)
 * Displays a clickable map of South Africa with major city markers
 * Users click origin → destination to select their route
 */
const RouteSelector = ({ onRouteSelect }) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);

  // Major PRASA long-distance cities with coordinates
  const cities = [
    { id: 'cape-town', name: 'Cape Town', x: 200, y: 550, region: 'Western Cape' },
    { id: 'johannesburg', name: 'Johannesburg', x: 650, y: 300, region: 'Gauteng' },
    { id: 'durban', name: 'Durban', x: 700, y: 520, region: 'KwaZulu-Natal' },
    { id: 'pretoria', name: 'Pretoria', x: 650, y: 260, region: 'Gauteng' },
    { id: 'port-elizabeth', name: 'Port Elizabeth', x: 450, y: 650, region: 'Eastern Cape' },
    { id: 'bloemfontein', name: 'Bloemfontein', x: 500, y: 420, region: 'Free State' },
  ];

  const handleCityClick = (city) => {
    if (!origin) {
      setOrigin(city);
    } else if (origin.id === city.id) {
      setOrigin(null);
      setDestination(null);
    } else if (!destination) {
      setDestination(city);
      
      const distance = calculateDistance(origin, city);
      const duration = Math.round(distance / 80);
      
      if (onRouteSelect) {
        onRouteSelect({
          from: origin.name,
          to: city.name,
          fromId: origin.id,
          toId: city.id,
          distance,
          duration,
        });
      }
    } else {
      setOrigin(city);
      setDestination(null);
    }
  };

  const calculateDistance = (city1, city2) => {
    const dx = city2.x - city1.x;
    const dy = city2.y - city1.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    return Math.round(pixelDistance * 3);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Select Your Route</h2>
        <p style={styles.subtitle}>
          {!origin && "Tap your departure city"}
          {origin && !destination && `From ${origin.name} → Tap your destination`}
          {origin && destination && `${origin.name} → ${destination.name}`}
        </p>
      </div>

      {/* Map Container */}
      <div style={styles.mapContainer}>
        <svg viewBox="0 0 900 700" style={styles.svg}>
          {/* South Africa outline (simplified) */}
          <path
            d="M 150,300 L 200,250 L 300,220 L 400,200 L 500,200 L 600,210 L 700,240 L 750,300 L 800,400 L 800,500 L 750,580 L 650,640 L 550,670 L 450,680 L 350,670 L 250,630 L 180,560 L 150,450 Z"
            fill={colors.primary.pale}
            stroke={colors.primary.blue}
            strokeWidth="3"
            opacity="0.3"
          />

          {/* Route line (if both cities selected) */}
          {origin && destination && (
            <g>
              <line
                x1={origin.x}
                y1={origin.y}
                x2={destination.x}
                y2={destination.y}
                stroke={colors.accent.orange}
                strokeWidth="4"
                strokeDasharray="10,5"
                style={styles.routeLine}
              />
              {/* Animated train icon */}
              <circle
                cx={origin.x}
                cy={origin.y}
                r="6"
                fill={colors.accent.orange}
                style={styles.trainMarker}
              />
            </g>
          )}

          {/* City markers */}
          {cities.map((city) => {
            const isOrigin = origin?.id === city.id;
            const isDestination = destination?.id === city.id;
            const isHovered = hoveredCity === city.id;

            return (
              <g
                key={city.id}
                style={{ cursor: 'pointer' }}
                onClick={() => handleCityClick(city)}
                onMouseEnter={() => setHoveredCity(city.id)}
                onMouseLeave={() => setHoveredCity(null)}
                onTouchStart={() => setHoveredCity(city.id)}
                onTouchEnd={() => setHoveredCity(null)}
              >
                {/* Larger tap target for mobile (invisible) */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r="30"
                  fill="transparent"
                  style={{ pointerEvents: 'all' }}
                />

                {/* Outer glow on hover/touch */}
                {isHovered && (
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="30"
                    fill={colors.primary.blue}
                    opacity="0.2"
                    style={styles.hoverGlow}
                  />
                )}

                {/* City marker */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isOrigin || isDestination ? "16" : "12"}
                  fill={isOrigin ? colors.accent.orange : isDestination ? colors.semantic.success : colors.primary.blue}
                  stroke={colors.neutral.white}
                  strokeWidth="3"
                  style={{
                    ...styles.cityMarker,
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    transformOrigin: `${city.x}px ${city.y}px`,
                  }}
                />

                {/* City label */}
                <text
                  x={city.x}
                  y={city.y - 25}
                  textAnchor="middle"
                  fill={colors.neutral.black}
                  fontSize="14"
                  fontWeight={isOrigin || isDestination ? "700" : "500"}
                  style={styles.cityLabel}
                >
                  {city.name}
                </text>

                {/* Region label (on hover/touch) */}
                {isHovered && (
                  <text
                    x={city.x}
                    y={city.y + 35}
                    textAnchor="middle"
                    fill={colors.neutral.gray700}
                    fontSize="12"
                    opacity="0.8"
                  >
                    {city.region}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Route Info Panel */}
      {origin && destination && (
        <div style={styles.routeInfo}>
          <div style={styles.infoCard}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>From:</span>
              <span style={styles.infoValue}>{origin.name}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>To:</span>
              <span style={styles.infoValue}>{destination.name}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Distance:</span>
              <span style={styles.infoValue}>~{calculateDistance(origin, destination)} km</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Duration:</span>
              <span style={styles.infoValue}>~{Math.round(calculateDistance(origin, destination) / 80)} hours</span>
            </div>
          </div>

          <button
            style={styles.continueButton}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.primary.navy}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.primary.blue}
          >
            Continue to Dates →
          </button>
        </div>
      )}

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{...styles.legendDot, background: colors.accent.orange}}></div>
          <span style={styles.legendText}>Origin</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendDot, background: colors.semantic.success}}></div>
          <span style={styles.legendText}>Destination</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendDot, background: colors.primary.blue}}></div>
          <span style={styles.legendText}>Available</span>
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -1000; }
        }

        @keyframes trainMove {
          0% { cx: ${origin?.x || 0}; cy: ${origin?.y || 0}; }
          100% { cx: ${destination?.x || 0}; cy: ${destination?.y || 0}; }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }

        /* Mobile: Disable animations for performance */
        @media (max-width: 768px) {
          @keyframes dash {
            to { stroke-dashoffset: 0; }
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: 'clamp(1rem, 3vw, 2rem)', // Responsive padding
  },
  header: {
    textAlign: 'center',
    marginBottom: 'clamp(1rem, 3vw, 2rem)',
  },
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 1.875rem)', // Responsive
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.sm} 0`,
  },
  subtitle: {
    fontSize: 'clamp(0.875rem, 3vw, 1.125rem)', // Responsive
    color: colors.neutral.gray700,
    margin: 0,
    padding: '0 1rem', // Prevent edge touching
  },
  mapContainer: {
    background: colors.neutral.white,
    borderRadius: '20px',
    padding: 'clamp(0.5rem, 2vw, 1rem)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    marginBottom: 'clamp(1rem, 3vw, 2rem)',
    touchAction: 'manipulation', // Optimize touch
  },
  svg: {
    width: '100%',
    height: 'auto',
    minHeight: '300px', // Ensure visible on mobile
  },
  routeLine: {
    animation: 'dash 3s linear infinite',
  },
  trainMarker: {
    animation: 'trainMove 3s ease-in-out infinite alternate',
  },
  cityMarker: {
    transition: 'all 0.3s ease',
    transformOrigin: 'center',
    pointerEvents: 'none', // Let invisible circle handle clicks
  },
  cityLabel: {
    pointerEvents: 'none',
    userSelect: 'none',
  },
  hoverGlow: {
    animation: 'pulseGlow 2s ease-in-out infinite',
    pointerEvents: 'none',
    transformOrigin: 'center',
  },
  routeInfo: {
    background: colors.primary.pale,
    borderRadius: '16px',
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    border: `2px solid ${colors.primary.blue}`,
  },
  infoCard: {
    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${spacing.sm} 0`,
    borderBottom: `1px solid ${colors.primary.light}`,
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', // Responsive
  },
  infoLabel: {
    color: colors.neutral.gray700,
    fontWeight: typography.weight.medium,
  },
  infoValue: {
    color: colors.neutral.black,
    fontWeight: typography.weight.semibold,
  },
  continueButton: {
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
    background: colors.primary.blue,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: '12px',
    fontSize: 'clamp(1rem, 3vw, 1.125rem)', // Responsive
    fontWeight: typography.weight.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '44px', // Touch-friendly
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'clamp(0.75rem, 3vw, 1.5rem)',
    marginTop: 'clamp(0.75rem, 2vw, 1rem)',
    flexWrap: 'wrap', // Wrap on small screens
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: `2px solid ${colors.neutral.white}`,
    flexShrink: 0, // Prevent squishing
  },
  legendText: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', // Responsive
    color: colors.neutral.gray700,
    whiteSpace: 'nowrap',
  },
};

export default RouteSelector;
