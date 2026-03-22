// client/src/constants/longDistanceRoutes.js
// Long-distance PRASA routes with intermediate stops
// Used for cinematic route animations
//
// NOTE: intermediateStops here control the ANIMATION stops (cities with 3D terrain models).
// The server-side data has the full detailed stop list for scheduling purposes.

export const longDistanceRoutes = {
  // Cape Town to Johannesburg (Shosholoza Meyl)
  "cape-town-johannesburg": {
    from: "Cape Town",
    to: "Johannesburg",
    distance: 1532,
    duration: 26,
    intermediateStops: [
      { station: "Worcester", km: 110, hours: 2 },
      { station: "De Aar", km: 642, hours: 11 },
      { station: "Kimberley", km: 950, hours: 16 },
      { station: "Bloemfontein", km: 1125, hours: 19 },
      { station: "Kroonstad", km: 1330, hours: 23 },
    ],
  },

  // Johannesburg to Durban (East Coast Line)
  "johannesburg-durban": {
    from: "Johannesburg",
    to: "Durban",
    distance: 690,
    duration: 13,
    intermediateStops: [
      { station: "Ladysmith", km: 475, hours: 9 },
      { station: "Pietermaritzburg", km: 625, hours: 11.5 },
    ],
  },

  // Cape Town to Durban (Southern Cross Route)
  "cape-town-durban": {
    from: "Cape Town",
    to: "Durban",
    distance: 1860,
    duration: 36,
    intermediateStops: [
      { station: "Worcester", km: 110, hours: 2 },
      { station: "De Aar", km: 642, hours: 11 },
      { station: "Kimberley", km: 950, hours: 16 },
      { station: "Bloemfontein", km: 1125, hours: 19 },
      { station: "Pietermaritzburg", km: 1795, hours: 34 },
    ],
  },

  // Johannesburg to Port Elizabeth (Garden Route)
  "johannesburg-port-elizabeth": {
    from: "Johannesburg",
    to: "Port Elizabeth",
    distance: 1065,
    duration: 20,
    intermediateStops: [
      { station: "Bloemfontein", km: 400, hours: 7 },
      { station: "Graaff-Reinet", km: 780, hours: 14 },
    ],
  },

  // Johannesburg to East London (Wild Coast Route)
  "johannesburg-east-london": {
    from: "Johannesburg",
    to: "East London",
    distance: 1020,
    duration: 18,
    intermediateStops: [
      { station: "Bloemfontein", km: 400, hours: 7 },
      { station: "Queenstown", km: 850, hours: 15 },
    ],
  },

  // Pretoria to Cape Town (Blue Train / Premier Route)
  "pretoria-cape-town": {
    from: "Pretoria",
    to: "Cape Town",
    distance: 1600,
    duration: 27,
    intermediateStops: [
      { station: "Johannesburg", km: 58, hours: 1 },
      { station: "Kimberley", km: 1008, hours: 17 },
      { station: "Worcester", km: 1490, hours: 25 },
    ],
  },

  // Johannesburg to Bloemfontein
  "johannesburg-bloemfontein": {
    from: "Johannesburg",
    to: "Bloemfontein",
    distance: 400,
    duration: 7,
    intermediateStops: [
      { station: "Kroonstad", km: 195, hours: 3 },
    ],
  },

  // Durban to Port Elizabeth
  "durban-port-elizabeth": {
    from: "Durban",
    to: "Port Elizabeth",
    distance: 900,
    duration: 16,
    intermediateStops: [
      { station: "Pietermaritzburg", km: 80, hours: 1.5 },
      { station: "East London", km: 650, hours: 11 },
    ],
  },

  // Port Elizabeth to Bloemfontein
  "port-elizabeth-bloemfontein": {
    from: "Port Elizabeth",
    to: "Bloemfontein",
    distance: 650,
    duration: 12,
    intermediateStops: [
      { station: "Graaff-Reinet", km: 250, hours: 4 },
    ],
  },

  // Pretoria to Durban
  "pretoria-durban": {
    from: "Pretoria",
    to: "Durban",
    distance: 650,
    duration: 12,
    intermediateStops: [
      { station: "Johannesburg", km: 60, hours: 1 },
      { station: "Ladysmith", km: 450, hours: 8 },
      { station: "Pietermaritzburg", km: 580, hours: 10 },
    ],
  },

  // Bloemfontein to Durban
  "bloemfontein-durban": {
    from: "Bloemfontein",
    to: "Durban",
    distance: 550,
    duration: 10,
    intermediateStops: [
      { station: "Ladysmith", km: 380, hours: 7 },
      { station: "Pietermaritzburg", km: 490, hours: 9 },
    ],
  },
};

// Helper function to get route data by city names
export const getRouteData = (fromId, toId) => {
  const routeKey = `${fromId}-${toId}`;
  const reverseKey = `${toId}-${fromId}`;

  // Check forward direction
  if (longDistanceRoutes[routeKey]) {
    return longDistanceRoutes[routeKey];
  }

  // Check reverse direction (flip the data)
  if (longDistanceRoutes[reverseKey]) {
    const reverseRoute = longDistanceRoutes[reverseKey];
    return {
      from: reverseRoute.to,
      to: reverseRoute.from,
      distance: reverseRoute.distance,
      duration: reverseRoute.duration,
      intermediateStops: [...reverseRoute.intermediateStops].reverse().map(stop => ({
        ...stop,
        km: reverseRoute.distance - stop.km,
        hours: reverseRoute.duration - stop.hours,
      })),
    };
  }

  // No route data available
  return null;
};

export default {
  longDistanceRoutes,
  getRouteData,
};
