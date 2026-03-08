// client/src/components/booking/RouteAnimation3D.jsx
console.log("🔄 RouteAnimation component rendering");
import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import { colors, typography, spacing } from "../../styles/tokens";

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
      const spacing = 150; // Space between stations
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
        x: ((route.intermediateStops?.length || 0) + 1) * 150, 
        y: 0, 
        z: 0 
      },
      landmark: 'city', // City skyline for destination
      color: 0x10B981,
    },
  ];

  console.log("🗺️ Station positions:", stations.map(s => ({ 
    name: s.name, 
    x: s.position.x, 
    y: s.position.y, 
    z: s.position.z 
  })));

  useEffect(() => {
    if (!mountRef.current) return;
    
    let isMounted = true; // ✅ Prevent double execution

    // ===== SCENE SETUP =====
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 100, 500);
    sceneRef.current = scene;

    // ===== CAMERA SETUP =====
    const camera = new THREE.PerspectiveCamera(
      75, // FOV - wider for cinematic feel
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    // Start MUCH further back and higher for full overview
    camera.position.set(-200, 150, 250); // WAY back and up!
    camera.lookAt(0, 0, 0);
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

    // ===== GROUND PLANE =====
    const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    scene.add(ground);

    // ===== CREATE LANDMARKS FOR EACH STATION =====
    stations.forEach((station, index) => {
      const group = new THREE.Group();
      group.position.set(station.position.x, station.position.y, station.position.z);

      // Create landmark based on type
      let landmark;
      
      if (station.landmark === 'mountain') {
        // Table Mountain style (pyramid)
        const geometry = new THREE.ConeGeometry(20, 40, 4);
        const material = new THREE.MeshStandardMaterial({ 
          color: station.color,
          roughness: 0.7,
          metalness: 0.2,
        });
        landmark = new THREE.Mesh(geometry, material);
        landmark.position.y = 20;
        landmark.castShadow = true;
        
      } else if (station.landmark === 'city') {
        // City skyline (multiple towers)
        for (let i = 0; i < 5; i++) {
          const height = 30 + Math.random() * 40;
          const geometry = new THREE.BoxGeometry(8, height, 8);
          const material = new THREE.MeshStandardMaterial({ 
            color: station.color,
            roughness: 0.4,
            metalness: 0.6,
          });
          const building = new THREE.Mesh(geometry, material);
          building.position.x = (i - 2) * 12;
          building.position.y = height / 2;
          building.castShadow = true;
          group.add(building);
        }
        
      } else if (station.landmark === 'tower') {
        // Simple tower
        const geometry = new THREE.CylinderGeometry(5, 8, 35, 8);
        const material = new THREE.MeshStandardMaterial({ 
          color: station.color,
          roughness: 0.6,
          metalness: 0.3,
        });
        landmark = new THREE.Mesh(geometry, material);
        landmark.position.y = 17.5;
        landmark.castShadow = true;
        
      } else {
        // Default cube (Big Hole style)
        const geometry = new THREE.BoxGeometry(25, 15, 25);
        const material = new THREE.MeshStandardMaterial({ 
          color: station.color,
          roughness: 0.8,
          metalness: 0.1,
        });
        landmark = new THREE.Mesh(geometry, material);
        landmark.position.y = 7.5;
        landmark.castShadow = true;
      }

      if (landmark) group.add(landmark);

      // Add platform/base
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
    const totalDuration = 12000; // 12 seconds total
    
    const startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      animationProgress = Math.min(elapsed / totalDuration, 1);

      console.log("🎬 Camera animating, progress:", animationProgress.toFixed(2)); // Debug log

      // Calculate which station we're at/heading to
      const totalStations = stations.length;
      const progressPerStation = 1 / (totalStations - 1);
      const stationIndex = Math.floor(animationProgress / progressPerStation);
      const stationProgress = (animationProgress % progressPerStation) / progressPerStation;

      setProgress(animationProgress * 100);
      setCurrentStation(Math.min(stationIndex, totalStations - 1));

      // Only proceed if still mounted
      if (!isMounted) {
        console.log("🛑 Component unmounted, stopping animation");
        return;
      }

      if (stationIndex < totalStations - 1) {
        const currentPos = stations[stationIndex].position;
        const nextPos = stations[stationIndex + 1].position;

        // Easing function (ease-in-out cubic)
        const ease = (t) => t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const easedProgress = ease(stationProgress);

        // Interpolate camera position (follow along but stay back)
        camera.position.x = THREE.MathUtils.lerp(
          currentPos.x - 100, // Further back from X
          nextPos.x - 100,
          easedProgress
        );
        camera.position.y = THREE.MathUtils.lerp(
          currentPos.y + 120, // Higher up
          nextPos.y + 120,
          easedProgress
        ) + Math.sin(animationProgress * Math.PI * 4) * 8; // More pronounced bobbing
        camera.position.z = THREE.MathUtils.lerp(
          currentPos.z + 200, // Further back from Z
          nextPos.z + 200,
          easedProgress
        );

        // Look at point ahead
        const lookAtX = THREE.MathUtils.lerp(
          currentPos.x,
          nextPos.x,
          easedProgress
        );
        const lookAtY = THREE.MathUtils.lerp(
          currentPos.y,
          nextPos.y,
          easedProgress
        ) + 20;
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
    if (!isMounted) return;
    console.log("🎬 Starting animation loop...");
    animate();

    // ===== CLEANUP =====
    return () => {
      isMounted = false; // ✅ Mark as unmounted
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
