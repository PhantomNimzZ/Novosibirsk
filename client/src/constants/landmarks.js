// client/src/constants/landmarks.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * CINEMATIC LANDMARKS & TRANSITION TERRAINS
 * 
 * Route: Cape Town → Worcester → De Aar → Kimberley → Bloemfontein → Kroonstad → Johannesburg
 * 
 * STANDARD: All terrain models exported from TerraPrinter at ~12km
 * City terrains: orbital camera pan
 * Transition terrains: forward fly-through at low angle with fog
 * 
 * Folder structure:
 *   /models/cities/       — city landmark terrains
 *   /models/transitions/  — terrain fly-through between cities
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
// CITY LANDMARKS (orbital camera pan)
// ========================================
export const CITY_LANDMARKS = {
  
  'Cape Town': (group) => {
    loadModel('/models/cities/cape_town.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: Math.PI },
    });
  },

  'Worcester': (group) => {
    loadModel('/models/cities/worcester.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'De Aar': (group) => {
    loadModel('/models/cities/de_aar.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Kimberley': (group) => {
    loadModel('/models/cities/kimberley.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Bloemfontein': (group) => {
    loadModel('/models/cities/bloemfontein.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Kroonstad': (group) => {
    loadModel('/models/cities/kroonstad.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Johannesburg': (group) => {
    loadModel('/models/cities/johannesburg.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Durban': (group) => {
    loadModel('/models/cities/durban.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Pietermaritzburg': (group) => {
    loadModel('/models/cities/pietermaritzburg.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Ladysmith': (group) => {
    loadModel('/models/cities/ladysmith.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  _placeholder: (group) => {},
};

// ========================================
// TRANSITION TERRAINS (forward fly-through)
// Key format: "FromCity_ToCity"
// ========================================
export const TRANSITION_TERRAINS = {
  
  'Cape Town_Worcester': (group) => {
    loadModel('/models/transitions/capetown_worcester.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Worcester_De Aar': (group) => {
    loadModel('/models/transitions/worcester_deaar.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'De Aar_Kimberley': (group) => {
    loadModel('/models/transitions/deaar_kimberley.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Kimberley_Bloemfontein': (group) => {
    loadModel('/models/transitions/kimberley_bloemfontein.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Bloemfontein_Kroonstad': (group) => {
    loadModel('/models/transitions/bloemfontein_kroonstad.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Kroonstad_Johannesburg': (group) => {
    loadModel('/models/transitions/kroonstad_johannesburg.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Durban_Pietermaritzburg': (group) => {
    loadModel('/models/transitions/durban_pietermaritzburg.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  // Johannesburg → Durban route transitions
  'Johannesburg_Ladysmith': (group) => {
    loadModel('/models/transitions/johannesburg_ladysmith.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Ladysmith_Pietermaritzburg': (group) => {
    loadModel('/models/transitions/pietermaritzburg_ladysmith.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Pietermaritzburg_Durban': (group) => {
    loadModel('/models/transitions/durban_pietermaritzburg.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  'Bloemfontein_Pietermaritzburg': (group) => {
    loadModel('/models/transitions/bloemfontein_pietermaritzburg.glb', group, {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    });
  },

  _placeholder: (group) => {},
};

export const getLandmarkForCity = (cityName) => {
  return CITY_LANDMARKS[cityName] || CITY_LANDMARKS._placeholder;
};

export const getTransitionTerrain = (fromCity, toCity) => {
  const key = `${fromCity}_${toCity}`;
  const reverseKey = `${toCity}_${fromCity}`;
  // Check forward direction first, then reverse (terrain is the same both ways)
  return TRANSITION_TERRAINS[key] || TRANSITION_TERRAINS[reverseKey] || TRANSITION_TERRAINS._placeholder;
};
