// client/src/components/booking/RouteSelector.jsx
import { useState } from "react";
import { getRouteData } from "../../constants/longDistanceRoutes";
import { SA_PROVINCES } from "../../constants/saProvinces";

/**
 * Interactive Railway Map of South Africa
 * Uses real MapSVG province paths (CC0 license, Mercator projection)
 * City positions calculated from GPS via same projection
 */
const RouteSelector = ({ onRouteSelect }) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);

  // City positions calculated from GPS coordinates using the same Mercator projection
  // as the MapSVG source (geoViewBox: 16.456213 -22.124926 38.006131 -46.984558)
  const cities = [
    { id: 'cape-town', name: 'Cape Town', x: 51, y: 346, region: 'Western Cape', bookable: true },
    { id: 'johannesburg', name: 'Johannesburg', x: 301, y: 116, region: 'Gauteng', bookable: true },
    { id: 'pretoria', name: 'Pretoria', x: 306, y: 103, region: 'Gauteng', bookable: true },
    { id: 'durban', name: 'Durban', x: 378, y: 223, region: 'KwaZulu-Natal', bookable: true },
    { id: 'port-elizabeth', name: 'Port Elizabeth', x: 238, y: 348, region: 'Eastern Cape', bookable: true },
    { id: 'east-london', name: 'East London', x: 298, y: 319, region: 'Eastern Cape', bookable: true },
    { id: 'bloemfontein', name: 'Bloemfontein', x: 253, y: 201, region: 'Free State', bookable: true },
    // Intermediate stops (visible, not selectable)
    { id: 'worcester', name: 'Worcester', x: 78, y: 338, region: 'Western Cape', bookable: false },
    { id: 'kimberley', name: 'Kimberley', x: 216, y: 189, region: 'Northern Cape', bookable: false },
    { id: 'de-aar', name: 'De Aar', x: 196, y: 246, region: 'Northern Cape', bookable: false },
    { id: 'kroonstad', name: 'Kroonstad', x: 280, y: 158, region: 'Free State', bookable: false },
    { id: 'pietermaritzburg', name: 'P.Maritzburg', x: 362, y: 215, region: 'KwaZulu-Natal', bookable: false },
    { id: 'ladysmith', name: 'Ladysmith', x: 346, y: 184, region: 'KwaZulu-Natal', bookable: false },
  ];

  // Railway connections
  const railwayLines = [
    ['cape-town', 'worcester'], ['worcester', 'de-aar'], ['de-aar', 'kimberley'],
    ['kimberley', 'bloemfontein'], ['bloemfontein', 'kroonstad'], ['kroonstad', 'johannesburg'],
    ['johannesburg', 'pretoria'],
    ['johannesburg', 'ladysmith'], ['ladysmith', 'pietermaritzburg'], ['pietermaritzburg', 'durban'],
    ['bloemfontein', 'ladysmith'],
    ['de-aar', 'port-elizabeth'],
    ['bloemfontein', 'east-london'],
  ];

  // Province label positions (centered inside each province)
  const provinceLabels = {
    'ZA-WC': { x: 100, y: 395, label: 'Western Cape' },
    'ZA-NC': { x: 130, y: 230, label: 'Northern Cape' },
    'ZA-EC': { x: 255, y: 310, label: 'Eastern Cape' },
    'ZA-FS': { x: 260, y: 168, label: 'Free State' },
    'ZA-NL': { x: 385, y: 195, label: 'KZN' },
    'ZA-GT': { x: 330, y: 118, label: 'Gauteng', size: 7 },
    'ZA-NW': { x: 240, y: 95, label: 'North West' },
    'ZA-LP': { x: 330, y: 45, label: 'Limpopo' },
    'ZA-MP': { x: 380, y: 85, label: 'Mpumalanga' },
    'LS':    { x: 305, y: 230, label: 'Lesotho', size: 7 },
  };

  const getCityById = (id) => cities.find(c => c.id === id);
  const getLineCoords = (f, t) => {
    const a = getCityById(f), b = getCityById(t);
    return a && b ? { x1: a.x, y1: a.y, x2: b.x, y2: b.y } : null;
  };

  const isLineOnRoute = (fromId, toId) => {
    if (!origin || !destination) return false;
    const r = getRouteData(origin.id, destination.id);
    if (!r) return false;
    const stops = [r.from, ...(r.intermediateStops || []).map(s => s.station), r.to]
      .map(s => s.toLowerCase().replace(/\s+/g, '-'));
    const fi = stops.indexOf(fromId), ti = stops.indexOf(toId);
    return fi !== -1 && ti !== -1 && Math.abs(fi - ti) === 1;
  };

  const isOnSelectedRoute = (cityId) => {
    if (!origin || !destination) return false;
    if (cityId === origin.id || cityId === destination.id) return true;
    const r = getRouteData(origin.id, destination.id);
    if (!r) return false;
    return (r.intermediateStops || []).map(s => s.station.toLowerCase().replace(/\s+/g, '-')).includes(cityId);
  };

  const handleCityClick = (city) => {
    if (!city.bookable) return;
    if (!origin) { setOrigin(city); }
    else if (origin.id === city.id) { setOrigin(null); setDestination(null); }
    else if (!destination) {
      setDestination(city);
      const r = getRouteData(origin.id, city.id);
      if (onRouteSelect) onRouteSelect({
        from: origin.name, to: city.name, fromId: origin.id, toId: city.id,
        distance: r?.distance || 0, duration: r?.duration || 0,
        intermediateStops: r?.intermediateStops || [],
      });
    } else { setOrigin(city); setDestination(null); }
  };

  const getLabelOffset = (id) => ({
    'cape-town':        { dx: -8, dy: -12, anchor: 'end' },
    'worcester':        { dx: 8, dy: -8, anchor: 'start' },
    'johannesburg':     { dx: 10, dy: -4, anchor: 'start' },
    'pretoria':         { dx: 10, dy: -2, anchor: 'start' },
    'durban':           { dx: 10, dy: 10, anchor: 'start' },
    'port-elizabeth':   { dx: 0, dy: 14, anchor: 'middle' },
    'east-london':      { dx: 10, dy: -4, anchor: 'start' },
    'bloemfontein':     { dx: 10, dy: -8, anchor: 'start' },
    'kimberley':        { dx: -8, dy: -6, anchor: 'end' },
    'de-aar':           { dx: -8, dy: 4, anchor: 'end' },
    'kroonstad':        { dx: -8, dy: -4, anchor: 'end' },
    'pietermaritzburg': { dx: 8, dy: -2, anchor: 'start' },
    'ladysmith':        { dx: -8, dy: -4, anchor: 'end' },
  }[id] || { dx: 0, dy: -10, anchor: 'middle' });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Select Your Journey</h2>
        <p style={styles.subtitle}>
          {!origin && "Choose your departure city"}
          {origin && !destination && (<>From <span style={styles.hl}>{origin.name}</span> — now choose your destination</>)}
          {origin && destination && (<><span style={styles.hl}>{origin.name}</span> → <span style={styles.hl}>{destination.name}</span></>)}
        </p>
      </div>

      <div style={styles.mapWrap}>
        <svg viewBox="-15 -10 470 440" style={styles.svg} role="img" aria-label="South African railway network map">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Ocean background */}
          <rect x="-15" y="-10" width="470" height="440" fill="#dce8ef" rx="4" />

          {/* Province fills */}
          {SA_PROVINCES.map((prov) => (
            <path key={`fill-${prov.id}`} d={prov.d}
              fill={prov.id === 'LS' ? '#e2dcd0' : '#f0ebe1'}
              stroke={prov.id === 'LS' ? '#e2dcd0' : '#f0ebe1'}
              strokeWidth="5" strokeLinejoin="round"
              style={{ paintOrder: 'stroke' }} />
          ))}
          {/* Province borders */}
          {SA_PROVINCES.map((prov) => (
            <path key={`border-${prov.id}`} d={prov.d}
              fill="none" stroke="#d4cfc5" strokeWidth="0.5" strokeLinejoin="round" />
          ))}

          {/* Province labels */}
          {SA_PROVINCES.map((prov) => {
            const lbl = provinceLabels[prov.id];
            if (!lbl) return null;
            return (
              <text key={`lbl-${prov.id}`}
                x={lbl.x} y={lbl.y}
                fill="#ccc8bc" fontSize={lbl.size || 8}
                fontStyle="italic" fontFamily="Georgia,serif"
                textAnchor="middle"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {lbl.label}
              </text>
            );
          })}

          {/* Railway lines */}
          {railwayLines.map(([f, t], i) => {
            const c = getLineCoords(f, t);
            if (!c) return null;
            const on = isLineOnRoute(f, t);
            return <line key={`r${i}`} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke={on ? '#F97316' : '#bfb9ad'} strokeWidth={on ? 2 : 0.8}
              strokeLinecap="round" strokeDasharray={on ? 'none' : '3,2'}
              opacity={on ? 1 : 0.6} style={{ transition: 'all 0.4s ease' }} />;
          })}

          {/* Animated route */}
          {origin && destination && railwayLines.map(([f, t], i) => {
            if (!isLineOnRoute(f, t)) return null;
            const c = getLineCoords(f, t);
            if (!c) return null;
            return <line key={`a${i}`} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3"
              style={{ animation: 'routeDash 1.5s linear infinite' }} />;
          })}

          {/* City markers */}
          {cities.map((city) => {
            const isO = origin?.id === city.id, isD = destination?.id === city.id;
            const isH = hoveredCity === city.id, isSel = isO || isD;
            const onR = isOnSelectedRoute(city.id);
            const lb = getLabelOffset(city.id);
            const bs = city.bookable ? 4.5 : 2.5;
            const sz = isSel ? bs + 2.5 : (isH && city.bookable) ? bs + 1.5 : bs;
            let fl = city.bookable ? '#3B6B8A' : '#a0a89b';
            if (isO) fl = '#F97316'; else if (isD) fl = '#10B981'; else if (onR) fl = '#F59E0B';

            return (
              <g key={city.id} style={{ cursor: city.bookable ? 'pointer' : 'default' }}
                onClick={() => handleCityClick(city)}
                onMouseEnter={() => setHoveredCity(city.id)}
                onMouseLeave={() => setHoveredCity(null)}
                onTouchStart={() => setHoveredCity(city.id)}
                onTouchEnd={() => setHoveredCity(null)}>
                {city.bookable && <circle cx={city.x} cy={city.y} r="14" fill="transparent" />}
                {isSel && <circle cx={city.x} cy={city.y} r={sz + 5} fill="none"
                  stroke={isO ? '#F97316' : '#10B981'} strokeWidth="1" opacity="0.4"
                  style={{ animation: 'pulse 2s ease-in-out infinite' }} />}
                {isH && city.bookable && !isSel && <circle cx={city.x} cy={city.y} r={sz + 4} fill={fl} opacity="0.15" />}
                <circle cx={city.x} cy={city.y} r={sz} fill={fl} stroke="#fff"
                  strokeWidth={isSel ? 1.5 : city.bookable ? 1 : 0.6}
                  filter={isSel ? 'url(#glow)' : 'none'}
                  style={{ transition: 'all 0.3s ease', pointerEvents: 'none' }} />
                {city.bookable && !isSel && <circle cx={city.x} cy={city.y} r={bs - 2} fill="#fff" opacity="0.4" style={{ pointerEvents: 'none' }} />}
                <text x={city.x + lb.dx} y={city.y + lb.dy} textAnchor={lb.anchor}
                  fill={isSel ? '#1a1a1a' : onR ? '#92400e' : city.bookable ? '#3a3a3a' : '#8a8a8a'}
                  fontSize={city.bookable ? '7.5' : '6'}
                  fontWeight={isSel ? '700' : city.bookable ? '600' : '400'}
                  fontFamily="'Segoe UI',system-ui,sans-serif"
                  style={{ pointerEvents: 'none', userSelect: 'none', transition: 'all 0.3s ease' }}>
                  {city.name}
                </text>
                {isH && city.bookable && <text x={city.x + lb.dx} y={city.y + lb.dy + 9}
                  textAnchor={lb.anchor} fill="#999" fontSize="5.5" style={{ pointerEvents: 'none' }}>
                  {city.region}
                </text>}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Route Info */}
      {origin && destination && (
        <div style={styles.info}>
          <div style={styles.infoHeader}>
            <div style={styles.ep}>
              <div style={{ ...styles.dot, background: '#F97316' }} />
              <div><div style={styles.cn}>{origin.name}</div><div style={styles.rg}>{origin.region}</div></div>
            </div>
            <svg width="40" height="12" viewBox="0 0 40 12" style={{ flexShrink: 0 }}>
              <line x1="0" y1="6" x2="32" y2="6" stroke="#ccc" strokeWidth="2" />
              <polygon points="30,2 38,6 30,10" fill="#ccc" />
            </svg>
            <div style={styles.ep}>
              <div style={{ ...styles.dot, background: '#10B981' }} />
              <div><div style={styles.cn}>{destination.name}</div><div style={styles.rg}>{destination.region}</div></div>
            </div>
          </div>
          <div style={styles.stats}>
            {(() => { const r = getRouteData(origin.id, destination.id); return (<>
              <div style={styles.st}><div style={styles.sv}>{r?.distance || '—'} km</div><div style={styles.sl}>Distance</div></div>
              <div style={styles.sd} />
              <div style={styles.st}><div style={styles.sv}>{r?.duration || '—'} hrs</div><div style={styles.sl}>Duration</div></div>
              <div style={styles.sd} />
              <div style={styles.st}><div style={styles.sv}>{(r?.intermediateStops?.length || 0) + 2}</div><div style={styles.sl}>Stops</div></div>
            </>); })()}
          </div>
          <button style={styles.btn}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,107,138,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,107,138,0.25)'; }}>
            Continue to Date & Time
          </button>
        </div>
      )}

      <div style={styles.legend}>
        <div style={styles.li}><div style={{ ...styles.ld, background: '#3B6B8A' }} /><span style={styles.lt}>Terminal station</span></div>
        <div style={styles.li}><div style={{ ...styles.ld, background: '#a0a89b', width: '7px', height: '7px' }} /><span style={styles.lt}>Intermediate stop</span></div>
        <div style={styles.li}><div style={{ ...styles.ld, background: '#F97316' }} /><span style={styles.lt}>Departure</span></div>
        <div style={styles.li}><div style={{ ...styles.ld, background: '#10B981' }} /><span style={styles.lt}>Arrival</span></div>
      </div>

      {origin && <button style={styles.reset} onClick={() => { setOrigin(null); setDestination(null); }}>Reset Selection</button>}

      <style>{`
        @keyframes routeDash { to { stroke-dashoffset: -16; } }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.1; } }
      `}</style>
    </div>
  );
};

