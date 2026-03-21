// client/src/constants/landmarks.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * CINEMATIC LANDMARKS
 * 
 * STANDARD: All terrain models exported from TerraPrinter at 50km × 50km
 * This ensures consistent scale and camera settings across all cities.
 * 
 * TerraPrinter GLB exports are typically oriented with Y-up but may need
 * an X-rotation of -PI/2 to lay flat. Check console output after loading.
 */

const gltfLoader = new GLTFLoader();

const loadModel = (path, group, options = {}) => {
  const {
    position = { x: 0, y: 0, z: 0 },
    scale = 1,
    rotation = { x: 0, y: 0, z: 0 },
  } = options;

  gltfLoader.load(
    path,
    (gltf) => {
      const model = gltf.scene;
      
      model.position.set(position.x, position.y, position.z);
      
      if (typeof scale === 'number') {
        model.scale.set(scale, scale, scale);
      } else {
        model.scale.set(scale.x, scale.y, scale.z);
      }
      
      model.rotation.set(rotation.x, rotation.y, rotation.z);
      
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      group.add(model);
      
      // Debug logging — use these values to tune camera settings
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      console.log(`✅ Loaded: ${path}`);
      console.log(`📏 Model size: width=${size.x.toFixed(1)}, height=${size.y.toFixed(1)}, depth=${size.z.toFixed(1)}`);
      console.log(`📍 Model center: x=${center.x.toFixed(1)}, y=${center.y.toFixed(1)}, z=${center.z.toFixed(1)}`);
      console.log(`📦 Model bounds: y=${box.min.y.toFixed(1)} to ${box.max.y.toFixed(1)}`);
      console.log(`💡 Suggested camera radius: ${(Math.max(size.x, size.z) * 0.4).toFixed(0)}`);
      console.log(`💡 Suggested camera height: ${(Math.max(size.x, size.z) * 0.3).toFixed(0)}`);
      console.log(`💡 Suggested lookAt Y: ${center.y.toFixed(0)}`);
    },
    (progress) => {
      if (progress.total > 0) {
        const percent = (progress.loaded / progress.total) * 100;
        if (Math.floor(percent) % 25 === 0) console.log(`📦 Loading ${path}: ${percent.toFixed(0)}%`);
      }
    },
    (error) => {
      console.error(`❌ Failed to load ${path}:`, error);
    }
  );
};

// ========================================
// CINEMATIC LANDMARKS
// All exported from TerraPrinter at 50km × 50km standard
// ========================================
export const CITY_LANDMARKS = {
  
  'Cape Town': (group) => {
    // Cape Town: 200×200 footprint, 39.7 terrain height
    // Without rotation: width=200, height=200, depth=39.7 (standing vertical)
    // With -PI/2 on X: lays flat with terrain height on Y axis
    loadModel('/models/cape_town.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: Math.PI }, // Lay flat + flip to correct orientation
    });
  },

  'Worcester': (group) => {
    loadModel('/models/worcester.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 }, // TerraPrinter fix: lay flat
    });
  },

  // Future cities (same standard applies):
  // 'De Aar': ...
  // 'Kimberley': ...
  // 'Bloemfontein': ...
  // 'Kroonstad': ...
  // 'Johannesburg': ...

  _placeholder: (group) => {
    // Empty - no geometry
  },
};

export const getLandmarkForCity = (cityName) => {
  return CITY_LANDMARKS[cityName] || CITY_LANDMARKS._placeholder;
};
