// client/src/constants/metroLines.js
// Metro Line Definitions for Smart Route Detection
// Each station is assigned to its line(s) with proper sequential ordering

export const metroLines = {
  "cape-town": {
    "Central Line": [
      "Cape Town",
      "Salt River",
      "Woodstock",
      "Maitland",
      "Goodwood",
      "Parow",
      "Bellville",
      "Brackenfell",
      "Kraaifontein",
    ],
    "Southern Line": [
      "Cape Town",
      "Wynberg",
      "Plumstead",
      "Retreat",
      "Steenberg",
      "Muizenberg",
      "St James",
      "Kalk Bay",
      "Fish Hoek",
      "Simon's Town",
    ],
    "Northern Line": [
      "Bellville",
      "Monte Vista",
      "Thornton",
      "Mutual",
    ],
    "Cape Flats Line": [
      "Cape Town",
      "Langa",
      "Heideveld",
      "Stock Road",
      "Philippi",
    ],
    "Strand Line": [
      "Bellville",
      "Kuilsrivier",
      "Eerste River",
      "Somerset West",
      "Strand",
    ],
  },

  "durban": {
    "South Coast Line": [
      "Durban",
      "Berea",
      "Umbilo",
      "Rossburgh",
      "Jacobs",
      "Merewent",
      "Umlazi",
      "Reunion",
    ],
    "North Coast Line": [
      "Durban",
      "Verulam",
      "Tongaat",
      "Stanger",
    ],
    "Inland Line": [
      "Durban",
      "Pinetown",
      "New Germany",
      "Hillcrest",
      "Cato Ridge",
    ],
    "North Line": [
      "Durban",
      "KwaMashu",
      "Phoenix",
      "Verulam Junction",
    ],
  },

  "johannesburg": {
    "Gautrain Main Line": [
      "Johannesburg Park",
      "Rosebank",
      "Sandton",
      "Marlboro",
      "Midrand",
      "Centurion",
      "Pretoria",
      "Hatfield",
    ],
    "East Rand Line": [
      "Johannesburg Park",
      "Germiston",
      "Boksburg",
      "Benoni",
      "Springs",
    ],
    "West Rand Line": [
      "Johannesburg Park",
      "Roodepoort",
      "Krugersdorp",
    ],
    "Soweto Line": [
      "Johannesburg Park",
      "Soweto",
    ],
    "Kempton Park Line": [
      "Johannesburg Park",
      "Kempton Park",
    ],
  },

  "pretoria": {
    "Pretoria Central Line": [
      "Pretoria",
      "Hatfield",
      "Centurion",
      "Irene",
      "Zwartkop",
    ],
    "Mamelodi Line": [
      "Pretoria",
      "Saulsville",
      "Mamelodi",
    ],
    "Mabopane Line": [
      "Pretoria",
      "Atteridgeville",
      "Ga-Rankuwa",
      "Soshanguve",
      "Mabopane",
    ],
    "Hercules Line": [
      "Pretoria",
      "Hercules",
    ],
  },

  "port-elizabeth": {
    "Main Line": [
      "Port Elizabeth",
      "Humewood",
      "Summerstrand",
      "New Brighton",
      "Motherwell",
      "Coega",
      "Despatch",
      "Uitenhage",
    ],
  },
};

// Get all unique stations for a city (for dropdown)
export function getAllStations(cityId) {
  const lines = metroLines[cityId] || {};
  const stationSet = new Set();
  
  Object.values(lines).forEach(stations => {
    stations.forEach(station => stationSet.add(station));
  });
  
  return Array.from(stationSet).sort();
}

// Find which line(s) a station belongs to
export function getStationLines(cityId, stationName) {
  const lines = metroLines[cityId] || {};
  const stationLines = [];
  
  Object.entries(lines).forEach(([lineName, stations]) => {
    if (stations.includes(stationName)) {
      stationLines.push(lineName);
    }
  });
  
  return stationLines;
}

// Check if two stations are on the same line
export function areOnSameLine(cityId, station1, station2) {
  const lines1 = getStationLines(cityId, station1);
  const lines2 = getStationLines(cityId, station2);
  
  // Find common lines
  const commonLines = lines1.filter(line => lines2.includes(line));
  
  return {
    isDirectRoute: commonLines.length > 0,
    sharedLines: commonLines,
    station1Lines: lines1,
    station2Lines: lines2,
  };
}

// Get route between two stations on a specific line
export function getRoute(cityId, station1, station2, lineName) {
  const lines = metroLines[cityId] || {};
  const lineStations = lines[lineName];
  
  if (!lineStations) return null;
  
  const index1 = lineStations.indexOf(station1);
  const index2 = lineStations.indexOf(station2);
  
  if (index1 === -1 || index2 === -1) return null;
  
  const start = Math.min(index1, index2);
  const end = Math.max(index1, index2);
  
  return lineStations.slice(start, end + 1);
}

// Find transfer route (if stations are on different lines)
export function findTransferRoute(cityId, station1, station2) {
  const lines1 = getStationLines(cityId, station1);
  const lines2 = getStationLines(cityId, station2);
  const lines = metroLines[cityId] || {};
  
  // Find transfer stations (stations that appear on both routes)
  for (const line1 of lines1) {
    for (const line2 of lines2) {
      if (line1 === line2) continue; // Skip if same line
      
      const stations1 = lines[line1];
      const stations2 = lines[line2];
      
      // Find common stations (potential transfers)
      const transferStations = stations1.filter(s => stations2.includes(s));
      
      if (transferStations.length > 0) {
        // Use the first transfer station found
        const transferStation = transferStations[0];
        
        return {
          requiresTransfer: true,
          legs: [
            {
              line: line1,
              from: station1,
              to: transferStation,
              stations: getRoute(cityId, station1, transferStation, line1),
            },
            {
              line: line2,
              from: transferStation,
              to: station2,
              stations: getRoute(cityId, transferStation, station2, line2),
            },
          ],
        };
      }
    }
  }
  
  return null; // No transfer route found
}

// Calculate route info (stops, distance estimate)
export function calculateRouteInfo(route) {
  if (!route || route.length < 2) {
    return { stops: 0, fare: 15 };
  }
  
  const stops = route.length - 1; // Number of stops between stations
  const fare = Math.max(15, stops * 10); // R15 minimum, R10 per stop
  
  return { stops, fare };
}

export default {
  metroLines,
  getAllStations,
  getStationLines,
  areOnSameLine,
  getRoute,
  findTransferRoute,
  calculateRouteInfo,
};