const styles = {
  container: { width: '100%', maxWidth: '900px', margin: '0 auto', padding: 'clamp(1rem,3vw,2rem)' },
  header: { textAlign: 'center', marginBottom: 'clamp(1rem,3vw,1.5rem)' },
  title: { fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px 0', letterSpacing: '-0.02em' },
  subtitle: { fontSize: 'clamp(0.9rem,2.5vw,1.1rem)', color: '#666', margin: 0, lineHeight: 1.5 },
  hl: { color: '#3B6B8A', fontWeight: 600 },
  mapWrap: { background: '#faf9f6', borderRadius: '16px', padding: 'clamp(4px,1.5vw,12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.06),0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #e8e4de', marginBottom: 'clamp(1rem,3vw,1.5rem)', touchAction: 'manipulation' },
  svg: { width: '100%', height: 'auto', minHeight: '280px', display: 'block' },
  info: { background: '#fff', borderRadius: '16px', padding: 'clamp(1rem,3vw,1.5rem)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e8e4de', marginBottom: '1rem' },
  infoHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '8px' },
  ep: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 },
  dot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 },
  cn: { fontSize: 'clamp(0.95rem,2.5vw,1.1rem)', fontWeight: 700, color: '#1a1a1a' },
  rg: { fontSize: '0.75rem', color: '#999' },
  stats: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0', borderTop: '1px solid #f0ebe3', borderBottom: '1px solid #f0ebe3', marginBottom: '1rem' },
  st: { flex: 1, textAlign: 'center' },
  sv: { fontSize: 'clamp(1.1rem,3vw,1.3rem)', fontWeight: 700, color: '#3B6B8A' },
  sl: { fontSize: '0.75rem', color: '#999', marginTop: '2px' },
  sd: { width: '1px', height: '32px', background: '#e8e4de' },
  btn: { width: '100%', padding: 'clamp(12px,2vw,16px)', background: '#3B6B8A', color: '#fff', border: 'none', borderRadius: '12px', fontSize: 'clamp(0.95rem,2.5vw,1.05rem)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(59,107,138,0.25)', minHeight: '48px' },
  legend: { display: 'flex', justifyContent: 'center', gap: 'clamp(12px,3vw,24px)', flexWrap: 'wrap', marginBottom: '0.5rem' },
  li: { display: 'flex', alignItems: 'center', gap: '6px' },
  ld: { width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', flexShrink: 0 },
  lt: { fontSize: 'clamp(0.7rem,2vw,0.8rem)', color: '#888', whiteSpace: 'nowrap' },
  reset: { display: 'block', margin: '8px auto 0', padding: '6px 16px', background: 'transparent', border: '1px solid #d1ccc4', borderRadius: '8px', color: '#888', fontSize: '0.8rem', cursor: 'pointer' },
};

export default RouteSelector;
