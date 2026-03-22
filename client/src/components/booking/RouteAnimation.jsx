// client/src/components/booking/RouteAnimation3D.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from 'three';
import { getLandmarkForCity, getTransitionTerrain } from "../../constants/landmarks";

/**
 * CINEMATIC ROUTE ANIMATION
 * BF1 Operations-style city flyovers with terrain fly-through transitions
 * 
 * Fully dynamic — builds station list from route prop:
 *   route.from + route.intermediateStops + route.to
 * Timeline: Station → Fog Out → Fly-Through Terrain → Fog In → Station → ...
 */
const RouteAnimation = ({ route, onComplete }) => {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasInitialized = useRef(false);
  const isMountedRef = useRef(true);
  
  const stationNameRef = useRef(null);
  const progressFillRef = useRef(null);
  
  const [isSkippable, setIsSkippable] = useState(false);

  // Build stations dynamically from route prop
  const stations = useMemo(() => {
    const from = route?.from || 'Cape Town';
    const to = route?.to || 'Johannesburg';
    const intermediateStops = route?.intermediateStops || [];
    
    // Build ordered city list: from → intermediates → to
    const cityNames = [
      from,
      ...intermediateStops.map(stop => stop.station),
      to,
    ];
    
    console.log(`🗺️ Route: ${from} → ${to}`);
    console.log(`🚉 Stops: ${cityNames.join(' → ')}`);
    
    return cityNames.map((name, index) => ({
      name,
      duration: index === 0 ? 15000 : 10000,
      position: { x: 0, y: 0, z: 0 },
    }));
  }, [route]);

  // Transition timing
  const fogOutDuration = 1500;
  const flyThroughDuration = 5000;
  const fogInDuration = 1500;

  // Pre-build timeline
  const timeline = useRef([]);
  const totalDuration = useRef(0);
  
  useEffect(() => {
    let timeAccumulator = 0;
    const tl = [];
    for (let i = 0; i < stations.length; i++) {
      tl.push({
        type: 'station',
        index: i,
        start: timeAccumulator,
        duration: stations[i].duration
      });
      timeAccumulator += stations[i].duration;
      
      if (i < stations.length - 1) {
        tl.push({
          type: 'fog_out',
          from: i, to: i + 1,
          start: timeAccumulator,
          duration: fogOutDuration
        });
        timeAccumulator += fogOutDuration;
        
        tl.push({
          type: 'fly_through',
          from: i, to: i + 1,
          start: timeAccumulator,
          duration: flyThroughDuration
        });
        timeAccumulator += flyThroughDuration;
        
        tl.push({
          type: 'fog_in',
          from: i, to: i + 1,
          start: timeAccumulator,
          duration: fogInDuration
        });
        timeAccumulator += fogInDuration;
      }
    }
    timeline.current = tl;
    totalDuration.current = timeAccumulator;
    
    console.log('📅 Timeline built:', tl.length, 'phases');
    tl.forEach((p, i) => {
      const label = p.type === 'station' 
        ? `station ${p.index} (${stations[p.index].name})`
        : `${p.type} ${p.from}→${p.to}`;
      console.log(`  ${i}: ${label} | ${p.start}ms - ${p.start + p.duration}ms (${p.duration}ms)`);
    });
  }, [stations]);

  useEffect(() => {
    if (!mountRef.current || hasInitialized.current) return;
    
    hasInitialized.current = true;
    isMountedRef.current = true;

    const routeFrom = route?.from || 'Cape Town';
    const routeTo = route?.to || 'Johannesburg';
    console.log(`🎬 Starting cinematic route animation: ${routeFrom} → ${routeTo}`);

    // ===== SCENE SETUP =====
    const scene = new THREE.Scene();
    
    const skyGeometry = new THREE.SphereGeometry(3000, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x8e7a9e) },
        horizonColor: { value: new THREE.Color(0xe8b4b4) },
        bottomColor: { value: new THREE.Color(0xd4a5b8) },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 horizonColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          vec3 color;
          if (h > 0.0) {
            color = mix(horizonColor, topColor, h);
          } else {
            color = mix(bottomColor, horizonColor, (h + 1.0) / 1.0);
          }
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide
    });
    scene.add(new THREE.Mesh(skyGeometry, skyMaterial));
    
    scene.fog = new THREE.Fog(0xe8b4b4, 80, 200);

    const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 8000);
    camera.position.set(100, 50, 100);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const sunLight = new THREE.DirectionalLight(0xffd9b3, 1.5);
    sunLight.position.set(150, 250, 150);
    scene.add(sunLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6000, 6000),
      new THREE.MeshStandardMaterial({ color: 0xe8b4b4, roughness: 1.0, fog: true })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    scene.add(ground);

    // ===== LOAD STATION MODELS =====
    const stationGroups = [];
    stations.forEach((station) => {
      const group = new THREE.Group();
      group.position.set(station.position.x, station.position.y, station.position.z);
      group.userData.stationName = station.name;
      group.visible = false;
      
      console.log(`📦 Loading city: ${station.name}...`);
      getLandmarkForCity(station.name)(group);
      
      scene.add(group);
      stationGroups.push(group);
    });

    // ===== LOAD TRANSITION TERRAINS =====
    const transitionGroups = [];
    for (let i = 0; i < stations.length - 1; i++) {
      const group = new THREE.Group();
      group.visible = false;
      
      const fromCity = stations[i].name;
      const toCity = stations[i + 1].name;
      console.log(`📦 Loading transition: ${fromCity} → ${toCity}...`);
      getTransitionTerrain(fromCity, toCity)(group);
      
      scene.add(group);
      transitionGroups.push(group);
    }
    
    setTimeout(() => {
      if (stationGroups[0]) stationGroups[0].visible = true;
    }, 100);

    // ===== ANIMATION LOOP =====
    let startTime = null;
    let lastCameraPos = { x: 100, y: 50, z: 100 };
    let lastLoggedPercent = -1;
    let frameCount = 0;
    let lastFrameTime = null;
    let lastPhaseKey = '';
    let animationComplete = false;
    
    const smoothEase = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    
    const animate = (timestamp) => {
      if (!isMountedRef.current || animationComplete) return;
      
      if (startTime === null) {
        startTime = timestamp;
        lastFrameTime = timestamp;
        console.log(`⏱️ Animation clock started at RAF timestamp: ${timestamp.toFixed(0)}ms`);
      }
      
      const globalElapsed = timestamp - startTime;
      const frameDelta = timestamp - lastFrameTime;
      lastFrameTime = timestamp;
      frameCount++;
      
      if (frameDelta > 200) {
        console.warn(`⚠️ Large frame delta: ${frameDelta.toFixed(0)}ms at frame ${frameCount}`);
      }
      
      const tl = timeline.current;
      let currentPhase = null;
      let phaseElapsed = 0;
      
      for (const phase of tl) {
        if (globalElapsed >= phase.start && globalElapsed < phase.start + phase.duration) {
          currentPhase = phase;
          phaseElapsed = globalElapsed - phase.start;
          
          const phaseKey = `${phase.type}_${phase.index ?? phase.from}_${phase.to ?? ''}`;
          if (phaseKey !== lastPhaseKey) {
            lastPhaseKey = phaseKey;
            const label = phase.type === 'station' 
              ? `station ${phase.index} (${stations[phase.index].name})`
              : `${phase.type} ${stations[phase.from].name}→${stations[phase.to].name}`;
            console.log(`🎯 Phase: ${label} | ${phase.start}ms → ${phase.start + phase.duration}ms`);
          }
          break;
        }
      }
      
      if (!currentPhase) {
        console.log(`🎬 Animation complete! globalElapsed=${globalElapsed.toFixed(0)}ms`);
        animationComplete = true;
        setTimeout(() => { if (onComplete) onComplete(); }, 1000);
        return;
      }
      
      // Update UI
      const displayStationIndex = currentPhase.type === 'station' 
        ? currentPhase.index 
        : (currentPhase.type === 'fog_in' ? currentPhase.to : currentPhase.from);
      
      if (stationNameRef.current) {
        if (currentPhase.type === 'fly_through') {
          stationNameRef.current.textContent = '';
        } else {
          stationNameRef.current.textContent = stations[displayStationIndex]?.name || '';
        }
      }
      if (progressFillRef.current) {
        const pct = Math.min(100, (globalElapsed / totalDuration.current) * 100);
        progressFillRef.current.style.width = `${pct}%`;
      }
      
      // ===== RENDER CURRENT PHASE =====
      
      if (currentPhase.type === 'station') {
        const stationIndex = currentPhase.index;
        const station = stations[stationIndex];
        let progress = smoothEase(phaseElapsed / station.duration);
        
        const angle = progress * Math.PI * 1.2;
        
        let radius = 100;
        if (progress < 0.5) {
          radius = 120 - (progress * 40);
        } else {
          radius = 100 + ((progress - 0.5) * 40);
        }
        
        const isFirstStation = (stationIndex === 0);
        const height = isFirstStation ? 60 - (progress * 15) : 65 - (progress * 15);
        const lookAtY = isFirstStation ? 15 : 22;
        
        camera.position.x = Math.cos(angle) * radius;
        camera.position.y = height + Math.sin(progress * Math.PI * 2) * 3;
        camera.position.z = Math.sin(angle) * radius;
        camera.lookAt(0, lookAtY, 0);
        
        lastCameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        
        stationGroups.forEach((g, i) => { g.visible = (i === stationIndex); });
        transitionGroups.forEach(g => { g.visible = false; });
        
        scene.fog.near = 60;
        scene.fog.far = 180;
        
      } else if (currentPhase.type === 'fog_out') {
        const progress = phaseElapsed / fogOutDuration;
        const fromStation = currentPhase.from;
        
        const orbitAngle = Math.PI * 1.2;
        const baseAngle = orbitAngle + progress * Math.PI * 0.15;
        const radius = 120;
        const height = 50 + (progress * 10);
        
        camera.position.x = Math.cos(baseAngle) * radius;
        camera.position.y = height;
        camera.position.z = Math.sin(baseAngle) * radius;
        camera.lookAt(0, 20, 0);
        
        lastCameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        
        stationGroups.forEach((g, i) => { g.visible = (i === fromStation); });
        transitionGroups.forEach(g => { g.visible = false; });
        
        scene.fog.near = 60 - (progress * 55);
        scene.fog.far = 180 - (progress * 160);
        
      } else if (currentPhase.type === 'fly_through') {
        const progress = smoothEase(phaseElapsed / flyThroughDuration);
        const transIndex = currentPhase.from;
        
        const startZ = 100;
        const endZ = -80;
        const currentZ = startZ + (endZ - startZ) * progress;
        
        const flyHeight = 70 + Math.sin(progress * Math.PI) * 15;
        const weaveX = 20 + Math.sin(progress * Math.PI * 2) * 8;
        
        camera.position.set(weaveX, flyHeight, currentZ);
        camera.lookAt(15, 25, currentZ - 40);
        
        lastCameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        
        stationGroups.forEach(g => { g.visible = false; });
        transitionGroups.forEach((g, i) => { g.visible = (i === transIndex); });
        
        const fogClearness = Math.sin(progress * Math.PI);
        scene.fog.near = 8 + (fogClearness * 35);
        scene.fog.far = 35 + (fogClearness * 90);
        
      } else if (currentPhase.type === 'fog_in') {
        const progress = phaseElapsed / fogInDuration;
        const toStation = currentPhase.to;
        
        const radius = 120;
        const height = 60 + ((1 - progress) * 10);
        
        camera.position.x = Math.cos(0) * radius;
        camera.position.y = height;
        camera.position.z = Math.sin(0) * radius;
        
        const lookAtHeight = (toStation === 0) ? 15 : 22;
        camera.lookAt(0, lookAtHeight, 0);
        
        lastCameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        
        stationGroups.forEach((g, i) => { g.visible = (i === toStation); });
        transitionGroups.forEach(g => { g.visible = false; });
        
        scene.fog.near = 5 + (progress * 55);
        scene.fog.far = 20 + (progress * 160);
      }
      
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    setTimeout(() => setIsSkippable(true), 2000);
    console.log("🎬 Starting animation...");
    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMountedRef.current = false;
      hasInitialized.current = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onComplete, stations]);

  const handleSkip = () => { if (onComplete) onComplete(); };

  return (
    <div style={styles.container}>
      <div ref={mountRef} style={styles.canvas} />
      <div style={styles.overlay}>
        <div style={styles.stationInfo}>
          <div ref={stationNameRef} style={styles.stationName}>
            {stations[0]?.name || ''}
          </div>
          <div style={styles.progressBar}>
            <div ref={progressFillRef} style={{...styles.progressFill, width: '0%'}} />
          </div>
        </div>
        {isSkippable && (
          <button onClick={handleSkip} style={styles.skipButton}>
            Skip Animation →
          </button>
        )}
      </div>
      <div style={styles.vignette} />
      <div style={styles.filmGrain} />
    </div>
  );
};

const styles = {
  container: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, background: '#000', overflow: 'hidden' },
  canvas: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px' },
  stationInfo: { alignSelf: 'flex-start' },
  stationName: { fontSize: '4rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', textShadow: '0 4px 20px rgba(0,0,0,0.8)', marginBottom: '20px', fontFamily: "'Arial Black', sans-serif" },
  progressBar: { width: '400px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #4A90E2 0%, #10B981 100%)', transition: 'width 0.3s ease-out', boxShadow: '0 0 20px rgba(74, 144, 226, 0.8)' },
  skipButton: { alignSelf: 'flex-end', padding: '12px 24px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', pointerEvents: 'all', transition: 'all 0.3s ease', textTransform: 'uppercase', letterSpacing: '0.05em' },
  vignette: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.7) 100%)', pointerEvents: 'none' },
  filmGrain: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', opacity: 0.08, pointerEvents: 'none' },
};

export default RouteAnimation;
