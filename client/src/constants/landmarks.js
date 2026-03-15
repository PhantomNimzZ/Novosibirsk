// client/src/constants/landmarks.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * NUCLEAR RESET - CLEAN SLATE
 * Starting fresh with cinematic Sketchfab models
 */

// GLTF LOADER FOR SKETCHFAB MODELS
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
      model.scale.set(scale, scale, scale);
      model.rotation.set(rotation.x, rotation.y, rotation.z);
      
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      group.add(model);
      
      // Debug logging
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      console.log(`✅ Loaded: ${path}`);
      console.log(`📏 Model size: width=${size.x.toFixed(1)}, height=${size.y.toFixed(1)}, depth=${size.z.toFixed(1)}`);
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      if (percent % 10 === 0) console.log(`📦 Loading ${path}: ${percent.toFixed(0)}%`);
    },
    (error) => {
      console.error(`❌ Failed to load ${path}:`, error);
    }
  );
};

// ========================================
// CINEMATIC LANDMARKS
// ========================================
export const CITY_LANDMARKS = {
  
  'Cape Town': (group) => {
    loadModel('/models/table_mountain.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 300,
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    });
  },

  // Placeholder for other cities
  _placeholder: (group) => {
    // Empty - no geometry
  },
};

// Helper function to get landmark for a city (with fallback to placeholder)
export const getLandmarkForCity = (cityName) => {
  return CITY_LANDMARKS[cityName] || CITY_LANDMARKS._placeholder;
};
