// client/src/constants/realStations.js
// Real PRASA Commuter Rail Stations with GPS Coordinates
// Expanded from original to include all major metro networks

export const stationCoordinatesByCity = {
  // CAPE TOWN METRO (5 lines, 29 stations)
  "cape-town": {
    // Central Line
    "Cape Town": { lat: -33.9189, lng: 18.4233 },
    "Salt River": { lat: -33.9358, lng: 18.4458 },
    "Woodstock": { lat: -33.9281, lng: 18.4472 },
    "Maitland": { lat: -33.9511, lng: 18.5100 },
    "Goodwood": { lat: -33.9739, lng: 18.5444 },
    "Parow": { lat: -33.9042, lng: 18.5797 },
    "Bellville": { lat: -33.8977, lng: 18.6296 },
    "Brackenfell": { lat: -33.8711, lng: 18.7022 },
    "Kraaifontein": { lat: -33.8489, lng: 18.7308 },
    
    // Southern Line
    "Wynberg": { lat: -34.0029, lng: 18.4656 },
    "Plumstead": { lat: -34.0178, lng: 18.4694 },
    "Retreat": { lat: -34.0454, lng: 18.4716 },
    "Steenberg": { lat: -34.0658, lng: 18.4736 },
    "Muizenberg": { lat: -34.1053, lng: 18.4700 },
    "St James": { lat: -34.1192, lng: 18.4611 },
    "Kalk Bay": { lat: -34.1283, lng: 18.4483 },
    "Fish Hoek": { lat: -34.1347, lng: 18.4333 },
    "Simon's Town": { lat: -34.1892, lng: 18.4344 },
    
    // Northern Line
    "Monte Vista": { lat: -33.8817, lng: 18.5189 },
    "Thornton": { lat: -33.8706, lng: 18.5278 },
    "Mutual": { lat: -33.8597, lng: 18.5369 },
    
    // Cape Flats Line
    "Philippi": { lat: -34.0011, lng: 18.5261 },
    "Stock Road": { lat: -33.9953, lng: 18.5389 },
    "Heideveld": { lat: -33.9897, lng: 18.5136 },
    "Langa": { lat: -33.9803, lng: 18.4944 },
    
    // Strand Line
    "Kuilsrivier": { lat: -33.9317, lng: 18.6839 },
    "Eerste River": { lat: -34.0081, lng: 18.7664 },
    "Somerset West": { lat: -34.0758, lng: 18.8447 },
    "Strand": { lat: -34.1106, lng: 18.8211 },
  },

  // DURBAN METRO (Metrorail KZN, 18 stations)
  "durban": {
    "Durban": { lat: -29.8587, lng: 31.0218 },
    "Berea": { lat: -29.8489, lng: 31.0100 },
    "Umbilo": { lat: -29.8831, lng: 30.9947 },
    "Rossburgh": { lat: -29.9133, lng: 30.9736 },
    "Jacobs": { lat: -29.9322, lng: 30.9586 },
    "Merewent": { lat: -29.9456, lng: 30.9394 },
    "Umlazi": { lat: -29.9641, lng: 30.8797 },
    "Reunion": { lat: -29.9811, lng: 30.8622 },
    
    // North Coast Line
    "Stanger": { lat: -29.3422, lng: 31.2894 },
    "Tongaat": { lat: -29.5797, lng: 31.1239 },
    "Verulam": { lat: -29.6444, lng: 31.0456 },
    
    // Inland Line
    "Pinetown": { lat: -29.8186, lng: 30.8657 },
    "New Germany": { lat: -29.7911, lng: 30.8403 },
    "Hillcrest": { lat: -29.7708, lng: 30.7667 },
    "Cato Ridge": { lat: -29.7000, lng: 30.4667 },
    
    // North Line
    "KwaMashu": { lat: -29.7462, lng: 30.9928 },
    "Phoenix": { lat: -29.6992, lng: 30.9817 },
    "Verulam Junction": { lat: -29.6536, lng: 31.0333 },
  },

  // JOHANNESBURG / PRETORIA METRO (Gautrain + Metrorail, 20 key stations shown)
  "johannesburg": {
    // Gautrain Stations
    "Johannesburg Park": { lat: -26.2041, lng: 28.0473 },
    "Rosebank": { lat: -26.1467, lng: 28.0406 },
    "Sandton": { lat: -26.1076, lng: 28.0567 },
    "Marlboro": { lat: -26.0864, lng: 28.0981 },
    "Midrand": { lat: -25.9992, lng: 28.1265 },
    "Centurion": { lat: -25.8603, lng: 28.1894 },
    "Pretoria": { lat: -25.7479, lng: 28.2293 },
    "Hatfield": { lat: -25.7503, lng: 28.2353 },
    
    // Metrorail Key Stations
    "Germiston": { lat: -26.2278, lng: 28.1704 },
    "Springs": { lat: -26.2500, lng: 28.4333 },
    "Benoni": { lat: -26.1883, lng: 28.3206 },
    "Boksburg": { lat: -26.2122, lng: 28.2625 },
    "Kempton Park": { lat: -26.1014, lng: 28.2297 },
    
    // West Rand Line
    "Roodepoort": { lat: -26.1625, lng: 27.8722 },
    "Krugersdorp": { lat: -26.0917, lng: 27.7769 },
    
    // Soweto Line
    "Soweto": { lat: -26.2678, lng: 27.8586 },
    "Mamelodi": { lat: -25.7167, lng: 28.3833 },
    "Saulsville": { lat: -25.7667, lng: 28.3000 },
    "Atteridgeville": { lat: -25.7667, lng: 28.0833 },
    "Mabopane": { lat: -25.5000, lng: 28.0833 },
  },

  // PRETORIA METRO (Separate view, overlaps with JHB)
  "pretoria": {
    "Pretoria": { lat: -25.7479, lng: 28.2293 },
    "Hatfield": { lat: -25.7503, lng: 28.2353 },
    "Centurion": { lat: -25.8603, lng: 28.1894 },
    "Irene": { lat: -25.8692, lng: 28.2219 },
    "Zwartkop": { lat: -25.8167, lng: 28.1500 },
    "Mamelodi": { lat: -25.7167, lng: 28.3833 },
    "Saulsville": { lat: -25.7667, lng: 28.3000 },
    "Mabopane": { lat: -25.5000, lng: 28.0833 },
    "Ga-Rankuwa": { lat: -25.6167, lng: 27.9833 },
    "Soshanguve": { lat: -25.4917, lng: 28.0861 },
    "Atteridgeville": { lat: -25.7667, lng: 28.0833 },
    "Hercules": { lat: -25.7867, lng: 28.1972 },
  },

  // PORT ELIZABETH METRO (Added - 8 stations)
  "port-elizabeth": {
    "Port Elizabeth": { lat: -33.9608, lng: 25.6022 },
    "Humewood": { lat: -33.9750, lng: 25.6339 },
    "Summerstrand": { lat: -33.9853, lng: 25.6639 },
    "Uitenhage": { lat: -33.7578, lng: 25.3971 },
    "Despatch": { lat: -33.8167, lng: 25.4833 },
    "Coega": { lat: -33.7833, lng: 25.6167 },
    "New Brighton": { lat: -33.8833, lng: 25.5833 },
    "Motherwell": { lat: -33.8333, lng: 25.5500 },
  },
};

