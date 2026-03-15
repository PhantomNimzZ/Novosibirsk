// client/src/components/booking/RouteAnimation3D.jsx
import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { colors, typography, spacing } from "../../styles/tokens";

/**
 * NUCLEAR RESET - ULTRA MINIMAL
 * ONLY Cape Town, no other landmarks, no bases, no complexity
 */
const RouteAnimation = ({ route, onComplete }) => {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasInitialized = useRef(false);
  const isMountedRef = useRef(true);
  
  const [isSkippable, setIsSkippable] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!mountRef.current || hasInitialized.current) return;
    
    hasInitialized.current = true;
    isMountedRef.current = true;

    console.log("🎬 ULTRA MINIMAL - Starting...");

    // ===== SCENE SETUP =====
    const scene = new THREE.Scene();
    
    // BEAUTIFUL SUNSET SKY (gradient sphere)
    const skyGeometry = new THREE.SphereGeometry(3000, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x5b7c99) },      // Soft blue-grey
        horizonColor: { value: new THREE.Color(0xd4a5a5) },  // Dusty pink
        bottomColor: { value: new THREE.Color(0xb8a0c4) },   // Lavender
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
    
    // THICK FOG at edges of Sketchfab model (hide the model edges!)
    scene.fog = new THREE.Fog(0xd4a5a5, 80, 250); // Starts close (150), fully dense by 400

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

    // ===== GROUND (matches fog color for seamless blend) =====
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(5000, 5000),
      new THREE.MeshStandardMaterial({ 
        color: 0xd4a5a5, // Same as fog color - blends seamlessly!
        roughness: 1.0,
        fog: true // Make sure fog affects it
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    scene.add(ground);

    // ===== LOAD CAPE TOWN MODEL =====
    console.log("📦 Loading Cape Town model...");
    const gltfLoader = new GLTFLoader();
    
    gltfLoader.load(
      '/models/table_mountain.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Position and scale
        model.position.set(0, 0, 0);
        model.scale.set(250, 250, 250); // Slightly smaller for better LOD (was 300)
        model.rotation.set(0, -Math.PI / 2, 0);
        
        // Enable higher quality rendering
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            // Force highest quality textures
            if (child.material.map) {
              child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
            }
          }
        });
        
        scene.add(model);
        
        console.log("✅ Cape Town loaded!");
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        console.log(`📏 Size: ${size.x.toFixed(0)} × ${size.y.toFixed(0)} × ${size.z.toFixed(0)}`);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
        if (percent % 20 === 0) console.log(`📦 Loading: ${percent.toFixed(0)}%`);
      },
      (error) => {
        console.error("❌ Failed to load model:", error);
      }
    );

    // ===== ANIMATION LOOP =====
    const startTime = Date.now();
    const duration = 15000; // 15 seconds
    
    const animate = () => {
      if (!isMountedRef.current) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setProgress(progress * 100);
      
      // ===== CAMERA ORBIT (Option C: Cinematic Sweep) =====
      const angle = progress * Math.PI * 1.2; // Extended arc (216 degrees)
      
      // Radius: Start far, come closer, then pull back at end (avoid terrain collision!)
      let radius = 150;
      if (progress < 0.5) {
        // First half: Come closer
        radius = 180 - (progress * 60); // 180 → 150
      } else {
        // Second half: Pull back to avoid collision
        radius = 150 + ((progress - 0.5) * 40); // 150 → 170
      }
      
      // Height: Descend smoothly (cinematic swoop)
      const height = 70 - (progress * 30); // Start high (70), end lower (40)
      
      // Calculate position
      camera.position.x = Math.cos(angle) * radius;
      camera.position.y = height + Math.sin(progress * Math.PI * 2) * 8; // Gentle bob
      camera.position.z = Math.sin(angle) * radius;
      
      // Always look at center of terrain (slightly elevated for better view)
      camera.lookAt(0, 25, 0);
      
      // Debug log
      if (Math.floor(elapsed / 1000) !== Math.floor((elapsed - 16) / 1000)) {
        console.log(`🎬 ${(progress * 100).toFixed(0)}% | Camera: x:${camera.position.x.toFixed(0)} y:${camera.position.y.toFixed(0)} z:${camera.position.z.toFixed(0)}`);
      }
      
      renderer.render(scene, camera);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        console.log("🎬 Animation complete!");
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1000);
      }
    };

    // Start animation
    setTimeout(() => setIsSkippable(true), 2000);
    console.log("🎬 Starting orbit...");
    animate();

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
  }, []);

  const handleSkip = () => {
    if (isSkippable && onComplete) {
      onComplete();
    }
  };

  return (
    <div style={styles.container}>
      <div ref={mountRef} style={styles.canvas} />

      <div style={styles.overlay}>
        <div style={styles.stationInfo}>
          <div style={styles.stationName}>Cape Town</div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progress}%`}} />
          </div>
        </div>

        {isSkippable && (
          <button onClick={handleSkip} style={styles.skipButton}>
            Skip Animation →
          </button>
        )}
      </div>

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
