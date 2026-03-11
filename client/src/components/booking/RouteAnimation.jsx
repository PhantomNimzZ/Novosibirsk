// client/src/components/booking/RouteAnimation3D.jsx
import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import { colors, typography, spacing } from "../../styles/tokens";
import { getLandmarkForCity } from "../../constants/landmarks";

/**
 * 3D Cinematic Route Animation
 * Professional flythrough animation with 3D landmarks and smooth camera movement
 * Inspired by Google Earth, National Geographic intros
 */
const RouteAnimation = ({ route, onComplete }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasInitialized = useRef(false); // ✅ Singleton flag that survives remounts
  const isMountedRef = useRef(true); // ✅ Track mount state across async operations
  
  const [currentStation, setCurrentStation] = useState(0);
  const [isSkippable, setIsSkippable] = useState(false);
  const [progress, setProgress] = useState(0);

  // Build station list with landmarks
  const stations = [
    { 
      name: route.from, 
      position: { x: 0, y: 0, z: 0 },
      landmark: 'mountain', // Table Mountain for Cape Town
      color: 0x4A90E2,
    },
    ...(route.intermediateStops || []).map((stop, i) => {
      const totalStops = (route.intermediateStops?.length || 0) + 1;
      const spacing = 400; // ✅ INCREASED: Cities now 400 units apart for cinematic scale
      return {
        name: stop.station,
        position: { 
          x: (i + 1) * spacing, 
          y: Math.sin((i + 1) * 0.3) * 20, 
          z: Math.cos((i + 1) * 0.3) * 30 
        },
        landmark: i % 2 === 0 ? 'tower' : 'cube', // Vary landmarks
        color: 0x6B7280,
      };
    }),
    { 
      name: route.to, 
      position: { 
        x: ((route.intermediateStops?.length || 0) + 1) * 400, // ✅ INCREASED spacing
        y: 0, 
        z: 0 
      },
      landmark: 'city', // City skyline for destination
      color: 0x10B981,
    },
  ];

  // Removed debug log - stations are properly positioned

  useEffect(() => {
    if (!mountRef.current) return;
    
    // ✅ CRITICAL: Use ref to prevent React Strict Mode duplicate initialization
    if (hasInitialized.current) {
      console.log("⚠️ Already initialized, skipping duplicate mount");
      return;
    }
    
    hasInitialized.current = true;
    isMountedRef.current = true; // ✅ Mark as mounted

    console.log("🎬 Initializing 3D scene...");

    // ===== SCENE SETUP =====
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // ✅ CINEMATIC SKY: Soft pink/purple sunset with dark blue (matching reference image)
    const skyGeometry = new THREE.SphereGeometry(4000, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x1a1f3a) }, // Dark navy blue
        midTopColor: { value: new THREE.Color(0x3d4a7a) }, // Slate blue
        midColor: { value: new THREE.Color(0x9a7fb0) }, // Soft purple
        horizonColor: { value: new THREE.Color(0xd4a5a5) }, // Dusty rose/pink
        bottomColor: { value: new THREE.Color(0xb8a0c4) }, // Lavender
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
        uniform vec3 midTopColor;
        uniform vec3 midColor;
        uniform vec3 horizonColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPosition;
        
        void main() {
          float h = normalize(vWorldPosition).y;
          vec3 color;
          
          if (h > 0.4) {
            // Top: dark navy to slate blue
            color = mix(midTopColor, topColor, (h - 0.4) / 0.6);
          } else if (h > 0.0) {
            // Upper mid: slate blue to soft purple
            color = mix(midColor, midTopColor, h / 0.4);
          } else if (h > -0.3) {
            // Horizon: soft purple to dusty pink
            color = mix(horizonColor, midColor, (h + 0.3) / 0.3);
          } else {
            // Bottom: dusty pink to lavender
            color = mix(bottomColor, horizonColor, (h + 1.0) / 0.7);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    
    // Soft purple atmospheric fog
    scene.fog = new THREE.Fog(0xc8b5d0, 700, 3000); // Very soft lavender

    // ===== CAMERA SETUP =====
    const camera = new THREE.PerspectiveCamera(
      80, // ✅ Wider FOV for more dramatic cinematic feel
      window.innerWidth / window.innerHeight,
      0.1,
      8000
    );
    // ✅ CINEMATIC START: Lower, closer, more dramatic initial position
    camera.position.set(-180, 45, 180); // Much lower and closer!
    camera.lookAt(0, 25, 0); // Looking at scene, not sky
    cameraRef.current = camera;

    // ===== RENDERER SETUP =====
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ===== LIGHTING =====
    // Ambient light (soft overall illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffd9b3, 1.2);
    sunLight.position.set(100, 200, 100);
    sunLight.castShadow = true;
    sunLight.shadow.camera.left = -200;
    sunLight.shadow.camera.right = 200;
    sunLight.shadow.camera.top = 200;
    sunLight.shadow.camera.bottom = -200;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // ===== CINEMATIC TERRAIN =====
    // Main ground plane - South African karoo/savanna colors
    const groundGeometry = new THREE.PlaneGeometry(5000, 5000, 100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd4a574, // Sandy/karoo brown
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    
    // Add subtle terrain variation
    const positions = ground.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      // Subtle rolling hills using Perlin-like noise approximation
      const height = Math.sin(x * 0.01) * 3 + Math.cos(z * 0.01) * 3;
      positions.setY(i, height);
    }
    positions.needsUpdate = true;
    ground.geometry.computeVertexNormals();
    
    scene.add(ground);

    // ===== CREATE EPIC SOUTH AFRICAN LANDMARKS =====
    stations.forEach((station, index) => {
      const group = new THREE.Group();
      group.position.set(station.position.x, station.position.y, station.position.z);


      // ===== LOAD LANDMARK FOR THIS CITY =====
      // Use city name to get the appropriate landmark function
      const landmarkFunction = getLandmarkForCity(station.name);
      
      // Add diorama base for all cities
      const baseGeometry = new THREE.CylinderGeometry(75, 75, 3, 32);
      const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xc9b896,
        roughness: 0.9,
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = 1.5;
      base.receiveShadow = true;
      group.add(base);
      
      // Create the city-specific landmark
      landmarkFunction(group);

      // Add platform/base for all stations
      const platformGeometry = new THREE.CylinderGeometry(30, 30, 2, 32);
      const platformMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        roughness: 0.9,
      });
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.y = 0;
      platform.receiveShadow = true;
      group.add(platform);

      // Add glow ring
      const ringGeometry = new THREE.RingGeometry(32, 35, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: station.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.5;
      group.add(ring);

      scene.add(group);
    });

    // ===== CAMERA PATH ANIMATION =====
    let animationProgress = 0;
    const totalDuration = 20000; // ✅ SLOWED: 20 seconds for smoother journey
    
    const startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      // ✅ ADD PAUSE AT FIRST STATION (Cape Town)
      // Hold at Cape Town for 3 seconds, then start journey
      const pauseDuration = 3000; // 3 second pause
      let adjustedElapsed = elapsed - pauseDuration;
      if (adjustedElapsed < 0) adjustedElapsed = 0;
      
      animationProgress = Math.min(adjustedElapsed / totalDuration, 1);

      // Calculate which station we're at/heading to
      const totalStations = stations.length;
      const progressPerStation = 1 / (totalStations - 1);
      const stationIndex = Math.floor(animationProgress / progressPerStation);
      const stationProgress = (animationProgress % progressPerStation) / progressPerStation;

      setProgress(animationProgress * 100);
      
      // ✅ FIX: Update text when 50% of the way to next city (earlier, smoother transition)
      const textStationIndex = stationProgress > 0.5 ? stationIndex + 1 : stationIndex;
      setCurrentStation(Math.min(textStationIndex, totalStations - 1));

      // Only proceed if still mounted
      if (!isMountedRef.current) {
        console.log("🛑 Component unmounted, stopping animation");
        return;
      }

      // Debug: Log every frame for first 2 seconds
      if (elapsed < 2000 && Math.floor(elapsed / 100) % 2 === 0) {
        console.log(`⏱️ Progress: ${(animationProgress * 100).toFixed(1)}% | Station: ${stationIndex}→${stationIndex+1} | Mounted: ${isMountedRef.current}`);
      }

      if (stationIndex < totalStations - 1) {
        const currentPos = stations[stationIndex].position;
        const nextPos = stations[stationIndex + 1].position;

        // ✅ ULTRA-SMOOTH EASING - No jolts at transitions
        const ultraSmoothEase = (t) => {
          // Smoothstep with even gentler curve
          return t * t * t * (t * (t * 6 - 15) + 10); // Smootherstep
        };

        const easedProgress = ultraSmoothEase(stationProgress);

        // ✅ CINEMATIC CAMERA MOVEMENT - Smooth with angle variation
        
        // X position: Smooth movement with gentle side drift
        const sideDrift = Math.sin(easedProgress * Math.PI) * 12; // Gentle S-curve
        camera.position.x = THREE.MathUtils.lerp(
          currentPos.x - 80,
          nextPos.x - 80,
          easedProgress
        ) + sideDrift;
        
        // Y position: Gentle rise and fall with slight approach variation
        const baseHeight = 40;
        const heightVariation = Math.sin(easedProgress * Math.PI) * 10; // Gentle arc
        const approachDip = Math.sin(easedProgress * Math.PI * 2) * 5; // Subtle dip/rise
        camera.position.y = THREE.MathUtils.lerp(
          currentPos.y + baseHeight,
          nextPos.y + baseHeight,
          easedProgress
        ) + heightVariation + approachDip;
        
        // Z position: Smooth forward with subtle in/out movement
        const zoomInOut = Math.sin(easedProgress * Math.PI) * 15; // Move closer to cities, back out between
        camera.position.z = THREE.MathUtils.lerp(
          currentPos.z + 120,
          nextPos.z + 120,
          easedProgress
        ) + zoomInOut;

        // ✅ PERFECTLY SYNCHRONIZED LOOK-AT - Smooth angle changes
        // Look-at uses SAME eased progress as camera position
        
        const lookAtX = THREE.MathUtils.lerp(
          currentPos.x,
          nextPos.x,
          easedProgress
        );
        
        // Look at mid-height with gentle vertical drift
        const lookHeightDrift = Math.sin(easedProgress * Math.PI) * 5;
        const lookAtY = THREE.MathUtils.lerp(
          currentPos.y + 30,
          nextPos.y + 30,
          easedProgress
        ) + lookHeightDrift;
        
        const lookAtZ = THREE.MathUtils.lerp(
          currentPos.z,
          nextPos.z,
          easedProgress
        );

        camera.lookAt(lookAtX, lookAtY, lookAtZ);
        
        // Debug: Log camera movement every 10 frames
        if (Math.floor(animationProgress * 100) % 10 === 0) {
          console.log("📍 Camera:", 
            `x:${camera.position.x.toFixed(0)}`, 
            `y:${camera.position.y.toFixed(0)}`, 
            `z:${camera.position.z.toFixed(0)}`,
            `| Station ${stationIndex} → ${stationIndex + 1}`
          );
        }
      }

      renderer.render(scene, camera);

      if (animationProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        console.log("🎬 Animation complete!");
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1000);
      }
    };

    // Allow skipping after 2 seconds
    setTimeout(() => setIsSkippable(true), 2000);

    // ✅ START THE ANIMATION LOOP (only if still mounted)!
    if (!isMountedRef.current) return;
    console.log("🎬 Starting animation loop...");
    animate();

    // ===== CLEANUP =====
    return () => {
      isMountedRef.current = false; // ✅ Mark as unmounted
      hasInitialized.current = false; // ✅ Allow re-initialization on remount
      console.log("🧹 Cleaning up animation...");
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // ✅ Empty deps - run once only

  const handleSkip = () => {
    if (isSkippable && onComplete) {
      onComplete();
    }
  };

  return (
    <div style={styles.container}>
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} style={styles.canvas} />

      {/* Text Overlay */}
      <div style={styles.overlay}>
        {currentStation < stations.length && (
          <div style={styles.stationInfo}>
            <div style={styles.stationName}>
              {stations[currentStation].name}
            </div>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${progress}%`}} />
            </div>
          </div>
        )}

        {/* Skip Button */}
        {isSkippable && (
          <button onClick={handleSkip} style={styles.skipButton}>
            Skip Animation →
          </button>
        )}
      </div>

      {/* Film grain */}
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
    textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.2)',
    marginBottom: '20px',
    animation: 'fadeInUp 0.8s ease-out',
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
