// client/src/constants/longDistanceRoutes.js
// Long-distance PRASA routes with intermediate stops
// Used for cinematic route animations

export const longDistanceRoutes = {
  // Cape Town to Johannesburg (Shosholoza Meyl)
  "cape-town-johannesburg": {
    from: "Cape Town",
    to: "Johannesburg",
    distance: 1400,
    duration: 24,
    intermediateStops: [
      { station: "Worcester", km: 110, hours: 2 },
      { station: "De Aar", km: 642, hours: 11 },
      { station: "Kimberley", km: 950, hours: 16 },
      { station: "Bloemfontein", km: 1125, hours: 19 },
      { station: "Kroonstad", km: 1330, hours: 23 },
    ],
  },

  // Cape Town to Durban
  "cape-town-durban": {
    from: "Cape Town",
    to: "Durban",
    distance: 1654,
    duration: 28,
    intermediateStops: [
      { station: "Worcester", km: 110, hours: 2 },
      { station: "De Aar", km: 642, hours: 11 },
      { station: "Bloemfontein", km: 1125, hours: 19 },
      { station: "Pietermaritzburg", km: 1550, hours: 26 },
    ],
  },

  // Cape Town to Port Elizabeth
  "cape-town-port-elizabeth": {
    from: "Cape Town",
    to: "Port Elizabeth",
    distance: 764,
    duration: 14,
    intermediateStops: [
      { station: "Worcester", km: 110, hours: 2 },
      { station: "Swellendam", km: 220, hours: 4 },
      { station: "George", km: 420, hours: 7 },
      { station: "Knysna", km: 485, hours: 9 },
      { station: "Plettenberg Bay", km: 520, hours: 10 },
      { station: "Humansdorp", km: 680, hours: 12 },
    ],
  },

  // Johannesburg to Durban
  "johannesburg-durban": {
    from: "Johannesburg",
    to: "Durban",
    distance: 600,
    duration: 11,
    intermediateStops: [
      { station: "Germiston", km: 15, hours: 0.5 },
      { station: "Volksrust", km: 250, hours: 4 },
      { station: "Ladysmith", km: 400, hours: 7 },
      { station: "Pietermaritzburg", km: 530, hours: 9 },
    ],
  },

  // Johannesburg to Pretoria
  "johannesburg-pretoria": {
    from: "Johannesburg",
    to: "Pretoria",
    distance: 58,
    duration: 1,
    intermediateStops: [
      { station: "Rosebank", km: 8, hours: 0.2 },
      { station: "Sandton", km: 15, hours: 0.3 },
      { station: "Midrand", km: 30, hours: 0.5 },
      { station: "Centurion", km: 45, hours: 0.8 },
    ],
  },

  // Johannesburg to Bloemfontein
  "johannesburg-bloemfontein": {
    from: "Johannesburg",
    to: "Bloemfontein",
    distance: 400,
    duration: 7,
    intermediateStops: [
      { station: "Vereeniging", km: 60, hours: 1 },
      { station: "Kroonstad", km: 195, hours: 3 },
      { station: "Winburg", km: 310, hours: 5 },
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
      { station: "Kokstad", km: 280, hours: 5 },
      { station: "Mthatha", km: 450, hours: 8 },
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
      { station: "Uitenhage", km: 35, hours: 1 },
      { station: "Graaff-Reinet", km: 250, hours: 4 },
      { station: "Cradock", km: 310, hours: 5 },
      { station: "Middelburg", km: 460, hours: 8 },
    ],
  },

  // Pretoria to Durban
  "pretoria-durban": {
    from: "Pretoria",
    to: "Durban",
    distance: 650,
    duration: 12,
    intermediateStops: [
      { station: "Midrand", km: 28, hours: 0.5 },
      { station: "Germiston", km: 60, hours: 1 },
      { station: "Volksrust", km: 300, hours: 5 },
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
      { station: "Bethlehem", km: 180, hours: 3 },
      { station: "Harrismith", km: 280, hours: 5 },
      { station: "Ladysmith", km: 380, hours: 7 },
      { station: "Pietermaritzburg", km: 490, hours: 9 },
    ],
  },
};

// Helper function to get route data by city IDs
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
