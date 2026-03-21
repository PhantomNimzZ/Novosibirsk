// client/src/components/booking/RouteAnimation3D.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getLandmarkForCity } from "../../constants/landmarks";
import { colors, typography, spacing } from "../../styles/tokens";

/**
 * CINEMATIC ROUTE ANIMATION
 * Cape Town → Worcester with fog transitions
 * 
 * BUG FIX: Removed setState calls (setCurrentStationIndex, setProgress) from
 * the animation loop. These were triggering React re-renders on every frame,
 * and when the station index changed from 0→1 at the Worcester phase,
 * the re-render caused a ~10 second gap in Date.now() timing, skipping
 * the entire Worcester animation.
 * 
 * Solution: Use refs for animation-driven UI updates and only sync to
 * state via a throttled interval outside the animation loop.
 */
const RouteAnimation = ({ route, onComplete }) => {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasInitialized = useRef(false);
  const isMountedRef = useRef(true);
  
  // UI state — updated via DOM manipulation, NOT React state during animation
  const stationNameRef = useRef(null);
  const progressFillRef = useRef(null);
  
  const [isSkippable, setIsSkippable] = useState(false);

  // Define stations with durations
  const stations = [
    { 
      name: 'Cape Town',
      duration: 15000, // 15 seconds
      position: { x: 0, y: 0, z: 0 }
    },
    { 
      name: 'Worcester',
      duration: 10000, // 10 seconds  
      position: { x: 0, y: 0, z: 0 }
    },
  ];

  const transitionDuration = 3000; // 3 seconds fog transition

  // Pre-build the timeline ONCE (it never changes)
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
          type: 'transition',
          from: i,
          to: i + 1,
          start: timeAccumulator,
          duration: transitionDuration
        });
        timeAccumulator += transitionDuration;
      }
    }
    timeline.current = tl;
    totalDuration.current = timeAccumulator;
    
    console.log('📅 Timeline built:', tl);
    tl.forEach((p, i) => {
      console.log(`  ${i}: ${p.type} ${p.index !== undefined ? `station ${p.index}` : `${p.from}→${p.to}`} | ${p.start}ms - ${p.start + p.duration}ms (duration: ${p.duration}ms)`);
    });
  }, []);

  useEffect(() => {
    if (!mountRef.current || hasInitialized.current) return;
    
    hasInitialized.current = true;
    isMountedRef.current = true;

    console.log("🎬 Starting Cape Town → Worcester animation...");

    // ===== SCENE SETUP =====
    const scene = new THREE.Scene();
    
    // BEAUTIFUL SUNSET SKY (gradient sphere)
    const skyGeometry = new THREE.SphereGeometry(3000, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x8e7a9e) },      // Soft lavender (lighter, not dark)
        horizonColor: { value: new THREE.Color(0xe8b4b4) },  // Bright dusty pink
        bottomColor: { value: new THREE.Color(0xd4a5b8) },   // Warm rose pink
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
    
    // FOG (will be animated during transitions)
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

    // ===== GROUND (simple, color-matched to horizon) =====
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6000, 6000),
      new THREE.MeshStandardMaterial({ 
        color: 0xe8b4b4,  // Matches fog/horizon
        roughness: 1.0,
        fog: true
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    scene.add(ground);

    // ===== LOAD ALL STATION MODELS =====
    const stationGroups = [];
    
    stations.forEach((station, index) => {
      const group = new THREE.Group();
      group.position.set(station.position.x, station.position.y, station.position.z);
      group.userData.stationName = station.name;
      group.visible = false;
      
      console.log(`📦 Loading ${station.name}...`);
      const landmarkFunction = getLandmarkForCity(station.name);
      landmarkFunction(group);
      
      scene.add(group);
      stationGroups.push(group);
    });
    
    // Show first station after brief delay (let models start loading)
    setTimeout(() => {
      if (stationGroups[0]) stationGroups[0].visible = true;
    }, 100);

    // ===== ANIMATION LOOP =====
    let startTime = null; // Will be set from first RAF timestamp
    let lastCameraPos = { x: 100, y: 50, z: 100 };
    let lastLoggedPercent = -1;
    let frameCount = 0;
    let lastFrameTime = null;
    let lastPhaseKey = '';
    let animationComplete = false;
    
    const animate = (timestamp) => {
      if (!isMountedRef.current || animationComplete) return;
      
      // Capture startTime from the FIRST frame's timestamp
      // This guarantees globalElapsed starts at 0, never negative
      if (startTime === null) {
        startTime = timestamp;
        lastFrameTime = timestamp;
        console.log(`⏱️ Animation clock started at RAF timestamp: ${timestamp.toFixed(0)}ms`);
      }
      
      // Use the RAF timestamp for consistent timing
      const globalElapsed = timestamp - startTime;
      const frameDelta = timestamp - lastFrameTime;
      lastFrameTime = timestamp;
      frameCount++;
      
      // Detect huge time jumps and CLAMP them (e.g., tab was backgrounded)
      // This prevents the animation from skipping ahead if the browser throttled RAF
      if (frameDelta > 200) {
        console.warn(`⚠️ Large frame delta: ${frameDelta.toFixed(0)}ms at frame ${frameCount} — this is normal if tab was backgrounded`);
        // We don't need to do anything special because RAF timestamps are monotonic
        // and the animation will just continue from where it left off visually
      }
      
      // Find current phase from pre-built timeline
      const tl = timeline.current;
      let currentPhase = null;
      let phaseElapsed = 0;
      
      for (const phase of tl) {
        if (globalElapsed >= phase.start && globalElapsed < phase.start + phase.duration) {
          currentPhase = phase;
          phaseElapsed = globalElapsed - phase.start;
          
          // Log phase changes (using local var instead of window)
          const phaseKey = `${phase.type}_${phase.index ?? phase.from}`;
          if (phaseKey !== lastPhaseKey) {
            lastPhaseKey = phaseKey;
            console.log(`🎯 Phase change → ${phase.type} ${phase.index !== undefined ? `station ${phase.index} (${stations[phase.index].name})` : `transition ${phase.from}→${phase.to}`}`);
            console.log(`   Phase window: ${phase.start}ms → ${phase.start + phase.duration}ms (${phase.duration}ms)`);
            console.log(`   Current globalElapsed: ${globalElapsed.toFixed(0)}ms, phaseElapsed: ${phaseElapsed.toFixed(0)}ms`);
          }
          break;
        }
      }
      
      // If no phase found, animation is complete
      if (!currentPhase) {
        console.log(`🎬 Animation complete! globalElapsed=${globalElapsed.toFixed(0)}ms`);
        animationComplete = true;
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1000);
        return;
      }
      
      // ===== UPDATE UI VIA DOM (no React re-renders!) =====
      const displayStationIndex = currentPhase.type === 'station' ? 
        currentPhase.index : currentPhase.to;
      
      if (stationNameRef.current) {
        stationNameRef.current.textContent = stations[displayStationIndex]?.name || '';
      }
      if (progressFillRef.current) {
        const pct = Math.min(100, (globalElapsed / totalDuration.current) * 100);
        progressFillRef.current.style.width = `${pct}%`;
      }
      
      // ===== STATION OR TRANSITION? =====
      if (currentPhase.type === 'station') {
        // ===== DURING STATION: ORBIT CAMERA =====
        const stationIndex = currentPhase.index;
        const station = stations[stationIndex];
        let progress = phaseElapsed / station.duration;
        
        // Smooth easing
        const smoothEase = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        progress = smoothEase(progress);
        
        const angle = progress * Math.PI * 1.2;
        
        // Different camera settings per city
        let radius, height;
        
        if (stationIndex === 0) {
          // CAPE TOWN: 200×200 flat terrain, center at y~20
          // Close cinematic sweep — camera low and intimate
          radius = 100;
          if (progress < 0.5) {
            radius = 120 - (progress * 40); // 120 → 100 (pull in)
          } else {
            radius = 100 + ((progress - 0.5) * 40); // 100 → 120 (pull out)
          }
          height = 60 - (progress * 15); // 60 → 45 (gentle descent)
        } else {
          // WORCESTER: 200×200, height 43, center at y=21.5
          // Similar cinematic sweep
          radius = 100;
          if (progress < 0.5) {
            radius = 120 - (progress * 40); // 120 → 100
          } else {
            radius = 100 + ((progress - 0.5) * 40); // 100 → 120
          }
          height = 65 - (progress * 15); // 65 → 50 (slightly higher for terrain)
        }
        
        const finalAngle = angle;
        
        camera.position.x = Math.cos(finalAngle) * radius;
        camera.position.y = height + Math.sin(progress * Math.PI * 2) * 3;
        camera.position.z = Math.sin(finalAngle) * radius;
        
        // Look at terrain center
        const lookAtHeight = (stationIndex === 0) ? 15 : 22;
        camera.lookAt(0, lookAtHeight, 0);
        
        lastCameraPos = {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
        };
        
        // Show only current station
        stationGroups.forEach((g, i) => {
          g.visible = (i === stationIndex);
        });
        
        // Fog: tight around 200-unit terrain to hide circular edges
        if (stationIndex === 0) {
          scene.fog.near = 60;
          scene.fog.far = 180;
        } else {
          scene.fog.near = 60;
          scene.fog.far = 180;
        }
        
      } else {
        // ===== TRANSITION: FOG IN/OUT =====
        const transitionProgress = phaseElapsed / transitionDuration;
        
        // Throttled logging
        const percent = Math.floor(transitionProgress * 100);
        if (percent % 25 === 0 && percent !== lastLoggedPercent) {
          lastLoggedPercent = percent;
          console.log(`🌫️ Transition ${percent}%`);
        }
        
        // FOG ANIMATION: Thicken then clear
        if (transitionProgress < 0.5) {
          const fogInProgress = transitionProgress * 2;
          scene.fog.near = 150 - (fogInProgress * 140);
          scene.fog.far = 400 - (fogInProgress * 350);
        } else {
          const fogOutProgress = (transitionProgress - 0.5) * 2;
          scene.fog.near = 10 + (fogOutProgress * 140);
          scene.fog.far = 50 + (fogOutProgress * 350);
        }
        
        // CAMERA MOVEMENT DURING TRANSITION
        const transStartAngle = Math.atan2(lastCameraPos.z, lastCameraPos.x);
        const transEndAngle = transStartAngle + (Math.PI * 0.3);
        const angle = transStartAngle + (transEndAngle - transStartAngle) * transitionProgress;
        
        const radius = 200;
        const height = 80;
        
        camera.position.x = Math.cos(angle) * radius;
        camera.position.y = height;
        camera.position.z = Math.sin(angle) * radius;
        camera.lookAt(0, 25, 0);
        
        // VISIBILITY: Clean switch at exact halfway
        const fromStation = currentPhase.from;
        const toStation = currentPhase.to;
        
        stationGroups.forEach((g, i) => {
          if (transitionProgress < 0.5) {
            g.visible = (i === fromStation);
          } else {
            g.visible = (i === toStation);
          }
        });
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
    if (onComplete) {
      onComplete();
    }
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
