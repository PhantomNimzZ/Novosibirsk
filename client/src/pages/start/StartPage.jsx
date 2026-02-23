// client/src/pages/start/StartPage.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { colors, typography, spacing } from "../../styles/tokens";

function StartPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={styles.container}>
      {/* Animated Background Map */}
      <div style={styles.backgroundMap}>
        <svg viewBox="0 0 1200 800" style={styles.svg}>
          {/* Simplified South Africa outline */}
          <path
            d="M 300,200 L 400,180 L 500,200 L 600,220 L 700,240 L 800,280 L 850,350 L 850,450 L 800,550 L 700,600 L 600,620 L 500,630 L 400,620 L 300,580 L 250,500 L 250,350 Z"
            fill="none"
            stroke={colors.primary.blue}
            strokeWidth="2"
            opacity="0.2"
            style={styles.mapPath}
          />
          
          {/* Animated train routes */}
          <line
            x1="300" y1="600"
            x2="850" y2="300"
            stroke={colors.accent.orange}
            strokeWidth="2"
            strokeDasharray="10,5"
            opacity="0.4"
            style={{...styles.routeLine, animationDelay: '0s'}}
          />
          <line
            x1="850" y1="300"
            x2="700" y2="580"
            stroke={colors.accent.orange}
            strokeWidth="2"
            strokeDasharray="10,5"
            opacity="0.4"
            style={{...styles.routeLine, animationDelay: '1s'}}
          />
          
          {/* City markers */}
          <circle cx="300" cy="600" r="8" fill={colors.primary.blue} style={styles.cityMarker} />
          <circle cx="850" cy="300" r="8" fill={colors.primary.blue} style={{...styles.cityMarker, animationDelay: '0.3s'}} />
          <circle cx="700" cy="580" r="8" fill={colors.primary.blue} style={{...styles.cityMarker, animationDelay: '0.6s'}} />
        </svg>
      </div>

      {/* Main Content */}
      <div style={{...styles.content, opacity: mounted ? 1 : 0}}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>🚆</div>
            <h1 style={styles.logo}>PRASA</h1>
          </div>
          <p style={styles.tagline}>South Africa's Railway Network</p>
        </div>

        {/* Hero Section */}
        <div style={styles.hero}>
          <h2 style={styles.heroTitle}>Book Your Journey</h2>
          <p style={styles.heroSubtitle}>
            Fast, reliable train travel across South Africa
          </p>
        </div>

        {/* Booking Options */}
        <div style={styles.cardContainer}>
          {/* Long-Distance Card */}
          <div
            style={{...styles.card, ...styles.cardLongDistance}}
            onClick={() => navigate("/long-distance")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 51, 102, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={styles.cardIcon}>🌍</div>
            <h3 style={styles.cardTitle}>Long-Distance</h3>
            <p style={styles.cardDescription}>
              Travel between cities with comfort and style
            </p>
            <div style={styles.cardRoutes}>
              <div style={styles.routeBadge}>Cape Town ↔ Johannesburg</div>
              <div style={styles.routeBadge}>Johannesburg ↔ Durban</div>
              <div style={styles.routeBadge}>Cape Town ↔ Durban</div>
            </div>
            <div style={styles.cardCTA}>
              <span style={styles.ctaText}>Book Now</span>
              <span style={styles.ctaArrow}>→</span>
            </div>
          </div>

          {/* Commuter Card */}
          <div
            style={{...styles.card, ...styles.cardCommuter}}
            onClick={() => navigate("/commuter")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={styles.cardIcon}>🏙️</div>
            <h3 style={styles.cardTitle}>Commuter</h3>
            <p style={styles.cardDescription}>
              Daily metro travel within major cities
            </p>
            <div style={styles.cardRoutes}>
              <div style={styles.routeBadge}>🏙️ Cape Town Metro</div>
              <div style={styles.routeBadge}>🏙️ Johannesburg Metro</div>
              <div style={styles.routeBadge}>🏙️ Durban Metro</div>
              <div style={styles.routeBadge}>🏙️ Pretoria Metro</div>
            </div>
            <div style={styles.cardCTA}>
              <span style={styles.ctaText}>Book Now</span>
              <span style={styles.ctaArrow}>→</span>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div style={styles.features}>
          <div style={styles.featurePill}>
            <span style={styles.featureIcon}>📍</span>
            <span style={styles.featureText}>Live Tracking</span>
          </div>
          <div style={styles.featurePill}>
            <span style={styles.featureIcon}>💳</span>
            <span style={styles.featureText}>Mobile Tickets</span>
          </div>
          <div style={styles.featurePill}>
            <span style={styles.featureIcon}>🌐</span>
            <span style={styles.featureText}>Offline Mode</span>
          </div>
        </div>

        {/* Admin Link (subtle, bottom corner) */}
        <a
          href="/admin-login"
          style={styles.adminLink}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.3'}
        >
          Admin
        </a>
      </div>

      {/* Inline CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes dash {
          to { stroke-dashoffset: -1000; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Responsive Adjustments */
        @media (max-width: 768px) {
          /* Reduce animation on mobile for performance */
          .map-path, .route-line, .city-marker {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// Styles object with mobile-first responsive design
const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${colors.primary.navy} 0%, ${colors.primary.blue} 100%)`,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.body,
  },
  backgroundMap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.15,
    pointerEvents: 'none',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  mapPath: {
    animation: 'float 8s ease-in-out infinite',
  },
  routeLine: {
    animation: 'dash 20s linear infinite',
  },
  cityMarker: {
    animation: 'pulse 3s ease-in-out infinite',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '1200px',
    padding: spacing.md, // Reduced for mobile
    transition: 'opacity 1s ease-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    flexWrap: 'wrap', // Wrap on very small screens
  },
  logoIcon: {
    fontSize: '2.5rem', // Fixed size for consistency
  },
  logo: {
    fontSize: 'clamp(2rem, 8vw, 3rem)', // Responsive font size
    fontWeight: typography.weight.bold,
    color: colors.neutral.white,
    margin: 0,
    letterSpacing: '0.1em',
  },
  tagline: {
    fontSize: 'clamp(0.875rem, 3vw, 1.125rem)', // Responsive
    color: colors.primary.pale,
    margin: 0,
    fontWeight: typography.weight.normal,
    padding: '0 1rem', // Prevent edge touching
  },
  hero: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    padding: '0 1rem',
  },
  heroTitle: {
    fontSize: 'clamp(1.75rem, 6vw, 2.25rem)', // Responsive
    fontWeight: typography.weight.bold,
    color: colors.neutral.white,
    margin: `0 0 ${spacing.sm} 0`,
  },
  heroSubtitle: {
    fontSize: 'clamp(0.875rem, 3vw, 1.25rem)', // Responsive
    color: colors.primary.pale,
    margin: 0,
    fontWeight: typography.weight.normal,
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', // Mobile-first grid
    gap: spacing.lg,
    marginBottom: spacing.xl,
    padding: '0 0.5rem', // Small side padding
  },
  card: {
    background: colors.neutral.white,
    borderRadius: '20px',
    padding: spacing.lg, // Reduced slightly for mobile
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '300px', // Ensure consistent height
  },
  cardLongDistance: {
    borderTop: `4px solid ${colors.primary.blue}`,
  },
  cardCommuter: {
    borderTop: `4px solid ${colors.accent.orange}`,
  },
  cardIcon: {
    fontSize: '2.5rem', // Fixed for consistency
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', // Responsive
    fontWeight: typography.weight.bold,
    color: colors.neutral.black,
    margin: `0 0 ${spacing.xs} 0`,
  },
  cardDescription: {
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', // Responsive
    color: colors.neutral.gray700,
    margin: `0 0 ${spacing.md} 0`,
    lineHeight: 1.6,
  },
  cardRoutes: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  routeBadge: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', // Responsive
    color: colors.neutral.gray700,
    padding: `${spacing.xs} ${spacing.sm}`,
    background: colors.neutral.gray100,
    borderRadius: '6px',
    display: 'inline-block',
  },
  cardCTA: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 'clamp(1rem, 3vw, 1.125rem)', // Responsive
    fontWeight: typography.weight.semibold,
    color: colors.primary.blue,
    marginTop: 'auto', // Push to bottom
  },
  ctaText: {},
  ctaArrow: {
    fontSize: '1.5rem', // Fixed size
    transition: 'transform 0.3s ease',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
    padding: '0 1rem',
  },
  featurePill: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.md}`,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50px',
    color: colors.neutral.white,
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', // Responsive
    border: '1px solid rgba(255, 255, 255, 0.2)',
    whiteSpace: 'nowrap', // Prevent text wrapping
  },
  featureIcon: {
    fontSize: '1rem', // Fixed size
  },
  featureText: {
    fontWeight: typography.weight.medium,
  },
  adminLink: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    color: colors.neutral.white,
    fontSize: typography.scale.xs,
    textDecoration: 'none',
    opacity: 0.3,
    transition: 'opacity 0.3s ease',
  },
};

export default StartPage;
