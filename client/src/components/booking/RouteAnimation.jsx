// client/src/components/booking/RouteAnimation3D.jsx
import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
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
  const composerRef = useRef(null); // ✨ Post-processing composer
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

    // ===== PROCEDURAL TEXTURE GENERATORS (PHASE 2 - AAA QUALITY) =====
    console.log("🎨 Generating procedural textures...");
    
    // Generate building facade texture with windows
    const createBuildingTexture = (color, windowDensity = 0.6) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Base building color with slight variation
      ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
      ctx.fillRect(0, 0, 256, 512);
      
      // Add subtle concrete texture
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 512;
        const brightness = Math.random() * 20 - 10;
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = brightness > 0 ? '#ffffff' : '#000000';
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.globalAlpha = 1.0;
      
      // Windows (grid pattern)
      const windowCols = 8;
      const windowRows = 20;
      const windowWidth = 20;
      const windowHeight = 18;
      
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          if (Math.random() < windowDensity) {
            // Lit window (warm yellow/orange glow)
            const isLit = Math.random() > 0.3;
            if (isLit) {
              // Glowing window
              ctx.fillStyle = Math.random() > 0.7 ? '#ffeb3b' : '#ffa726';
            } else {
              // Dark window
              ctx.fillStyle = '#2a2a2a';
            }
          } else {
            // Unlit window
            ctx.fillStyle = '#1a1a1a';
          }
          
          // Window frame
          ctx.fillRect(col * 32 + 6, row * 25 + 5, windowWidth, windowHeight);
          
          // Window reflection (subtle)
          if (Math.random() > 0.6) {
            ctx.fillStyle = 'rgba(135, 206, 235, 0.1)'; // Sky reflection
            ctx.fillRect(col * 32 + 6, row * 25 + 5, windowWidth / 2, windowHeight / 2);
          }
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };
    
    // Generate rock texture with natural variation
    const createRockTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // PHOTOGRAMMETRY QUALITY: Base layer with color variation
      const baseColors = [
        '#7a6f5d', '#8b7d6b', '#9b8b7a', '#6b5d52', '#5a524a',
        '#6a5f4d', '#7b6d5b', '#8a7c6a', '#5b534b', '#6c5e4c'
      ];
      
      // Paint varied base (Perlin-like noise simulation)
      for (let y = 0; y < 512; y += 4) {
        for (let x = 0; x < 512; x += 4) {
          const noise = Math.sin(x * 0.05) * Math.cos(y * 0.05) + 
                       Math.sin(x * 0.02) * Math.cos(y * 0.03);
          const colorIndex = Math.floor((noise + 2) * 2.5) % baseColors.length;
          ctx.fillStyle = baseColors[colorIndex];
          const size = 4 + Math.random() * 4;
          ctx.fillRect(x, y, size, size);
        }
      }
      
      // PHOTOGRAMMETRY: Stratification lines (geological layers)
      ctx.strokeStyle = 'rgba(50, 45, 40, 0.6)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const y = i * 64 + Math.random() * 20;
        ctx.moveTo(0, y);
        for (let x = 0; x < 512; x += 10) {
          const variance = Math.sin(x * 0.05) * 3;
          ctx.lineTo(x, y + variance);
        }
        ctx.stroke();
      }
      
      // PHOTOGRAMMETRY: Cracks and fissures
      ctx.strokeStyle = 'rgba(40, 35, 30, 0.7)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        const startX = Math.random() * 512;
        const startY = Math.random() * 512;
        ctx.moveTo(startX, startY);
        
        let x = startX;
        let y = startY;
        const segments = 3 + Math.floor(Math.random() * 5);
        for (let j = 0; j < segments; j++) {
          x += (Math.random() - 0.5) * 80;
          y += (Math.random() - 0.5) * 80;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      // PHOTOGRAMMETRY: Weathering stains
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = 10 + Math.random() * 30;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, 'rgba(90, 80, 70, 0.3)');
        gradient.addColorStop(1, 'rgba(90, 80, 70, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      }
      
      // PHOTOGRAMMETRY: Highlights (sun-bleached areas)
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = 'rgba(200, 190, 180, 0.2)';
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
      }
      
      // PHOTOGRAMMETRY: Shadows (crevices)
      for (let i = 0; i < 80; i++) {
        ctx.fillStyle = 'rgba(30, 25, 20, 0.4)';
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };
    
    console.log("✨ Textures generated!");

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
    scene.fog = new THREE.Fog(0xd8c5e0, 800, 3000); // LIGHTENED: Brighter fog color, pushed back

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

    // ===== ENHANCED LIGHTING SYSTEM =====
    // Ambient light (INCREASED for brighter scene)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Was 0.5
    scene.add(ambientLight);

    // Main sun light (directional - warm golden hour)
    const sunLight = new THREE.DirectionalLight(0xffd9b3, 1.8); // INCREASED from 1.4
    sunLight.position.set(150, 250, 150);
    sunLight.castShadow = true;
    // Higher quality shadows
    sunLight.shadow.camera.left = -300;
    sunLight.shadow.camera.right = 300;
    sunLight.shadow.camera.top = 300;
    sunLight.shadow.camera.bottom = -300;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 1000;
    sunLight.shadow.mapSize.width = 4096; // ✨ INCREASED: Higher quality shadows
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);
    
    // Fill light (INCREASED - from opposite direction for depth)
    const fillLight = new THREE.DirectionalLight(0x9db4c0, 0.7); // Was 0.4
    fillLight.position.set(-100, 80, -100);
    scene.add(fillLight);
    
    // Hemisphere light (INCREASED - sky and ground color)
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0xa0826d, 0.9); // Was 0.6
    scene.add(hemiLight);
    
    // NEW: Additional key light from front for better visibility
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
    keyLight.position.set(0, 100, 200);
    scene.add(keyLight);

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
      console.log(`🏙️ Loading landmark for: "${station.name}"`); // DEBUG
      const landmarkFunction = getLandmarkForCity(station.name);
      console.log(`📍 Landmark function found:`, landmarkFunction.name || 'placeholder'); // DEBUG
      
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

      // === ELEVATED PLATFORM PEDESTAL (makes dioramas look intentional) ===
      const platformHeight = 12;
      const platformRadius = 70;
      
      // Main pedestal (tapered cylinder)
      const pedestalGeometry = new THREE.CylinderGeometry(
        platformRadius, 
        platformRadius + 8, 
        platformHeight, 
        32
      );
      const pedestalMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        roughness: 0.85,
        metalness: 0.15,
      });
      const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
      pedestal.position.y = -platformHeight / 2 - 1.5; // Below diorama base
      pedestal.receiveShadow = true;
      pedestal.castShadow = true;
      group.add(pedestal);
      
      // Platform top rim (architectural detail)
      const rimGeometry = new THREE.CylinderGeometry(
        platformRadius + 2, 
        platformRadius + 2, 
        1.5, 
        32
      );
      const rimMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3a3a3a,
        roughness: 0.7,
        metalness: 0.3,
      });
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.position.y = 0.75;
      rim.receiveShadow = true;
      group.add(rim);
      
      // Decorative edge ring
      const edgeRing = new THREE.Mesh(
        new THREE.TorusGeometry(platformRadius + 1, 0.8, 8, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x505050,
          roughness: 0.6,
          metalness: 0.4,
        })
      );
      edgeRing.rotation.x = Math.PI / 2;
      edgeRing.position.y = 1.5;
      group.add(edgeRing);

      // Add glow ring (on top of pedestal)
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
    
    // ===== GROUND FOG BETWEEN LANDMARKS (LIGHTWEIGHT) =====
    console.log('🌫️ Creating subtle atmospheric fog...');
    
    const fogParticles = [];
    const fogGeometry = new THREE.SphereGeometry(18, 8, 8);
    
    const fogMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xd8c5e0,
      transparent: true,
      opacity: 0.12, // LIGHT and performant
      fog: false,
    });
    
    // Subtle fog between stations (light touch)
    for (let i = 0; i < stations.length - 1; i++) {
      const start = stations[i].position;
      const end = stations[i + 1].position;
      
      const fogCloudsPerSegment = 6; // Reduced for performance
      for (let j = 0; j < fogCloudsPerSegment; j++) {
        const t = j / fogCloudsPerSegment;
        const x = start.x + (end.x - start.x) * t;
        const y = -5 + Math.random() * 12;
        const z = -35 + Math.random() * 70;
        
        const fogCloud = new THREE.Mesh(fogGeometry, fogMaterial.clone());
        fogCloud.position.set(x, y, z);
        fogCloud.scale.set(
          1 + Math.random() * 1.5,
          0.6 + Math.random() * 0.6,
          1 + Math.random() * 1.5
        );
        scene.add(fogCloud);
        
        fogParticles.push({
          mesh: fogCloud,
          driftSpeed: 0.015 + Math.random() * 0.02,
          driftAngle: Math.random() * Math.PI * 2,
          floatSpeed: 0.01 + Math.random() * 0.01,
          floatOffset: Math.random() * Math.PI * 2,
        });
      }
    }
    
    console.log(`✨ Created ${fogParticles.length} subtle fog particles`);
    
    // ===== PHASE 3: PARTICLE SYSTEMS =====
    console.log('✨ Creating particle systems...');
    
    const particles = [];
    
    // === DUST PARTICLES (floating in air everywhere) ===
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 200; // REDUCED from 2000 - 90% less clutter!
    const dustPositions = new Float32Array(dustCount * 3);
    
    // Calculate route length for proper particle distribution
    const routeStartX = stations[0].position.x;
    const routeEndX = stations[stations.length - 1].position.x;
    const routeLength = routeEndX - routeStartX;
    
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = routeStartX + Math.random() * routeLength; // x - COVERS FULL ROUTE
      dustPositions[i * 3 + 1] = Math.random() * 200; // y (0-200)
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 400; // z
    }
    
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.3,
      fog: true,
    });
    
    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);
    
    particles.push({
      type: 'dust',
      system: dustParticles,
      driftSpeed: 0.05,
    });
    
    // === LIGHT SHAFTS / GOD RAYS (volumetric light beams from sky) ===
    stations.forEach((station, index) => {
      // Add 1-2 dramatic light shafts per landmark
      const shaftCount = 1 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < shaftCount; i++) {
        const shaftGeometry = new THREE.BufferGeometry();
        const particleCount = 80;
        const shaftPositions = new Float32Array(particleCount * 3);
        const shaftVelocities = [];
        
        // Position of light shaft
        const baseX = station.position.x + (Math.random() - 0.5) * 100;
        const baseZ = (Math.random() - 0.5) * 80;
        
        for (let j = 0; j < particleCount; j++) {
          // Particles in a cone shape falling from sky
          const height = Math.random() * 150 + 50;
          const spread = (1 - height / 200) * 20; // Wider at bottom
          
          shaftPositions[j * 3] = baseX + (Math.random() - 0.5) * spread;
          shaftPositions[j * 3 + 1] = height;
          shaftPositions[j * 3 + 2] = baseZ + (Math.random() - 0.5) * spread;
          
          shaftVelocities.push({
            y: -0.1 - Math.random() * 0.15, // Slow downward drift
            life: Math.random(),
          });
        }
        
        shaftGeometry.setAttribute('position', new THREE.BufferAttribute(shaftPositions, 3));
        
        const shaftMaterial = new THREE.PointsMaterial({
          color: 0xfff8dc, // Warm light color
          size: 3,
          transparent: true,
          opacity: 0.25,
          fog: true,
          blending: THREE.AdditiveBlending, // Glowing effect
        });
        
        const lightShaft = new THREE.Points(shaftGeometry, shaftMaterial);
        scene.add(lightShaft);
        
        particles.push({
          type: 'lightShaft',
          system: lightShaft,
          velocities: shaftVelocities,
          baseX: baseX,
          baseZ: baseZ,
        });
      }
    });
    
    // === AMBIENT LIGHT PARTICLES (sparkles in the air) ===
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparkleCount = 80; // REDUCED from 800 - 90% less clutter!
    const sparklePositions = new Float32Array(sparkleCount * 3);
    
    for (let i = 0; i < sparkleCount; i++) {
      sparklePositions[i * 3] = routeStartX + Math.random() * routeLength; // COVERS FULL ROUTE
      sparklePositions[i * 3 + 1] = Math.random() * 150;
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    
    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    
    const sparkleMaterial = new THREE.PointsMaterial({
      color: 0xffffcc,
      size: 2.5, // Slightly larger
      transparent: true,
      opacity: 0.7,
      fog: true,
      blending: THREE.AdditiveBlending, // Makes them glow
    });
    
    const sparkleParticles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    scene.add(sparkleParticles);
    
    particles.push({
      type: 'sparkle',
      system: sparkleParticles,
      twinkleSpeed: 0.03,
    });
    
    // === FALLING LEAVES / PETALS (organic movement) ===
    const leafGeometry = new THREE.BufferGeometry();
    const leafCount = 100; // REDUCED from 300 for cleaner air
    const leafPositions = new Float32Array(leafCount * 3);
    const leafVelocities = [];
    
    for (let i = 0; i < leafCount; i++) {
      leafPositions[i * 3] = routeStartX + Math.random() * routeLength; // COVERS FULL ROUTE
      leafPositions[i * 3 + 1] = Math.random() * 180;
      leafPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
      
      leafVelocities.push({
        x: (Math.random() - 0.5) * 0.2,
        y: -0.1 - Math.random() * 0.15,
        z: (Math.random() - 0.5) * 0.2,
        swirl: Math.random() * Math.PI * 2,
      });
    }
    
    leafGeometry.setAttribute('position', new THREE.BufferAttribute(leafPositions, 3));
    
    const leafMaterial = new THREE.PointsMaterial({
      color: 0xd4a574, // Autumn leaf color
      size: 3,
      transparent: true,
      opacity: 0.6,
      fog: true,
    });
    
    const leafParticles = new THREE.Points(leafGeometry, leafMaterial);
    scene.add(leafParticles);
    
    particles.push({
      type: 'leaf',
      system: leafParticles,
      velocities: leafVelocities,
    });
    
    console.log(`✨ Created ${particles.length} particle systems`);
    
    // ===== PHASE 4: WAVING FLAGS ON BUILDINGS =====
    console.log('🚩 Adding flags to buildings...');
    
    const flags = [];
    
    // Find tall buildings and add flags
    stations.forEach((station, stationIndex) => {
      // Add 2-4 flags per city
      const flagCount = 2 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < flagCount; i++) {
        // Flag geometry (simple plane)
        const flagGeometry = new THREE.PlaneGeometry(6, 4, 10, 8);
        const flagMaterial = new THREE.MeshStandardMaterial({ 
          color: [0xe74c3c, 0x3498db, 0xf39c12, 0x2ecc71][Math.floor(Math.random() * 4)],
          side: THREE.DoubleSide,
          roughness: 0.8,
        });
        
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        
        // Position on top of buildings
        const buildingX = station.position.x + (Math.random() - 0.5) * 60;
        const buildingHeight = 40 + Math.random() * 60;
        const buildingZ = (Math.random() - 0.5) * 50;
        
        flag.position.set(buildingX, buildingHeight + station.position.y, buildingZ);
        
        // Store original vertex positions for wave animation
        const positions = flag.geometry.attributes.position.array;
        const originalPositions = new Float32Array(positions.length);
        for (let j = 0; j < positions.length; j++) {
          originalPositions[j] = positions[j];
        }
        
        scene.add(flag);
        
        flags.push({
          mesh: flag,
          originalPositions: originalPositions,
          waveSpeed: 2 + Math.random(),
          waveAmplitude: 0.5 + Math.random() * 0.3,
          phaseOffset: Math.random() * Math.PI * 2,
        });
      }
    });
    
    console.log(`🚩 Created ${flags.length} flags`);
    
    // ===== PHASE 4: DRIFTING CLOUDS =====
    console.log('☁️ Creating clouds...');
    
    const clouds = [];
    const cloudCount = 15;
    
    for (let i = 0; i < cloudCount; i++) {
      // Cloud made of spheres
      const cloudGroup = new THREE.Group();
      const puffCount = 4 + Math.floor(Math.random() * 4);
      
      for (let j = 0; j < puffCount; j++) {
        const puffGeometry = new THREE.SphereGeometry(8 + Math.random() * 6, 8, 8);
        const puffMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xffffff,
          transparent: true,
          opacity: 0.4 + Math.random() * 0.2,
          fog: false, // Don't apply scene fog to clouds
        });
        
        const puff = new THREE.Mesh(puffGeometry, puffMaterial);
        puff.position.set(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 15
        );
        puff.scale.set(1, 0.6 + Math.random() * 0.4, 1);
        
        cloudGroup.add(puff);
      }
      
      // Position clouds high in the sky ACROSS FULL ROUTE
      cloudGroup.position.set(
        routeStartX + Math.random() * routeLength,
        140 + Math.random() * 60,
        (Math.random() - 0.5) * 400
      );
      
      scene.add(cloudGroup);
      
      clouds.push({
        group: cloudGroup,
        driftSpeed: 0.05 + Math.random() * 0.1,
        driftDirection: Math.random() * Math.PI * 2,
      });
    }
    
    console.log(`☁️ Created ${clouds.length} clouds`);
    
    // ===== PHASE 2 & 4: ANIMATED ELEMENTS & ENHANCEMENTS =====
    console.log("⚡ Adding dynamic elements...");
    
    // Create arrays to hold animated objects
    const animatedObjects = [];
    const animatedWater = [];
    
    // Find and animate wind turbines (De Aar)
    scene.traverse((object) => {
      // Rotate wind turbine blades
      if (object.geometry && object.geometry.type === 'BoxGeometry') {
        const geo = object.geometry;
        // Check if it's a turbine blade (thin and tall)
        if (geo.parameters && geo.parameters.width === 1 && geo.parameters.height === 20) {
          animatedObjects.push({
            type: 'turbineBlade',
            object: object,
            rotationSpeed: 0.01 + Math.random() * 0.005
          });
        }
      }
      
      // Find water surfaces for animation
      if (object.material && object.material.color) {
        const color = object.material.color.getHex();
        // Ocean water (Cape Town) or Big Hole water
        if (color === 0x1e5f74 || color === 0x0d2b3a) {
          // Store original geometry for wave animation
          if (object.geometry.attributes && object.geometry.attributes.position) {
            const positions = object.geometry.attributes.position.array;
            const originalPositions = new Float32Array(positions.length);
            for (let i = 0; i < positions.length; i++) {
              originalPositions[i] = positions[i];
            }
            
            animatedWater.push({
              object: object,
              originalPositions: originalPositions,
              waveSpeed: 0.3 + Math.random() * 0.2,
              waveHeight: color === 0x1e5f74 ? 0.8 : 0.3, // Ocean has bigger waves
              waveFrequency: 0.5 + Math.random() * 0.3,
            });
          }
        }
      }
      
      // Enhance emissive materials for better bloom
      if (object.material && object.material.emissive) {
        if (object.material.emissiveIntensity > 0) {
          // Boost emissive for bloom effect
          object.material.emissiveIntensity *= 1.5;
        }
      }
    });
    
    console.log(`✨ Found ${animatedObjects.length} animated objects`);
    console.log(`🌊 Found ${animatedWater.length} water surfaces`);

    // ===== POST-PROCESSING SETUP =====
    console.log('🎨 Setting up post-processing effects...');
    
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    
    // 1. Render Pass (base scene render)
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // 2. SSAO Pass (Ambient Occlusion - LIGHTWEIGHT for performance)
    // Note: SSAO can be disabled entirely if FPS is still an issue
    const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
    ssaoPass.kernelRadius = 2; // VERY reduced for performance
    ssaoPass.minDistance = 0.01;
    ssaoPass.maxDistance = 0.03;
    ssaoPass.output = SSAOPass.OUTPUT.Default;
    composer.addPass(ssaoPass);
    
    // 3. Bloom Pass (Glowing highlights on emissive materials - BOOSTED)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2,    // strength (INCREASED for dramatic AAA look)
      0.6,    // radius (wider glow)
      0.75    // threshold (more things glow)
    );
    composer.addPass(bloomPass);
    
    // 4. PHASE 4: Color Correction / Grading (warm, vibrant cinematic look)
    const colorCorrectionShader = {
      uniforms: {
        tDiffuse: { value: null },
        brightness: { value: 0.05 },
        contrast: { value: 0.12 },
        saturation: { value: 0.2 },
        warmth: { value: 0.15 }, // Warm color shift
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float brightness;
        uniform float contrast;
        uniform float saturation;
        uniform float warmth;
        varying vec2 vUv;
        
        vec3 adjustSaturation(vec3 color, float adjustment) {
          const vec3 W = vec3(0.2125, 0.7154, 0.0721);
          vec3 intensity = vec3(dot(color, W));
          return mix(intensity, color, 1.0 + adjustment);
        }
        
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec3 color = texel.rgb;
          
          // Brightness
          color += brightness;
          
          // Contrast
          color = (color - 0.5) * (1.0 + contrast) + 0.5;
          
          // Saturation
          color = adjustSaturation(color, saturation);
          
          // Warmth (shift toward orange/red)
          color.r += warmth * 0.1;
          color.g += warmth * 0.05;
          
          gl_FragColor = vec4(color, texel.a);
        }
      `
    };
    
    const colorCorrectionPass = new ShaderPass(colorCorrectionShader);
    composer.addPass(colorCorrectionPass);
    
    // 5. PHASE 4: Vignette (darkened edges for cinematic focus)
    const vignetteShader = {
      uniforms: {
        tDiffuse: { value: null },
        offset: { value: 0.85 },
        darkness: { value: 1.3 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float offset;
        uniform float darkness;
        varying vec2 vUv;
        
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
          float vignette = 1.0 - dot(uv, uv);
          vignette = clamp(pow(vignette, darkness), 0.0, 1.0);
          
          gl_FragColor = vec4(texel.rgb * vignette, texel.a);
        }
      `
    };
    
    const vignettePass = new ShaderPass(vignetteShader);
    composer.addPass(vignettePass);
    
    // 6. FXAA Pass (Anti-aliasing - smooth edges) - MUST BE LAST
    const fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = renderer.getPixelRatio();
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
    composer.addPass(fxaaPass);
    
    console.log('✨ Post-processing effects ready!');
    
    // ===== WINDOW RESIZE HANDLER =====
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      
      if (composerRef.current) {
        composerRef.current.setSize(width, height);
        
        // Update FXAA resolution
        const pixelRatio = renderer.getPixelRatio();
        const passes = composerRef.current.passes;
        passes.forEach(pass => {
          if (pass.material && pass.material.uniforms && pass.material.uniforms.resolution) {
            pass.material.uniforms.resolution.value.x = 1 / (width * pixelRatio);
            pass.material.uniforms.resolution.value.y = 1 / (height * pixelRatio);
          }
        });
      }
    };
    
    window.addEventListener('resize', handleResize);

    // ===== CAMERA PATH ANIMATION =====
    let animationProgress = 0;
    const totalDuration = 20000; // ✅ SLOWED: 20 seconds for smoother journey
    
    const startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      // ✅ ADD PAUSE AT FIRST STATION (Cape Town)
      // Hold at Cape Town for 15 seconds to allow Sketchfab model to load!
      const pauseDuration = 15000; // 15 second pause for model loading
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
      
      // ===== UPDATE ANIMATED OBJECTS (PHASE 2 & 3 & 4) =====
      animatedObjects.forEach(item => {
        if (item.type === 'turbineBlade') {
          item.object.rotation.z += item.rotationSpeed;
        }
      });
      
      // PHASE 4: Animate water surfaces (waves)
      animatedWater.forEach(water => {
        const positions = water.object.geometry.attributes.position.array;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < positions.length; i += 3) {
          const x = water.originalPositions[i];
          const z = water.originalPositions[i + 2];
          
          // Create wave pattern
          const wave1 = Math.sin(x * water.waveFrequency + time * water.waveSpeed) * water.waveHeight;
          const wave2 = Math.sin(z * water.waveFrequency * 0.7 + time * water.waveSpeed * 0.8) * water.waveHeight * 0.6;
          
          positions[i + 1] = water.originalPositions[i + 1] + wave1 + wave2;
        }
        
        water.object.geometry.attributes.position.needsUpdate = true;
        water.object.geometry.computeVertexNormals(); // Update lighting
      });
      
      // Animate fog particles (gentle drift and float)
      const time = Date.now() * 0.001;
      fogParticles.forEach(particle => {
        // Gentle horizontal drift
        particle.mesh.position.x += Math.cos(particle.driftAngle) * particle.driftSpeed;
        particle.mesh.position.z += Math.sin(particle.driftAngle) * particle.driftSpeed;
        
        // Slow vertical float (up and down)
        particle.mesh.position.y += Math.sin(time + particle.floatOffset) * particle.floatSpeed;
        
        // Slowly change drift angle
        particle.driftAngle += 0.001;
      });
      
      // ===== UPDATE PARTICLE SYSTEMS (PHASE 3) =====
      particles.forEach(item => {
        if (item.type === 'dust') {
          // Gentle horizontal drift for dust
          item.system.rotation.y += 0.0002;
          const positions = item.system.geometry.attributes.position.array;
          for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += item.driftSpeed; // Drift upward slowly
            // Reset if too high
            if (positions[i + 1] > 200) {
              positions[i + 1] = 0;
            }
          }
          item.system.geometry.attributes.position.needsUpdate = true;
          
        } else if (item.type === 'lightShaft') {
          // Light particles drifting slowly downward (god rays effect)
          const positions = item.system.geometry.attributes.position.array;
          for (let i = 0; i < item.velocities.length; i++) {
            const vel = item.velocities[i];
            
            positions[i * 3 + 1] += vel.y; // Drift down
            
            vel.life += 0.005;
            
            // Reset particle when it reaches ground
            if (positions[i * 3 + 1] < 5) {
              const height = Math.random() * 150 + 50;
              const spread = (1 - height / 200) * 20;
              positions[i * 3] = item.baseX + (Math.random() - 0.5) * spread;
              positions[i * 3 + 1] = height;
              positions[i * 3 + 2] = item.baseZ + (Math.random() - 0.5) * spread;
              vel.life = 0;
            }
          }
          item.system.geometry.attributes.position.needsUpdate = true;
          
        } else if (item.type === 'leaf') {
          // Falling leaves with swirl motion
          const positions = item.system.geometry.attributes.position.array;
          for (let i = 0; i < item.velocities.length; i++) {
            const vel = item.velocities[i];
            
            // Swirling fall motion
            vel.swirl += 0.02;
            positions[i * 3] += Math.cos(vel.swirl) * 0.3 + vel.x;
            positions[i * 3 + 1] += vel.y;
            positions[i * 3 + 2] += Math.sin(vel.swirl) * 0.3 + vel.z;
            
            // Reset if too low
            if (positions[i * 3 + 1] < 0) {
              positions[i * 3] = routeStartX + Math.random() * routeLength;
              positions[i * 3 + 1] = 180;
              positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
            }
          }
          item.system.geometry.attributes.position.needsUpdate = true;
          
        } else if (item.type === 'sparkle') {
          // Twinkle effect (opacity change)
          item.system.material.opacity = 0.4 + Math.sin(time * item.twinkleSpeed) * 0.3;
          item.system.rotation.y += 0.0003;
        }
      });
      
      // ===== PHASE 4: ANIMATE FLAGS =====
      flags.forEach(flag => {
        const positions = flag.mesh.geometry.attributes.position.array;
        const time = Date.now() * 0.001;
        
        // Wave animation
        for (let i = 0; i < positions.length; i += 3) {
          const x = flag.originalPositions[i];
          const y = flag.originalPositions[i + 1];
          
          // Create wave that travels from pole (left) to edge (right)
          const wave = Math.sin(x * 2 + time * flag.waveSpeed + flag.phaseOffset) * flag.waveAmplitude;
          const edgeFactor = (x + 3) / 6; // More wave at the edge
          
          positions[i + 2] = flag.originalPositions[i + 2] + wave * edgeFactor;
        }
        
        flag.mesh.geometry.attributes.position.needsUpdate = true;
        flag.mesh.geometry.computeVertexNormals();
      });
      
      // ===== PHASE 4: ANIMATE CLOUDS =====
      clouds.forEach(cloud => {
        // Slow drift
        cloud.group.position.x += Math.cos(cloud.driftDirection) * cloud.driftSpeed;
        cloud.group.position.z += Math.sin(cloud.driftDirection) * cloud.driftSpeed;
        
        // Wrap around route boundaries
        if (cloud.group.position.x > routeEndX + 200) cloud.group.position.x = routeStartX - 200;
        if (cloud.group.position.x < routeStartX - 200) cloud.group.position.x = routeEndX + 200;
        if (cloud.group.position.z > 200) cloud.group.position.z = -200;
        if (cloud.group.position.z < -200) cloud.group.position.z = 200;
      });

      // Render with post-processing
      if (composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }

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
      
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose composer and renderer
      if (composerRef.current) {
        composerRef.current.dispose();
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
