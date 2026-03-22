// client/src/components/booking/RouteSelector.jsx
import { useState } from "react";
import { colors, typography, spacing } from "../../styles/tokens";
import { getRouteData } from "../../constants/longDistanceRoutes";

const RouteSelector = ({ onRouteSelect }) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);

  const cities = [
    { id: 'cape-town', name: 'Cape Town', x: 150, y: 508, region: 'Western Cape', major: true },
    { id: 'worcester', name: 'Worcester', x: 192, y: 498, region: 'Western Cape', major: false },
    { id: 'johannesburg', name: 'Johannesburg', x: 546, y: 212, region: 'Gauteng', major: true },
    { id: 'pretoria', name: 'Pretoria', x: 554, y: 194, region: 'Gauteng', major: true },
    { id: 'durban', name: 'Durban', x: 669, y: 352, region: 'KwaZulu-Natal', major: true },
    { id: 'port-elizabeth', name: 'Port Elizabeth', x: 445, y: 510, region: 'Eastern Cape', major: true },
    { id: 'east-london', name: 'East London', x: 540, y: 474, region: 'Eastern Cape', major: true },
    { id: 'bloemfontein', name: 'Bloemfontein', x: 471, y: 324, region: 'Free State', major: true },
    { id: 'kimberley', name: 'Kimberley', x: 411, y: 309, region: 'Northern Cape', major: false },
    { id: 'de-aar', name: 'De Aar', x: 380, y: 383, region: 'Northern Cape', major: false },
    { id: 'kroonstad', name: 'Kroonstad', x: 513, y: 267, region: 'Free State', major: false },
    { id: 'pietermaritzburg', name: 'Pietermaritzburg', x: 642, y: 342, region: 'KwaZulu-Natal', major: false },
    { id: 'ladysmith', name: 'Ladysmith', x: 617, y: 302, region: 'KwaZulu-Natal', major: false },
  ];

  const saOutline = "M 71,308 C 80,315 88,322 95,331 C 100,350 105,365 108,377 C 114,393 119,405 124,415 C 127,425 130,432 132,438 C 131,448 129,458 128,465 C 133,475 137,484 141,492 C 144,498 147,503 149,508 C 149,512 149,516 149,519 C 150,522 152,525 153,527 C 170,538 188,542 206,542 C 210,542 213,542 215,542 C 235,540 256,535 276,527 C 292,522 305,517 318,512 C 370,508 410,506 445,504 C 480,495 510,486 540,473 C 568,450 588,432 606,415 C 625,395 642,375 659,358 C 663,356 666,355 668,354 C 680,335 692,318 701,300 C 715,280 727,272 738,262 C 741,252 744,245 746,238 C 733,225 721,214 709,204 C 707,195 706,188 705,181 C 699,158 694,142 688,127 C 660,105 633,88 606,81 C 598,72 592,65 585,58 C 560,58 542,58 524,58 C 516,59 509,60 503,62 C 478,80 459,95 441,108 C 400,122 358,135 318,146 C 278,158 246,168 215,177 C 215,195 215,210 215,223 C 200,255 187,278 174,300 C 150,305 130,306 112,308 C 98,308 84,308 71,308 Z";

  const lesothoOutline = "M 555,345 C 565,330 580,320 595,325 C 605,330 610,340 605,355 C 598,365 585,370 570,365 C 558,358 553,352 555,345 Z";

  const railwayLines = [
    ['cape-town', 'worcester'], ['worcester', 'de-aar'], ['de-aar', 'kimberley'],
    ['kimberley', 'bloemfontein'], ['bloemfontein', 'kroonstad'], ['kroonstad', 'johannesburg'],
    ['johannesburg', 'pretoria'], ['johannesburg', 'ladysmith'], ['ladysmith', 'pietermaritzburg'],
    ['pietermaritzburg', 'durban'], ['bloemfontein', 'ladysmith'], ['de-aar', 'port-elizabeth'],
    ['bloemfontein', 'east-london'],
  ];

  const getCityById = (id) => cities.find(c => c.id === id);
  const getLineCoords = (fromId, toId) => {
    const from = getCityById(fromId);
    const to = getCityById(toId);
    if (!from || !to) return null;
    return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
  };

  const isLineOnRoute = (fromId, toId) => {
    if (!origin || !destination) return false;
    const routeData = getRouteData(origin.id, destination.id);
    if (!routeData) return false;
    const allStops = [
      routeData.from.toLowerCase().replace(/\s+/g, '-'),
      ...(routeData.intermediateStops || []).map(s => s.station.toLowerCase().replace(/\s+/g, '-')),
      routeData.to.toLowerCase().replace(/\s+/g, '-'),
    ];
    const fromIdx = allStops.indexOf(fromId);
    const toIdx = allStops.indexOf(toId);
    if (fromIdx === -1 || toIdx === -1) return false;
    return Math.abs(fromIdx - toIdx) === 1;
  };

  const isOnSelectedRoute = (cityId) => {
    if (!origin || !destination) return false;
    if (cityId === origin.id || cityId === destination.id) return true;
    const routeData = getRouteData(origin.id, destination.id);
    if (!routeData) return false;
    return (routeData.intermediateStops || []).map(s => s.station.toLowerCase().replace(/\s+/g, '-')).includes(cityId);
  };

  const handleCityClick = (city) => {
    if (!origin) {
      setOrigin(city);
    } else if (origin.id === city.id) {
      setOrigin(null); setDestination(null);
    } else if (!destination) {
      setDestination(city);
      const routeData = getRouteData(origin.id, city.id);
      if (onRouteSelect) {
        onRouteSelect({
          from: origin.name, to: city.name, fromId: origin.id, toId: city.id,
          distance: routeData?.distance || 0, duration: routeData?.duration || 0,
          intermediateStops: routeData?.intermediateStops || [],
        });
      }
    } else {
      setOrigin(city); setDestination(null);
    }
  };

  const getLabelOffset = (id) => ({
    'cape-town': { dx: -12, dy: -16, anchor: 'end' },
    'worcester': { dx: 0, dy: 20, anchor: 'middle' },
    'johannesburg': { dx: 12, dy: -10, anchor: 'start' },
    'pretoria': { dx: 12, dy: -6, anchor: 'start' },
    'durban': { dx: 12, dy: 5, anchor: 'start' },
    'port-elizabeth': { dx: 0, dy: 22, anchor: 'middle' },
    'east-london': { dx: 12, dy: -8, anchor: 'start' },
    'bloemfontein': { dx: 12, dy: -12, anchor: 'start' },
    'kimberley': { dx: -12, dy: -10, anchor: 'end' },
    'de-aar': { dx: -12, dy: 5, anchor: 'end' },
    'kroonstad': { dx: -12, dy: -8, anchor: 'end' },
    'pietermaritzburg': { dx: 12, dy: 16, anchor: 'start' },
    'ladysmith': { dx: 12, dy: -8, anchor: 'start' },
  }[id] || { dx: 0, dy: -16, anchor: 'middle' });

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
        <svg viewBox="40 30 740 540" style={styles.svg}>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <rect x="40" y="30" width="740" height="540" fill="#e8f1f5" rx="8" />
          <path d={saOutline} fill="#f5f0e8" stroke="#c4bfb0" strokeWidth="1.5" />
          <path d={lesothoOutline} fill="#ebe6dc" stroke="#c4bfb0" strokeWidth="1" />
          <text x="578" y="348" fill="#b5af9f" fontSize="8" textAnchor="middle" fontStyle="italic">Lesotho</text>

          <text x="160" y="470" fill="#c4bfb0" fontSize="10" fontStyle="italic" fontFamily="Georgia,serif">Western Cape</text>
          <text x="530" y="180" fill="#c4bfb0" fontSize="10" fontStyle="italic" fontFamily="Georgia,serif">Gauteng</text>
          <text x="665" y="305" fill="#c4bfb0" fontSize="10" fontStyle="italic" fontFamily="Georgia,serif">KZN</text>
          <text x="440" y="285" fill="#c4bfb0" fontSize="10" fontStyle="italic" fontFamily="Georgia,serif">Free State</text>
          <text x="270" y="350" fill="#c4bfb0" fontSize="10" fontStyle="italic" fontFamily="Georgia,serif">Northern Cape</text>
          <text x="480" y="455" fill="#c4bfb0" fontSize="10" fontStyle="italic" fontFamily="Georgia,serif">Eastern Cape</text>
          <text x="380" y="130" fill="#c4bfb0" fontSize="10" fontStyle="italic" fontFamily="Georgia,serif">North West</text>
          <text x="610" y="90" fill="#c4bfb0" fontSize="10" fontStyle="italic" fontFamily="Georgia,serif">Limpopo</text>
          <text x="680" y="165" fill="#c4bfb0" fontSize="10" fontStyle="italic" fontFamily="Georgia,serif">Mpumalanga</text>

          {railwayLines.map(([f, t], i) => {
            const c = getLineCoords(f, t); if (!c) return null;
            const on = isLineOnRoute(f, t);
            return <line key={`r${i}`} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={on?'#F97316':'#c4bfb0'} strokeWidth={on?3.5:1.5} strokeLinecap="round" strokeDasharray={on?'none':'5,3'} opacity={on?1:0.6} style={{transition:'all 0.4s ease'}} />;
          })}

          {origin && destination && railwayLines.map(([f, t], i) => {
            if (!isLineOnRoute(f, t)) return null;
            const c = getLineCoords(f, t); if (!c) return null;
            return <line key={`a${i}`} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="8,5" style={{animation:'routeDash 1.5s linear infinite'}} />;
          })}

          {cities.map((city) => {
            const isO = origin?.id === city.id;
            const isD = destination?.id === city.id;
            const isH = hoveredCity === city.id;
            const isSel = isO || isD;
            const onR = isOnSelectedRoute(city.id);
            const lb = getLabelOffset(city.id);
            const bs = city.major ? 7 : 5;
            const sz = isSel ? bs+4 : isH ? bs+2 : bs;
            let fl = city.major ? '#3B6B8A' : '#8a9bae';
            if (isO) fl = '#F97316'; else if (isD) fl = '#10B981'; else if (onR) fl = '#F59E0B';

            return (
              <g key={city.id} style={{cursor:'pointer'}} onClick={() => handleCityClick(city)}
                onMouseEnter={() => setHoveredCity(city.id)} onMouseLeave={() => setHoveredCity(null)}
                onTouchStart={() => setHoveredCity(city.id)} onTouchEnd={() => setHoveredCity(null)}>
                <circle cx={city.x} cy={city.y} r="22" fill="transparent" />
                {isSel && <circle cx={city.x} cy={city.y} r={sz+8} fill="none" stroke={isO?'#F97316':'#10B981'} strokeWidth="1.5" opacity="0.4" style={{animation:'pulse 2s ease-in-out infinite'}} />}
                {isH && !isSel && <circle cx={city.x} cy={city.y} r={sz+6} fill={fl} opacity="0.15" />}
                <circle cx={city.x} cy={city.y} r={sz} fill={fl} stroke="#fff" strokeWidth={isSel?2.5:1.5} filter={isSel?'url(#glow)':'none'} style={{transition:'all 0.3s ease',pointerEvents:'none'}} />
                {city.major && !isSel && <circle cx={city.x} cy={city.y} r={bs-3} fill="#fff" opacity="0.5" style={{pointerEvents:'none'}} />}
                <text x={city.x+lb.dx} y={city.y+lb.dy} textAnchor={lb.anchor} fill={isSel?'#1a1a1a':onR?'#92400e':'#4a4a4a'} fontSize={city.major?'12':'10'} fontWeight={isSel?'700':city.major?'600':'400'} fontFamily="'Segoe UI',system-ui,sans-serif" style={{pointerEvents:'none',userSelect:'none',transition:'all 0.3s ease'}}>{city.name}</text>
                {isH && <text x={city.x+lb.dx} y={city.y+lb.dy+13} textAnchor={lb.anchor} fill="#999" fontSize="9" style={{pointerEvents:'none'}}>{city.region}</text>}
              </g>
            );
          })}
        </svg>
      </div>

      {origin && destination && (
        <div style={styles.info}>
          <div style={styles.infoHeader}>
            <div style={styles.ep}><div style={{...styles.dot,background:'#F97316'}} /><div><div style={styles.cn}>{origin.name}</div><div style={styles.rg}>{origin.region}</div></div></div>
            <svg width="40" height="12" viewBox="0 0 40 12"><line x1="0" y1="6" x2="32" y2="6" stroke="#ccc" strokeWidth="2" /><polygon points="30,2 38,6 30,10" fill="#ccc" /></svg>
            <div style={styles.ep}><div style={{...styles.dot,background:'#10B981'}} /><div><div style={styles.cn}>{destination.name}</div><div style={styles.rg}>{destination.region}</div></div></div>
          </div>
          <div style={styles.stats}>
            {(() => { const r = getRouteData(origin.id, destination.id); return (<>
              <div style={styles.st}><div style={styles.sv}>{r?.distance||'—'} km</div><div style={styles.sl}>Distance</div></div>
              <div style={styles.sd} />
              <div style={styles.st}><div style={styles.sv}>{r?.duration||'—'} hrs</div><div style={styles.sl}>Duration</div></div>
              <div style={styles.sd} />
              <div style={styles.st}><div style={styles.sv}>{(r?.intermediateStops?.length||0)+2}</div><div style={styles.sl}>Stops</div></div>
            </>); })()}
          </div>
          <button style={styles.btn} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 6px 20px rgba(59,107,138,0.35)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 12px rgba(59,107,138,0.25)';}}>Continue to Date & Time</button>
        </div>
      )}

      <div style={styles.legend}>
        <div style={styles.li}><div style={{...styles.ld,background:'#3B6B8A'}} /><span style={styles.lt}>Major station</span></div>
        <div style={styles.li}><div style={{...styles.ld,background:'#8a9bae',width:'8px',height:'8px'}} /><span style={styles.lt}>Stop</span></div>
        <div style={styles.li}><div style={{...styles.ld,background:'#F97316'}} /><span style={styles.lt}>Departure</span></div>
        <div style={styles.li}><div style={{...styles.ld,background:'#10B981'}} /><span style={styles.lt}>Arrival</span></div>
      </div>

      {origin && <button style={styles.reset} onClick={() => {setOrigin(null);setDestination(null);}}>Reset Selection</button>}

      <style>{`
        @keyframes routeDash { to { stroke-dashoffset: -26; } }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.1} }
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
