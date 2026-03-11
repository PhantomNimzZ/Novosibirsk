// client/src/constants/landmarks.js
import * as THREE from 'three';

/**
 * CITY LANDMARK DEFINITIONS
 * 
 * Each city has a function that creates its 3D landmark elements
 * This keeps RouteAnimation.jsx clean and makes it easy to add new cities
 * 
 * Function signature: (group: THREE.Group) => void
 * - Receives a THREE.Group to add all landmark elements to
 * - All positions are relative to the station position
 */

export const CITY_LANDMARKS = {
  // ========================================
  // CAPE TOWN - Mother City
  // ========================================
  'Cape Town': (group) => {
    // Ocean on west and north sides
    const oceanGeometry = new THREE.CircleGeometry(75, 32, Math.PI * 0.6, Math.PI * 1.4);
    const oceanMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1e5f74,
      roughness: 0.2,
      metalness: 0.6,
    });
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(0, 3.2, 0);
    ocean.receiveShadow = true;
    group.add(ocean);
    
    // === TABLE MOUNTAIN (MASSIVE BACKDROP) ===
    const plateauWidth = 80;
    const rockMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8b7d6b,
      roughness: 1.0,
    });
    
    // Main plateau
    const plateau = new THREE.Mesh(
      new THREE.BoxGeometry(plateauWidth, 12, 25),
      rockMaterial
    );
    plateau.position.set(0, 48, -85); // ✅ NEGATIVE Z = BACK! // MUCH FURTHER BACK
    plateau.castShadow = true;
    group.add(plateau);
    
    // Upper cliff face
    const upperCliff = new THREE.Mesh(
      new THREE.BoxGeometry(plateauWidth, 22, 18),
      rockMaterial
    );
    upperCliff.position.set(0, 31, -83);
    upperCliff.castShadow = true;
    group.add(upperCliff);
    
    // Lower slopes
    const lowerSlope = new THREE.Mesh(
      new THREE.BoxGeometry(plateauWidth + 10, 18, 30),
      new THREE.MeshStandardMaterial({ color: 0x7a6f5d, roughness: 1.0 })
    );
    lowerSlope.position.set(0, 14, -78);
    lowerSlope.castShadow = true;
    group.add(lowerSlope);
    
    // Cliff details
    for (let i = 0; i < 15; i++) {
      const cliffHeight = 18 + Math.random() * 12;
      const cliff = new THREE.Mesh(
        new THREE.BoxGeometry(3, cliffHeight, 2),
        new THREE.MeshStandardMaterial({ 
          color: i % 2 === 0 ? 0x7a6f5d : 0x9b8b7a,
          roughness: 1.0,
        })
      );
      cliff.position.set(-35 + i * 5, 25 + Math.random() * 8, -72);
      cliff.castShadow = true;
      group.add(cliff);
    }
    
    // Lion's Head
    const lionsHead = new THREE.Mesh(
      new THREE.ConeGeometry(8, 28, 12),
      rockMaterial
    );
    lionsHead.position.set(-28, 20, -62);
    lionsHead.castShadow = true;
    group.add(lionsHead);
    
    // Signal Hill
    const signalHillGeometry = new THREE.SphereGeometry(10, 12, 12);
    signalHillGeometry.scale(1, 0.6, 1);
    const signalHill = new THREE.Mesh(
      signalHillGeometry,
      new THREE.MeshStandardMaterial({ color: 0x8b7d6b, roughness: 1.0 })
    );
    signalHill.position.set(-42, 8, -52);
    signalHill.castShadow = true;
    group.add(signalHill);
    
    // Vegetation on slopes
    for (let i = 0; i < 25; i++) {
      const vegetation = new THREE.Mesh(
        new THREE.SphereGeometry(3 + Math.random() * 2, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x3d5a2c, roughness: 0.95 })
      );
      const spreadX = -40 + Math.random() * 80;
      const spreadZ = -60 - Math.random() * 25; // NEGATIVE Z = BACK
      vegetation.position.set(spreadX, 8 + Math.random() * 15, spreadZ);
      vegetation.scale.set(1, 0.6, 1);
      group.add(vegetation);
    }
    
    // === CAPE TOWN STADIUM ===
    const stadiumOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(14, 16, 10, 24),
      new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.4, metalness: 0.3 })
    );
    stadiumOuter.position.set(20, 8, -15);
    stadiumOuter.castShadow = true;
    group.add(stadiumOuter);
    
    const stadiumInner = new THREE.Mesh(
      new THREE.CylinderGeometry(12, 13, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0x2d5a2c, roughness: 0.8 })
    );
    stadiumInner.position.set(20, 7, -15);
    group.add(stadiumInner);
    
    // === V&A WATERFRONT ===
    // Clock Tower
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(6, 24, 6),
      new THREE.MeshStandardMaterial({ color: 0xe8c9a8, roughness: 0.7 })
    );
    tower.position.set(-5, 15, 45); // ✅ POSITIVE Z = FRONT!
    tower.castShadow = true;
    group.add(tower);
    
    const spire = new THREE.Mesh(
      new THREE.ConeGeometry(4, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.6 })
    );
    spire.position.set(-5, 31, 45);
    spire.castShadow = true;
    group.add(spire);
    
    // Waterfront buildings
    const waterfrontBuildings = [
      { x: -25, z: 48, w: 12, h: 16, color: 0xd4a574 },
      { x: -15, z: 50, w: 14, h: 20, color: 0xe8d5c4 },
      { x: 5, z: 50, w: 10, h: 14, color: 0xc9b896 },
      { x: 15, z: 48, w: 13, h: 18, color: 0xd4c4a8 },
      { x: 25, z: 46, w: 11, h: 15, color: 0xe0d0b4 },
    ];
    
    waterfrontBuildings.forEach(b => {
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(b.w, b.h, 8),
        new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.7 })
      );
      building.position.set(b.x, b.h / 2 + 3, b.z);
      building.castShadow = true;
      group.add(building);
      
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(b.w + 1, 1, 9),
        new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.8 })
      );
      roof.position.set(b.x, b.h + 3.5, b.z);
      roof.castShadow = true;
      group.add(roof);
    });
    
    // Harbor ships
    for (let i = 0; i < 4; i++) {
      const ship = new THREE.Mesh(
        new THREE.BoxGeometry(10, 4, 14),
        new THREE.MeshStandardMaterial({ 
          color: [0xe74c3c, 0x3498db, 0xffffff, 0x2c3e50][i],
          roughness: 0.6 
        })
      );
      ship.position.set(-30 + i * 15, 5, 52); // POSITIVE Z = FRONT
      ship.castShadow = true;
      group.add(ship);
    }
    
    // === CITY BOWL - CBD ===
    for (let i = 0; i < 12; i++) {
      const height = 20 + Math.random() * 30;
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(6 + Math.random() * 4, height, 6 + Math.random() * 4),
        new THREE.MeshStandardMaterial({ 
          color: Math.random() > 0.5 ? 0xa5b5c5 : 0xb5c5d5,
          roughness: 0.4,
          metalness: 0.6,
        })
      );
      building.position.set(-25 + Math.random() * 50, height / 2 + 3, -20 + Math.random() * 30);
      building.castShadow = true;
      group.add(building);
    }
    
    // Residential areas
    for (let i = 0; i < 30; i++) {
      const height = 6 + Math.random() * 8;
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(4 + Math.random() * 3, height, 4 + Math.random() * 3),
        new THREE.MeshStandardMaterial({ 
          color: [0xf5deb3, 0xe8d5c4, 0xd4c4a8, 0xc9b896][Math.floor(Math.random() * 4)],
          roughness: 0.8,
        })
      );
      const angle = Math.random() * Math.PI * 2;
      const radius = 25 + Math.random() * 20;
      building.position.set(Math.cos(angle) * radius, height / 2 + 3, Math.sin(angle) * radius + 10);
      building.castShadow = true;
      group.add(building);
    }
    
    // === BO-KAAP (Colorful houses) ===
    const boKaapColors = [0xe74c3c, 0xf39c12, 0x3498db, 0x9b59b6, 0x1abc9c, 0xe67e22];
    for (let i = 0; i < 15; i++) {
      const row = Math.floor(i / 5);
      const col = i % 5;
      
      const house = new THREE.Mesh(
        new THREE.BoxGeometry(5, 8, 6),
        new THREE.MeshStandardMaterial({ color: boKaapColors[col], roughness: 0.8 })
      );
      house.position.set(-35 + col * 6, 6 + row * 3, -5 - row * 8);
      house.castShadow = true;
      group.add(house);
      
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(4.5, 3, 4),
        new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 })
      );
      roof.position.set(-35 + col * 6, 12 + row * 3, -5 - row * 8);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      group.add(roof);
    }
    
    // Roads
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.9 });
    
    const road1 = new THREE.Mesh(new THREE.PlaneGeometry(100, 4), roadMaterial);
    road1.rotation.x = -Math.PI / 2;
    road1.position.set(0, 3.1, 10);
    group.add(road1);
    
    const road2 = new THREE.Mesh(new THREE.PlaneGeometry(100, 4), roadMaterial);
    road2.rotation.x = -Math.PI / 2;
    road2.rotation.z = Math.PI / 2;
    road2.position.set(0, 3.1, 0);
    group.add(road2);
  },

  // ========================================
  // JOHANNESBURG - City of Gold
  // ========================================
  'Johannesburg': (group) => {
    // === CARLTON CENTRE (Iconic tall building) ===
    const carltonMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x6a7a8a,
      roughness: 0.12,
      metalness: 0.88,
    });
    
    // Main tower
    const carltonTower = new THREE.Mesh(
      new THREE.BoxGeometry(18, 100, 18),
      carltonMaterial
    );
    carltonTower.position.set(0, 53, 0);
    carltonTower.castShadow = true;
    group.add(carltonTower);
    
    // Cylindrical top
    const carltonTop = new THREE.Mesh(
      new THREE.CylinderGeometry(10, 10, 24, 16),
      carltonMaterial
    );
    carltonTop.position.set(0, 115, 0);
    carltonTop.castShadow = true;
    group.add(carltonTop);
    
    // Windows
    for (let floor = 0; floor < 14; floor++) {
      for (let side = 0; side < 4; side++) {
        for (let w = 0; w < 4; w++) {
          const isLit = Math.random() > 0.25;
          const window = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 3.2),
            new THREE.MeshStandardMaterial({ 
              color: isLit ? 0xfff4e0 : 0x2a2a2a,
              emissive: isLit ? 0xffeb3b : 0x000000,
              emissiveIntensity: isLit ? 0.65 : 0,
            })
          );
          const angle = (side / 4) * Math.PI * 2;
          window.position.set(
            Math.sin(angle) * 9.1 + (w - 1.5) * 1.8 * Math.cos(angle),
            8 + floor * 7,
            Math.cos(angle) * 9.1 - (w - 1.5) * 1.8 * Math.sin(angle)
          );
          window.rotation.y = -angle;
          group.add(window);
        }
      }
    }
    
    // Antenna
    const carltonAntenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 1, 18, 8),
      new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.95, roughness: 0.08 })
    );
    carltonAntenna.position.set(0, 136, 0);
    carltonAntenna.castShadow = true;
    group.add(carltonAntenna);
    
    // Red warning light
    const carltonLight = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 8, 8),
      new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.8,
      })
    );
    carltonLight.position.set(0, 145, 0);
    group.add(carltonLight);
    
    // === OTHER SKYSCRAPERS ===
    const skyscrapers = [
      { w: 14, h: 95, d: 14, x: -24, z: -8, color: 0x6b8cae },
      { w: 13, h: 88, d: 13, x: 22, z: 10, color: 0x5f8aa8 },
      { w: 12, h: 82, d: 12, x: -15, z: 22, color: 0x7f95a3 },
      { w: 11, h: 75, d: 11, x: 18, z: -18, color: 0x8899aa },
      { w: 15, h: 92, d: 15, x: -32, z: 15, color: 0x7a8a9a },
    ];
    
    skyscrapers.forEach(b => {
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(b.w, b.h, b.d),
        new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.15, metalness: 0.85 })
      );
      building.position.set(b.x, b.h / 2 + 3, b.z);
      building.castShadow = true;
      group.add(building);
    });
    
    // === OFFICE BUILDINGS ===
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 35 + Math.random() * 15;
      const height = 25 + Math.random() * 35;
      const width = 8 + Math.random() * 4;
      
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, width),
        new THREE.MeshStandardMaterial({ 
          color: Math.random() > 0.5 ? 0xa5b5c5 : 0xb5c5d5,
          roughness: 0.4,
          metalness: 0.6,
        })
      );
      building.position.set(Math.cos(angle) * radius, height / 2 + 3, Math.sin(angle) * radius);
      building.castShadow = true;
      group.add(building);
      
      // Windows (80% lit)
      if (Math.random() > 0.2) {
        for (let floor = 0; floor < Math.floor(height / 5); floor++) {
          const isLit = Math.random() > 0.2;
          const window = new THREE.Mesh(
            new THREE.PlaneGeometry(width * 0.7, 2),
            new THREE.MeshStandardMaterial({ 
              color: isLit ? 0xfff8e7 : 0x333333,
              emissive: isLit ? 0xffeb3b : 0x000000,
              emissiveIntensity: isLit ? 0.5 : 0,
            })
          );
          window.position.set(Math.cos(angle) * radius, 5 + floor * 5, Math.sin(angle) * radius + width / 2 + 0.1);
          window.rotation.y = -angle;
          group.add(window);
        }
      }
    }
    
    // === ROADS ===
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.9 });
    
    const road1 = new THREE.Mesh(new THREE.PlaneGeometry(120, 5), roadMaterial);
    road1.rotation.x = -Math.PI / 2;
    road1.position.set(0, 3.1, 0);
    group.add(road1);
    
    const road2 = new THREE.Mesh(new THREE.PlaneGeometry(120, 5), roadMaterial);
    road2.rotation.x = -Math.PI / 2;
    road2.rotation.z = Math.PI / 2;
    road2.position.set(0, 3.1, 0);
    group.add(road2);
    
    // === PARK AREAS ===
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const parkRadius = 55;
      const park = new THREE.Mesh(
        new THREE.CircleGeometry(10, 16),
        new THREE.MeshStandardMaterial({ color: 0x2d5a2c, roughness: 0.95 })
      );
      park.rotation.x = -Math.PI / 2;
      park.position.set(Math.cos(angle) * parkRadius, 3.2, Math.sin(angle) * parkRadius);
      group.add(park);
      
      // Trees in park
      for (let t = 0; t < 5; t++) {
        const tree = new THREE.Mesh(
          new THREE.SphereGeometry(3, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0x3d5a2c, roughness: 0.9 })
        );
        tree.position.set(
          Math.cos(angle) * parkRadius + (Math.random() - 0.5) * 8,
          6,
          Math.sin(angle) * parkRadius + (Math.random() - 0.5) * 8
        );
        group.add(tree);
      }
    }
  },

  // ========================================
  // DURBAN - Beachfront City
  // ========================================
  'Durban': (group) => {
    // Ocean (east side - Indian Ocean)
    const ocean = new THREE.Mesh(
      new THREE.CircleGeometry(75, 32, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x1a5f74, roughness: 0.2, metalness: 0.6 })
    );
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(0, 3.2, -30);
    ocean.receiveShadow = true;
    group.add(ocean);
    
    // === MOSES MABHIDA STADIUM (iconic arch) ===
    const stadiumBase = new THREE.Mesh(
      new THREE.CylinderGeometry(16, 18, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3, metalness: 0.4 })
    );
    stadiumBase.position.set(0, 9, -10);
    stadiumBase.castShadow = true;
    group.add(stadiumBase);
    
    // Stadium arch
    const archCurve = new THREE.TorusGeometry(20, 1.5, 16, 32, Math.PI);
    const arch = new THREE.Mesh(
      archCurve,
      new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.8, roughness: 0.2 })
    );
    arch.rotation.x = Math.PI / 2;
    arch.position.set(0, 30, -10);
    arch.castShadow = true;
    group.add(arch);
    
    // === BEACHFRONT PROMENADE ===
    const promenade = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 10),
      new THREE.MeshStandardMaterial({ color: 0xd4c4a8, roughness: 0.8 })
    );
    promenade.rotation.x = -Math.PI / 2;
    promenade.position.set(0, 3.1, -35);
    group.add(promenade);
    
    // === HOTELS & BUILDINGS ===
    const buildings = [
      { x: -30, z: -25, w: 14, h: 45, color: 0xa5b5c5 },
      { x: -15, z: -22, w: 16, h: 52, color: 0xb5c5d5 },
      { x: 0, z: -20, w: 12, h: 38, color: 0x9aa5b5 },
      { x: 15, z: -22, w: 15, h: 48, color: 0xa8b5c5 },
      { x: 30, z: -25, w: 13, h: 42, color: 0xb0c0d0 },
    ];
    
    buildings.forEach(b => {
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(b.w, b.h, 12),
        new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.4, metalness: 0.6 })
      );
      building.position.set(b.x, b.h / 2 + 3, b.z);
      building.castShadow = true;
      group.add(building);
    });
    
    // === PALM TREES along beach ===
    for (let i = 0; i < 12; i++) {
      const x = -40 + i * 7;
      
      // Trunk
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 1, 12, 8),
        new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 1.0 })
      );
      trunk.position.set(x, 9, -32);
      trunk.castShadow = true;
      group.add(trunk);
      
      // Palm fronds
      for (let f = 0; f < 6; f++) {
        const frond = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 6, 0.2),
          new THREE.MeshStandardMaterial({ color: 0x2d5016, roughness: 0.9 })
        );
        const frondAngle = (f / 6) * Math.PI * 2;
        frond.position.set(x, 15, -32);
        frond.rotation.set(Math.PI / 3, frondAngle, 0);
        frond.castShadow = true;
        group.add(frond);
      }
    }
    
    // Roads
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.9 });
    const road = new THREE.Mesh(new THREE.PlaneGeometry(100, 6), roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 3.1, 0);
    group.add(road);
  },
  
  // ========================================
  // WORCESTER - Wine Valley
  // ========================================
  'Worcester': (group) => {
    // === ROLLING GREEN HILLS ===
    for (let i = 0; i < 3; i++) {
      const hillGeometry = new THREE.SphereGeometry(22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const hill = new THREE.Mesh(
        hillGeometry,
        new THREE.MeshStandardMaterial({ color: 0x7a9b57, roughness: 0.85 })
      );
      hill.position.set((i - 1) * 32, 0, 15);
      hill.castShadow = true;
      group.add(hill);
    }
    
    // === VINEYARD ROWS ===
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 10; col++) {
        // Vineyard post
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 4, 8),
          new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 1.0 })
        );
        post.position.set(-25 + col * 5, 2, -20 + row * 4);
        post.castShadow = true;
        group.add(post);
        
        // Grape foliage on top
        if (Math.random() > 0.3) {
          const foliage = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 6, 6),
            new THREE.MeshStandardMaterial({ color: 0x4a6741, roughness: 0.9 })
          );
          foliage.position.set(-25 + col * 5, 4.5, -20 + row * 4);
          group.add(foliage);
        }
      }
    }
    
    // === WINERY BUILDING ===
    const winery = new THREE.Mesh(
      new THREE.BoxGeometry(25, 18, 20),
      new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.7 })
    );
    winery.position.set(0, 12, -35);
    winery.castShadow = true;
    group.add(winery);
    
    // Winery roof
    const wineryRoof = new THREE.Mesh(
      new THREE.ConeGeometry(18, 8, 4),
      new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.9 })
    );
    wineryRoof.position.set(0, 25, -35);
    wineryRoof.rotation.y = Math.PI / 4;
    wineryRoof.castShadow = true;
    group.add(wineryRoof);
    
    // === WINE BARRELS (decorative) ===
    for (let i = 0; i < 6; i++) {
      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 5, 12),
        new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 })
      );
      barrel.position.set(-15 + i * 6, 2.5, -45);
      barrel.rotation.z = Math.PI / 2;
      barrel.castShadow = true;
      group.add(barrel);
    }
    
    // Trees around perimeter
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 45;
      
      const tree = new THREE.Mesh(
        new THREE.SphereGeometry(4, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x4a6741, roughness: 0.9 })
      );
      tree.position.set(Math.cos(angle) * radius, 7, Math.sin(angle) * radius);
      tree.castShadow = true;
      group.add(tree);
    }
    
    // Road
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 5),
      new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.9 })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 3.1, 5);
    group.add(road);
  },

  // ========================================
  // DE AAR - Karoo Wind Farm
  // ========================================
  'De Aar': (group) => {
    // === WIND TURBINES ===
    for (let i = 0; i < 5; i++) {
      // Tower
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 3, 45, 8),
        new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.5, metalness: 0.3 })
      );
      tower.position.set((i - 2) * 30, 22.5, (i % 2) * 10);
      tower.castShadow = true;
      group.add(tower);
      
      // Nacelle (turbine housing)
      const nacelle = new THREE.Mesh(
        new THREE.BoxGeometry(4, 3, 8),
        new THREE.MeshStandardMaterial({ color: 0xd3d3d3, roughness: 0.4 })
      );
      nacelle.position.set((i - 2) * 30, 46, (i % 2) * 10);
      nacelle.castShadow = true;
      group.add(nacelle);
      
      // Rotor blades (3 blades)
      for (let b = 0; b < 3; b++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(1, 20, 0.5),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
        );
        blade.position.set((i - 2) * 30, 46, (i % 2) * 10 + 4);
        blade.rotation.z = (b * Math.PI * 2 / 3);
        blade.castShadow = true;
        group.add(blade);
      }
    }
    
    // === KAROO DESERT SCRUB ===
    for (let i = 0; i < 20; i++) {
      const scrub = new THREE.Mesh(
        new THREE.SphereGeometry(1.5 + Math.random(), 6, 6),
        new THREE.MeshStandardMaterial({ color: 0x8b8b6b, roughness: 0.95 })
      );
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 25;
      scrub.position.set(Math.cos(angle) * radius, 2, Math.sin(angle) * radius);
      scrub.scale.set(1, 0.6, 1);
      group.add(scrub);
    }
    
    // Maintenance shed
    const shed = new THREE.Mesh(
      new THREE.BoxGeometry(12, 8, 10),
      new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8 })
    );
    shed.position.set(-40, 7, -20);
    shed.castShadow = true;
    group.add(shed);
    
    // Dirt road
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 5),
      new THREE.MeshStandardMaterial({ color: 0x9a8b7a, roughness: 0.95 })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 3.1, 0);
    group.add(road);
    
    // Rocky outcrops
    for (let i = 0; i < 5; i++) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(4 + Math.random() * 3),
        new THREE.MeshStandardMaterial({ color: 0x7a6f5d, roughness: 1.0 })
      );
      rock.position.set(-30 + i * 15, 4, 25 + Math.random() * 10);
      rock.castShadow = true;
      group.add(rock);
    }
  },

  // ========================================
  // KIMBERLEY - The Big Hole (Mining Museum)
  // ========================================
  'Kimberley': (group) => {
    // === THE BIG HOLE (Giant crater) ===
    const crater = new THREE.Mesh(
      new THREE.CylinderGeometry(42, 32, 32, 32, 3, true),
      new THREE.MeshStandardMaterial({ color: 0x5a524a, roughness: 1.0, side: THREE.DoubleSide })
    );
    crater.position.y = -16;
    crater.castShadow = true;
    crater.receiveShadow = true;
    group.add(crater);
    
    // Rock strata layers (geological bands)
    for (let layer = 0; layer < 4; layer++) {
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(40 - layer * 2, 34 - layer * 2, 2, 32, 1, true),
        new THREE.MeshStandardMaterial({ 
          color: layer % 2 === 0 ? 0x6b5d52 : 0x4a403a,
          roughness: 0.95,
          side: THREE.DoubleSide,
        })
      );
      band.position.y = -8 - layer * 8;
      group.add(band);
    }
    
    // Deep water at bottom (very dark)
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(30, 32),
      new THREE.MeshStandardMaterial({ color: 0x0d2b3a, roughness: 0.1, metalness: 0.7 })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = -31;
    water.receiveShadow = true;
    group.add(water);
    
    // === MUSEUM BUILDINGS ===
    const museumBuildings = [
      { x: 45, z: 10, w: 14, h: 12 },
      { x: 45, z: -10, w: 16, h: 14 },
      { x: -45, z: 0, w: 12, h: 10 },
    ];
    
    museumBuildings.forEach(b => {
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(b.w, b.h, b.w),
        new THREE.MeshStandardMaterial({ color: 0xb8a88a, roughness: 0.7 })
      );
      building.position.set(b.x, b.h / 2 + 3, b.z);
      building.castShadow = true;
      group.add(building);
    });
    
    // Viewing walkway (circular around rim)
    const walkway = new THREE.Mesh(
      new THREE.TorusGeometry(40, 1.5, 8, 32),
      new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.7 })
    );
    walkway.rotation.x = Math.PI / 2;
    walkway.position.y = 3;
    group.add(walkway);
    
    // === HISTORICAL MINING HEADFRAMES ===
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 48;
      
      // Main vertical frame
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(3, 15, 3),
        new THREE.MeshStandardMaterial({ color: 0x704214, roughness: 0.9, metalness: 0.3 })
      );
      frame.position.set(Math.cos(angle) * radius, 10.5, Math.sin(angle) * radius);
      frame.castShadow = true;
      group.add(frame);
      
      // Cross beam
      const crossBeam = new THREE.Mesh(
        new THREE.BoxGeometry(8, 1.5, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x704214, roughness: 0.9 })
      );
      crossBeam.position.set(Math.cos(angle) * radius, 18, Math.sin(angle) * radius);
      crossBeam.rotation.y = angle;
      crossBeam.castShadow = true;
      group.add(crossBeam);
    }
    
    // Old mining carts on display
    for (let i = 0; i < 4; i++) {
      const cart = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2, 6),
        new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.85 })
      );
      cart.position.set(-30 + i * 20, 4, -35);
      cart.castShadow = true;
      group.add(cart);
    }
  },

  // ========================================
  // BLOEMFONTEIN - City of Roses (Naval Hill)
  // ========================================
  'Bloemfontein': (group) => {
    // === NAVAL HILL ===
    const hill = new THREE.Mesh(
      new THREE.SphereGeometry(32, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xa8895c, roughness: 0.85 })
    );
    hill.position.y = 0;
    hill.castShadow = true;
    group.add(hill);
    
    // === MONUMENT ON HILL ===
    const monumentBase = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 5, 30, 8),
      new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.4, metalness: 0.5 })
    );
    monumentBase.position.y = 32;
    monumentBase.castShadow = true;
    group.add(monumentBase);
    
    // Monument cap
    const monumentCap = new THREE.Mesh(
      new THREE.SphereGeometry(4.5, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.4 })
    );
    monumentCap.position.y = 52;
    monumentCap.castShadow = true;
    group.add(monumentCap);
    
    // === CITY BUILDINGS ===
    for (let i = 0; i < 10; i++) {
      const height = 12 + Math.random() * 15;
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(8, height, 8),
        new THREE.MeshStandardMaterial({ color: 0xb8a88a, roughness: 0.6 })
      );
      const angle = (i / 10) * Math.PI * 2;
      const radius = 38 + Math.random() * 8;
      building.position.set(Math.cos(angle) * radius, height / 2 + 3, Math.sin(angle) * radius);
      building.castShadow = true;
      group.add(building);
      
      // Flat roofs
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(9, 1, 9),
        new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.8 })
      );
      roof.position.set(Math.cos(angle) * radius, height + 3.5, Math.sin(angle) * radius);
      roof.castShadow = true;
      group.add(roof);
    }
    
    // === ROSE GARDENS ===
    for (let i = 0; i < 4; i++) {
      const garden = new THREE.Mesh(
        new THREE.CircleGeometry(8, 16),
        new THREE.MeshStandardMaterial({ color: 0x4a6741, roughness: 0.9 })
      );
      const angle = (i / 4) * Math.PI * 2;
      garden.rotation.x = -Math.PI / 2;
      garden.position.set(Math.cos(angle) * 25, 3.2, Math.sin(angle) * 25);
      group.add(garden);
      
      // Rose bushes (red and yellow)
      for (let j = 0; j < 8; j++) {
        const rose = new THREE.Mesh(
          new THREE.SphereGeometry(1, 8, 8),
          new THREE.MeshStandardMaterial({ 
            color: j % 2 === 0 ? 0xe74c3c : 0xf1c40f,
            roughness: 0.7 
          })
        );
        const roseAngle = (j / 8) * Math.PI * 2;
        rose.position.set(
          Math.cos(angle) * 25 + Math.cos(roseAngle) * 5,
          5,
          Math.sin(angle) * 25 + Math.sin(roseAngle) * 5
        );
        group.add(rose);
      }
    }
    
    // Roads (grid pattern)
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.9 });
    
    const road1 = new THREE.Mesh(new THREE.PlaneGeometry(90, 5), roadMaterial);
    road1.rotation.x = -Math.PI / 2;
    road1.position.set(0, 3.1, 0);
    group.add(road1);
    
    const road2 = new THREE.Mesh(new THREE.PlaneGeometry(90, 5), roadMaterial);
    road2.rotation.x = -Math.PI / 2;
    road2.rotation.z = Math.PI / 2;
    road2.position.set(0, 3.1, 0);
    group.add(road2);
  },

  // ========================================
  // KROONSTAD - Agricultural Heartland
  // ========================================
  'Kroonstad': (group) => {
    // === GRAIN SILOS (6 silos in a row) ===
    for (let i = 0; i < 6; i++) {
      // Main silo tower
      const silo = new THREE.Mesh(
        new THREE.CylinderGeometry(6, 6, 38, 16),
        new THREE.MeshStandardMaterial({ color: 0xd3d3d3, roughness: 0.7, metalness: 0.2 })
      );
      silo.position.set((i - 2.5) * 14, 22, 0);
      silo.castShadow = true;
      group.add(silo);
      
      // Dome top
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xd3d3d3, roughness: 0.7 })
      );
      dome.position.set((i - 2.5) * 14, 41, 0);
      dome.castShadow = true;
      group.add(dome);
      
      // Catwalk between silos
      if (i < 5) {
        const catwalk = new THREE.Mesh(
          new THREE.BoxGeometry(12, 0.5, 2),
          new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7, metalness: 0.4 })
        );
        catwalk.position.set((i - 2) * 14, 35, 0);
        catwalk.castShadow = true;
        group.add(catwalk);
      }
    }
    
    // === FARM BARN ===
    const barn = new THREE.Mesh(
      new THREE.BoxGeometry(28, 16, 22),
      new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.85 })
    );
    barn.position.set(0, 11, -35);
    barn.castShadow = true;
    group.add(barn);
    
    // Barn roof (pitched)
    const barnRoof = new THREE.Mesh(
      new THREE.ConeGeometry(20, 8, 4),
      new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.9 })
    );
    barnRoof.position.set(0, 23, -35);
    barnRoof.rotation.y = Math.PI / 4;
    barnRoof.castShadow = true;
    group.add(barnRoof);
    
    // === WHEAT FIELDS ===
    for (let i = 0; i < 3; i++) {
      const field = new THREE.Mesh(
        new THREE.PlaneGeometry(25, 20),
        new THREE.MeshStandardMaterial({ color: 0xa89558, roughness: 0.95 })
      );
      field.rotation.x = -Math.PI / 2;
      field.position.set(-30 + i * 30, 3.2, 20);
      group.add(field);
    }
    
    // === TRACTORS ===
    for (let i = 0; i < 2; i++) {
      // Tractor body
      const tractor = new THREE.Mesh(
        new THREE.BoxGeometry(6, 4, 10),
        new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.6 })
      );
      tractor.position.set(-20 + i * 40, 5, 25);
      tractor.castShadow = true;
      group.add(tractor);
      
      // Wheels
      for (let w = 0; w < 2; w++) {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(2, 2, 1, 12),
          new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.8 })
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(-20 + i * 40 + (w === 0 ? -4 : 4), 2, 25);
        group.add(wheel);
      }
    }
    
    // === OUTBUILDINGS ===
    const outbuildings = [
      { x: 30, z: -25, w: 10, h: 8 },
      { x: -30, z: -20, w: 8, h: 7 },
      { x: 35, z: -40, w: 12, h: 10 },
    ];
    
    outbuildings.forEach(b => {
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(b.w, b.h, b.w),
        new THREE.MeshStandardMaterial({ color: 0xb8a88a, roughness: 0.8 })
      );
      building.position.set(b.x, b.h / 2 + 3, b.z);
      building.castShadow = true;
      group.add(building);
    });
    
    // Trees along edge
    for (let i = 0; i < 10; i++) {
      const tree = new THREE.Mesh(
        new THREE.SphereGeometry(4, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x4a6741, roughness: 0.9 })
      );
      const angle = (i / 10) * Math.PI * 2;
      tree.position.set(Math.cos(angle) * 50, 7, Math.sin(angle) * 50);
      tree.castShadow = true;
      group.add(tree);
    }
    
    // Dirt road
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 6),
      new THREE.MeshStandardMaterial({ color: 0x9a8b7a, roughness: 0.95 })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 3.1, 0);
    group.add(road);
  },

  // ========================================
  // PLACEHOLDER FUNCTION
  // Used for cities that don't have custom landmarks yet
  // ========================================
  _placeholder: (group) => {
    // Simple modern building placeholder
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(15, 35, 15),
      new THREE.MeshStandardMaterial({ 
        color: 0x7a8a9a,
        roughness: 0.6,
        metalness: 0.4,
      })
    );
    building.position.set(0, 20.5, 0);
    building.castShadow = true;
    group.add(building);
    
    // Simple plaza
    const plaza = new THREE.Mesh(
      new THREE.CircleGeometry(30, 32),
      new THREE.MeshStandardMaterial({ color: 0x9a8b7a, roughness: 0.9 })
    );
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(0, 3.2, 0);
    group.add(plaza);
  },
};

// Helper function to get landmark for a city (with fallback to placeholder)
export const getLandmarkForCity = (cityName) => {
  return CITY_LANDMARKS[cityName] || CITY_LANDMARKS._placeholder;
};
