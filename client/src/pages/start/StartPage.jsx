// client/src/pages/start/StartPage.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    url: "/images/cape_town.avif",
    city: "Cape Town",
    caption: "Cape Town & Table Mountain",
  },
  {
    url: "/images/johannesburg.avif",
    city: "Johannesburg",
    caption: "Johannesburg Skyline",
  },
  {
    url: "/images/durban.avif",
    city: "Durban",
    caption: "Durban Beachfront",
  },
];

function StartPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));

    // Preload images
    SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.url;
    });
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  return (
    <div style={styles.page}>
      {/* Top Navigation Bar */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logoGroup}>
            <svg width="44" height="44" viewBox="0 0 100 100" style={styles.logoSvg}>
              <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="3" />
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="50" y1="12"
                  x2="50" y2="38"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
              <circle cx="50" cy="50" r="8" fill="white" />
            </svg>
            <div>
              <div style={styles.logoText}>PRASA</div>
              <div style={styles.logoSub}>Passenger Rail Agency of South Africa</div>
            </div>
          </div>
          <div style={styles.navLinks}>
            <a href="/long-distance" style={styles.navLink}>Train Schedules</a>
            <a href="/commuter" style={styles.navLink}>Commuter</a>
            <a href="/admin-login" style={styles.navLink}>Admin</a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Photo Slideshow */}
      <div style={styles.hero}>
        {/* Slideshow Background */}
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            style={{
              ...styles.slideImage,
              backgroundImage: `url(${slide.url})`,
              opacity: currentSlide === index ? 1 : 0,
            }}
          />
        ))}

        {/* Dark overlay for text readability */}
        <div style={styles.heroOverlay} />

        {/* Hero Content */}
        <div style={{
          ...styles.heroContent,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        }}>
          <h1 style={styles.heroTitle}>Travel South Africa by Rail</h1>
          <p style={styles.heroSubtitle}>
            Book long-distance journeys and daily commuter trains across the nation's railway network
          </p>

          {/* Slide indicator dots */}
          <div style={styles.dotRow}>
            {SLIDES.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  ...styles.dot,
                  ...(currentSlide === index ? styles.dotActive : {}),
                }}
                aria-label={`Show ${slide.city}`}
              />
            ))}
          </div>
          <div style={styles.captionText}>
            {SLIDES[currentSlide].caption}
          </div>

          {/* Booking Cards */}
          <div style={styles.cardRow}>
            <div
              style={styles.card}
              onClick={() => navigate("/long-distance")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 24px 48px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
              }}
            >
              <div style={styles.cardAccent} />
              <div style={styles.cardBody}>
                <div style={styles.cardIconRow}>
                  <span style={styles.cardIcon}>🌍</span>
                  <span style={styles.cardBadge}>Shosholoza Meyl • Premier Classe</span>
                </div>
                <h3 style={styles.cardTitle}>Long-Distance</h3>
                <p style={styles.cardDesc}>Travel between cities with comfort and style</p>
                <div style={styles.cardRoutes}>
                  <span style={styles.routeChip}>Cape Town ↔ Johannesburg</span>
                  <span style={styles.routeChip}>Johannesburg ↔ Durban</span>
                  <span style={styles.routeChip}>Cape Town ↔ Durban</span>
                </div>
                <div style={styles.cardCta}>
                  Book Now <span style={styles.ctaArrow}>→</span>
                </div>
              </div>
            </div>

            <div
              style={styles.card}
              onClick={() => navigate("/commuter")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 24px 48px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
              }}
            >
              <div style={{ ...styles.cardAccent, background: 'linear-gradient(135deg, #FF6B35, #FFB84D)' }} />
              <div style={styles.cardBody}>
                <div style={styles.cardIconRow}>
                  <span style={styles.cardIcon}>🏙️</span>
                  <span style={{ ...styles.cardBadge, background: '#FFF3EB', color: '#FF6B35' }}>Metrorail</span>
                </div>
                <h3 style={styles.cardTitle}>Commuter</h3>
                <p style={styles.cardDesc}>Daily metro travel within major cities</p>
                <div style={styles.cardRoutes}>
                  <span style={styles.routeChip}>Cape Town Metro</span>
                  <span style={styles.routeChip}>Johannesburg Metro</span>
                  <span style={styles.routeChip}>Durban Metro</span>
                </div>
                <div style={{ ...styles.cardCta, color: '#FF6B35' }}>
                  Book Now <span style={styles.ctaArrow}>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Strip */}
      <div style={{
        ...styles.featureStrip,
        opacity: mounted ? 1 : 0,
        transition: 'opacity 1.2s ease 0.6s',
      }}>
        <div style={styles.featureItem}>
          <span style={styles.featureIcon}>🎫</span>
          <div>
            <div style={styles.featureLabel}>Mobile Tickets</div>
            <div style={styles.featureDesc}>Download your ticket instantly</div>
          </div>
        </div>
        <div style={styles.featureDivider} />
        <div style={styles.featureItem}>
          <span style={styles.featureIcon}>🪑</span>
          <div>
            <div style={styles.featureLabel}>Seat Selection</div>
            <div style={styles.featureDesc}>Choose your preferred seat</div>
          </div>
        </div>
        <div style={styles.featureDivider} />
        <div style={styles.featureItem}>
          <span style={styles.featureIcon}>🔒</span>
          <div>
            <div style={styles.featureLabel}>Secure Booking</div>
            <div style={styles.featureDesc}>Safe and reliable payments</div>
          </div>
        </div>
        <div style={styles.featureDivider} />
        <div style={styles.featureItem}>
          <span style={styles.featureIcon}>🚆</span>
          <div>
            <div style={styles.featureLabel}>6 Major Routes</div>
            <div style={styles.featureDesc}>Connecting SA's key cities</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <span style={styles.footerLogo}>PRASA</span>
            <span style={styles.footerTagline}>Passenger Rail Agency of South Africa</span>
          </div>
          <div style={styles.footerLinks}>
            <a href="/long-distance" style={styles.footerLink}>Long-Distance</a>
            <a href="/commuter" style={styles.footerLink}>Commuter</a>
            <a href="/admin-login" style={styles.footerLink}>Admin Portal</a>
          </div>
          <div style={styles.footerCopy}>
            © 2026 PRASA Demo — Built for demonstration purposes
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#001122',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // ── Nav ──
  nav: {
    background: '#0077CC',
    padding: '0 clamp(1rem, 3vw, 2rem)',
    position: 'relative',
    zIndex: 20,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
  },
  navInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoSvg: {
    flexShrink: 0,
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'white',
    letterSpacing: '0.15em',
    lineHeight: 1.1,
  },
  logoSub: {
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(1rem, 3vw, 2rem)',
  },
  navLink: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    transition: 'color 0.2s',
  },

  // ── Hero ──
  hero: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: 'max(580px, 75vh)',
  },
  slideImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'opacity 1.5s ease-in-out',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(0,20,40,0.5) 0%, rgba(0,10,20,0.65) 50%, rgba(0,10,20,0.85) 100%)',
    zIndex: 2,
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    padding: 'clamp(1rem, 3vw, 2rem)',
    maxWidth: '1100px',
    width: '100%',
    transition: 'opacity 1s ease, transform 1s ease',
  },
  heroTitle: {
    fontSize: 'clamp(1.75rem, 5vw, 3rem)',
    fontWeight: 700,
    color: 'white',
    margin: '0 0 0.75rem',
    letterSpacing: '-0.01em',
    textShadow: '0 2px 20px rgba(0,0,0,0.4)',
  },
  heroSubtitle: {
    fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)',
    color: 'rgba(255,255,255,0.85)',
    margin: '0 auto 1.25rem',
    maxWidth: '600px',
    lineHeight: 1.6,
    textShadow: '0 1px 8px rgba(0,0,0,0.3)',
  },

  // ── Slide indicators ──
  dotRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '0.4rem',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.6)',
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 0.3s ease',
  },
  dotActive: {
    background: 'white',
    borderColor: 'white',
    transform: 'scale(1.2)',
  },
  captionText: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '1.5rem',
    letterSpacing: '0.03em',
  },

  // ── Cards ──
  cardRow: {
    display: 'flex',
    gap: 'clamp(1rem, 3vw, 1.5rem)',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  card: {
    width: 'min(100%, 420px)',
    background: 'rgba(255,255,255,0.97)',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
    textAlign: 'left',
    backdropFilter: 'blur(10px)',
  },
  cardAccent: {
    height: '5px',
    background: 'linear-gradient(135deg, #003366, #0066CC)',
  },
  cardBody: {
    padding: 'clamp(1.25rem, 3vw, 1.75rem)',
  },
  cardIconRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  cardIcon: {
    fontSize: '1.75rem',
  },
  cardBadge: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#0066CC',
    background: '#E6F2FF',
    padding: '3px 10px',
    borderRadius: '20px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
    fontWeight: 700,
    color: '#1A1A1A',
    margin: '0 0 0.5rem',
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: '#4A4A4A',
    margin: '0 0 1rem',
    lineHeight: 1.5,
  },
  cardRoutes: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    marginBottom: '1.25rem',
  },
  routeChip: {
    fontSize: '0.75rem',
    color: '#4A4A4A',
    background: '#F5F5F5',
    padding: '5px 12px',
    borderRadius: '6px',
    fontWeight: 500,
  },
  cardCta: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#0066CC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaArrow: {
    fontSize: '1.25rem',
    transition: 'transform 0.3s ease',
  },

  // ── Features ──
  featureStrip: {
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(1rem, 3vw, 2.5rem)',
    padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1rem, 3vw, 2rem)',
    flexWrap: 'wrap',
    borderTop: '1px solid #eee',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  featureIcon: {
    fontSize: '1.5rem',
  },
  featureLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#1A1A1A',
  },
  featureDesc: {
    fontSize: '0.75rem',
    color: '#7D7D7D',
  },
  featureDivider: {
    width: '1px',
    height: '32px',
    background: '#E0E0E0',
  },

  // ── Footer ──
  footer: {
    background: '#1A2332',
    padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem)',
  },
  footerInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  footerLogo: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'white',
    letterSpacing: '0.1em',
  },
  footerTagline: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.5)',
  },
  footerLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  footerLink: {
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  footerCopy: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.35)',
    width: '100%',
    textAlign: 'center',
    marginTop: '0.5rem',
  },
};

export default StartPage;