// City metadata
export const cityMetadata = {
  "cape-town": {
    name: "Cape Town",
    province: "Western Cape",
    lines: 5,
    totalStations: 29,
    frequency: "Every 20-40 minutes",
    operatingHours: "05:00 - 22:00",
  },
  "durban": {
    name: "Durban",
    province: "KwaZulu-Natal",
    lines: 3,
    totalStations: 18,
    frequency: "Every 30-45 minutes",
    operatingHours: "05:30 - 21:30",
  },
  "johannesburg": {
    name: "Johannesburg / Pretoria",
    province: "Gauteng",
    lines: 8,
    totalStations: 90,
    frequency: "Every 15-30 minutes (Gautrain), 30-60 minutes (Metrorail)",
    operatingHours: "05:00 - 23:00 (Gautrain), 05:00 - 21:00 (Metrorail)",
  },
  "pretoria": {
    name: "Pretoria",
    province: "Gauteng",
    lines: 4,
    totalStations: 24,
    frequency: "Every 20-40 minutes",
    operatingHours: "05:00 - 21:00",
  },
  "port-elizabeth": {
    name: "Port Elizabeth",
    province: "Eastern Cape",
    lines: 2,
    totalStations: 8,
    frequency: "Every 45-60 minutes",
    operatingHours: "06:00 - 20:00",
  },
};

export default {
  stationCoordinatesByCity,
  cityMetadata,
};
