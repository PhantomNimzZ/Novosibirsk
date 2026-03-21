// client/src/components/booking/RouteAnimation3D.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getLandmarkForCity, getTransitionTerrain } from "../../constants/landmarks";
import { colors, typography, spacing } from "../../styles/tokens";

/**
 * CINEMATIC ROUTE ANIMATION
 * BF1 Operations-style city flyovers with terrain fly-through transitions
 * 
 * Timeline: Station → Fog Out → Fly-Through Terrain → Fog In → Station
 */
const RouteAnimation = ({ route, onComplete }) => {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasInitialized = useRef(false);
  const isMountedRef = useRef(true);
  
  const stationNameRef = useRef(null);
  const progressFillRef = useRef(null);
  
  const [isSkippable, setIsSkippable] = useState(false);

  // Define stations with durations
  const stations = [
    { 
      name: 'Cape Town',
      duration: 15000,
      position: { x: 0, y: 0, z: 0 }
    },
    { 
      name: 'Worcester',
      duration: 10000,
      position: { x: 0, y: 0, z: 0 }
    },
    { 
      name: 'De Aar',
      duration: 10000,
      position: { x: 0, y: 0, z: 0 }
    },
    { 
      name: 'Kimberley',
      duration: 10000,
      position: { x: 0, y: 0, z: 0 }
    },
    { 
      name: 'Bloemfontein',
      duration: 10000,
      position: { x: 0, y: 0, z: 0 }
    },
    { 
      name: 'Kroonstad',
      duration: 10000,
      position: { x: 0, y: 0, z: 0 }
    },
    { 
      name: 'Johannesburg',
      duration: 10000,
      position: { x: 0, y: 0, z: 0 }
    },
  ];

  // Transition timing
  const fogOutDuration = 1500;      // 1.5s fog thickens over current city
  const flyThroughDuration = 5000;  // 5s flying through mountain terrain
  const fogInDuration = 1500;       // 1.5s fog clears to reveal next city
  const totalTransitionDuration = fogOutDuration + flyThroughDuration + fogInDuration; // 8s total

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
        // Phase 1: Fog out (over current city)
        tl.push({
          type: 'fog_out',
          from: i,
          to: i + 1,
          start: timeAccumulator,
          duration: fogOutDuration
        });
        timeAccumulator += fogOutDuration;
        
        // Phase 2: Fly-through transition terrain
        tl.push({
          type: 'fly_through',
          from: i,
          to: i + 1,
          start: timeAccumulator,
          duration: flyThroughDuration
        });
        timeAccumulator += flyThroughDuration;
        
        // Phase 3: Fog in (reveal next city)
        tl.push({
          type: 'fog_in',
          from: i,
          to: i + 1,
          start: timeAccumulator,
          duration: fogInDuration
        });
        timeAccumulator += fogInDuration;
      }
    }
    timeline.current = tl;
    totalDuration.current = timeAccumulator;
    
    console.log('📅 Timeline built:', tl);
    tl.forEach((p, i) => {
      const label = p.type === 'station' 
        ? `station ${p.index} (${stations[p.index].name})`
        : `${p.type} ${p.from}→${p.to}`;
      console.log(`  ${i}: ${label} | ${p.start}ms - ${p.start + p.duration}ms (${p.duration}ms)`);
    });
  }, []);

  useEffect(() => {
    if (!mountRef.current || hasInitialized.current) return;
    
    hasInitialized.current = true;
    isMountedRef.current = true;

    console.log("🎬 Starting cinematic route animation...");

    // ===== SCENE SETUP =====
    const scene = new THREE.Scene();
    
    // BEAUTIFUL SUNSET SKY
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
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    
    scene.fog = new THREE.Fog(0xe8b4b4, 80, 200);

    // ===== CAMERA =====
    const camera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      0.1,
      8000
    );
    camera.position.set(100, 50, 100);
    camera.lookAt(0, 0, 0);

    // ===== RENDERER =====
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // ===== LIGHTING =====
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffd9b3, 1.5);
    sunLight.position.set(150, 250, 150);
    scene.add(sunLight);

    // ===== GROUND =====
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6000, 6000),
      new THREE.MeshStandardMaterial({ 
        color: 0xe8b4b4,
        roughness: 1.0,
        fog: true
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    scene.add(ground);

    // ===== LOAD STATION MODELS =====
    const stationGroups = [];
    
    stations.forEach((station, index) => {
      const group = new THREE.Group();
      group.position.set(station.position.x, station.position.y, station.position.z);
      group.userData.stationName = station.name;
      group.visible = false;
      
      console.log(`📦 Loading city: ${station.name}...`);
      const landmarkFunction = getLandmarkForCity(station.name);
      landmarkFunction(group);
      
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
      const terrainFunction = getTransitionTerrain(fromCity, toCity);
      terrainFunction(group);
      
      scene.add(group);
      transitionGroups.push(group);
    }
    
    // Show first station
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
      
      // Find current phase
      const tl = timeline.current;
      let currentPhase = null;
      let phaseElapsed = 0;
      
      for (const phase of tl) {
        if (globalElapsed >= phase.start && globalElapsed < phase.start + phase.duration) {
          currentPhase = phase;
          phaseElapsed = globalElapsed - phase.start;
          
          const phaseKey = `${phase.type}_${phase.index ?? phase.from}`;
          if (phaseKey !== lastPhaseKey) {
            lastPhaseKey = phaseKey;
            const label = phase.type === 'station' 
              ? `station ${phase.index} (${stations[phase.index].name})`
              : `${phase.type} ${phase.from}→${phase.to}`;
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
          stationNameRef.current.textContent = ''; // No city name during fly-through
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
        // ========== CITY ORBIT ==========
        const stationIndex = currentPhase.index;
        const station = stations[stationIndex];
        let progress = smoothEase(phaseElapsed / station.duration);
        
        const angle = progress * Math.PI * 1.2;
        
        let radius, height, lookAtY;
        
        // Generic orbit — works for all cities
        // Cape Town slightly lower (coastal city), others standard
        const isCapeTown = (stationIndex === 0);
        
        radius = 100;
        if (progress < 0.5) {
          radius = 120 - (progress * 40);
        } else {
          radius = 100 + ((progress - 0.5) * 40);
        }
        height = isCapeTown ? 60 - (progress * 15) : 65 - (progress * 15);
        lookAtY = isCapeTown ? 15 : 22;
        
        camera.position.x = Math.cos(angle) * radius;
        camera.position.y = height + Math.sin(progress * Math.PI * 2) * 3;
        camera.position.z = Math.sin(angle) * radius;
        
        camera.lookAt(0, lookAtY, 0);
        
        lastCameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        
        // Visibility: only current city
        stationGroups.forEach((g, i) => { g.visible = (i === stationIndex); });
        transitionGroups.forEach(g => { g.visible = false; });
        
        // Fog: tight around terrain
        scene.fog.near = 60;
        scene.fog.far = 180;
        
      } else if (currentPhase.type === 'fog_out') {
        // ========== FOG THICKENS OVER CURRENT CITY ==========
        const progress = phaseElapsed / fogOutDuration;
        const fromStation = currentPhase.from;
        
        // Continue orbiting smoothly while fog rolls in
        const stationProgress = 1.0; // End of the station's orbit
        const orbitAngle = stationProgress * Math.PI * 1.2;
        const baseAngle = orbitAngle + progress * Math.PI * 0.15; // Slight continued rotation
        
        const radius = 120;
        const height = 50 + (progress * 10); // Slowly rise as fog comes in
        
        camera.position.x = Math.cos(baseAngle) * radius;
        camera.position.y = height;
        camera.position.z = Math.sin(baseAngle) * radius;
        camera.lookAt(0, 20, 0);
        
        lastCameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        
        // Show current city, fade to white fog
        stationGroups.forEach((g, i) => { g.visible = (i === fromStation); });
        transitionGroups.forEach(g => { g.visible = false; });
        
        // Fog thickens dramatically
        scene.fog.near = 60 - (progress * 55);   // 60 → 5
        scene.fog.far = 180 - (progress * 160);   // 180 → 20
        
      } else if (currentPhase.type === 'fly_through') {
        // ========== FLY THROUGH MOUNTAIN TERRAIN ==========
        const progress = smoothEase(phaseElapsed / flyThroughDuration);
        const transIndex = currentPhase.from; // Index into transitionGroups
        
        // Camera flies FORWARD through the terrain (Z-axis movement)
        // Shifted right to avoid seeing left circular edge
        // End point pulled in to avoid seeing far edge
        const startZ = 100;
        const endZ = -80;
        const currentZ = startZ + (endZ - startZ) * progress;
        
        // High enough to stay above terrain peaks (~43 units tall)
        const flyHeight = 70 + Math.sin(progress * Math.PI) * 15; // 70→85→70 arc
        const weaveX = 20 + Math.sin(progress * Math.PI * 2) * 8; // Offset right by 20, gentle weave
        
        camera.position.set(weaveX, flyHeight, currentZ);
        
        // Look ahead and slightly down, also offset right
        const lookAheadZ = currentZ - 40;
        camera.lookAt(15, 25, lookAheadZ);
        
        lastCameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        
        // Show only transition terrain
        stationGroups.forEach(g => { g.visible = false; });
        transitionGroups.forEach((g, i) => { g.visible = (i === transIndex); });
        
        // Fog: atmospheric but lets more terrain show through
        const fogClearness = Math.sin(progress * Math.PI); // 0→1→0
        scene.fog.near = 8 + (fogClearness * 35);    // 8 → 43 → 8
        scene.fog.far = 35 + (fogClearness * 90);     // 35 → 125 → 35
        
      } else if (currentPhase.type === 'fog_in') {
        // ========== FOG CLEARS TO REVEAL NEXT CITY ==========
        const progress = phaseElapsed / fogInDuration;
        const toStation = currentPhase.to;
        
        // Camera settles into the start of the next city's orbit
        const startAngle = 0;
        const radius = 120;
        const height = 60 + ((1 - progress) * 10); // Descend from 70 to 60
        
        camera.position.x = Math.cos(startAngle) * radius;
        camera.position.y = height;
        camera.position.z = Math.sin(startAngle) * radius;
        
        const lookAtHeight = (toStation === 0) ? 15 : 22;
        camera.lookAt(0, lookAtHeight, 0);
        
        lastCameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        
        // Show next city, fog clearing
        stationGroups.forEach((g, i) => { g.visible = (i === toStation); });
        transitionGroups.forEach(g => { g.visible = false; });
        
        // Fog clears
        scene.fog.near = 5 + (progress * 55);    // 5 → 60
        scene.fog.far = 20 + (progress * 160);    // 20 → 180
      }
      
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    setTimeout(() => setIsSkippable(true), 2000);
    console.log("🎬 Starting animation...");
    animationFrameRef.current = requestAnimationFrame(animate);

    // ===== RESIZE =====
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ===== CLEANUP =====
    return () => {
      isMountedRef.current = false;
      hasInitialized.current = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (onComplete) onComplete();
  };

  return (
    <div style={styles.container}>
      <div ref={mountRef} style={styles.canvas} />

      <div style={styles.overlay}>
        <div style={styles.stationInfo}>
          <div ref={stationNameRef} style={styles.stationName}>
            Cape Town
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
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    background: '#000',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '60px',
  },
  stationInfo: {
    alignSelf: 'flex-start',
  },
  stationName: {
    fontSize: '4rem',
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    textShadow: '0 4px 20px rgba(0,0,0,0.8)',
    marginBottom: '20px',
    fontFamily: "'Arial Black', sans-serif",
  },
  progressBar: {
    width: '400px',
    height: '4px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4A90E2 0%, #10B981 100%)',
    transition: 'width 0.3s ease-out',
    boxShadow: '0 0 20px rgba(74, 144, 226, 0.8)',
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    pointerEvents: 'all',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.7) 100%)',
    pointerEvents: 'none',
  },
  filmGrain: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
    opacity: 0.08,
    pointerEvents: 'none',
  },
};

export default RouteAnimation;
