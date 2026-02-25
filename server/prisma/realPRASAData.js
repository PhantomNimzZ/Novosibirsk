// server/prisma/realPRASAData.js
// Real PRASA Long-Distance Railway Data
// Source: PRASA Shosholoza Meyl schedules and South African railway network

export const realRoutes = [
  // CAPE TOWN ↔ JOHANNESBURG (Premier Route)
  {
    id: 1,
    departure: "Cape Town",
    destination: "Johannesburg",
    distance: 1532, // km
    duration: 26, // hours
    intermediateStops: [
      { station: "Worcester", km: 110, hours: 2 },
      { station: "De Aar", km: 642, hours: 11 },
      { station: "Kimberley", km: 950, hours: 16 },
      { station: "Bloemfontein", km: 1125, hours: 19 },
      { station: "Kroonstad", km: 1330, hours: 23 },
    ],
  },
  
  // JOHANNESBURG ↔ DURBAN (East Coast Line)
  {
    id: 2,
    departure: "Johannesburg",
    destination: "Durban",
    distance: 690, // km
    duration: 13, // hours
    intermediateStops: [
      { station: "Germiston", km: 15, hours: 0.5 },
      { station: "Springs", km: 45, hours: 1 },
      { station: "Volksrust", km: 295, hours: 5.5 },
      { station: "Newcastle", km: 355, hours: 7 },
      { station: "Ladysmith", km: 475, hours: 9 },
      { station: "Pietermaritzburg", km: 625, hours: 11.5 },
    ],
  },
  
  // CAPE TOWN ↔ DURBAN (Southern Cross Route)
  {
    id: 3,
    departure: "Cape Town",
    destination: "Durban",
    distance: 1860, // km via Kimberley
    duration: 36, // hours
    intermediateStops: [
      { station: "Worcester", km: 110, hours: 2 },
      { station: "De Aar", km: 642, hours: 11 },
      { station: "Kimberley", km: 950, hours: 16 },
      { station: "Bloemfontein", km: 1125, hours: 19 },
      { station: "Ladysmith", km: 1590, hours: 30 },
      { station: "Pietermaritzburg", km: 1795, hours: 34 },
    ],
  },
  
  // JOHANNESBURG ↔ PORT ELIZABETH (Garden Route)
  {
    id: 4,
    departure: "Johannesburg",
    destination: "Port Elizabeth",
    distance: 1065, // km
    duration: 20, // hours
    intermediateStops: [
      { station: "Bloemfontein", km: 400, hours: 7 },
      { station: "Colesberg", km: 565, hours: 10 },
      { station: "Graaff-Reinet", km: 780, hours: 14 },
      { station: "Uitenhage", km: 1030, hours: 19 },
    ],
  },
  
  // JOHANNESBURG ↔ EAST LONDON (Wild Coast Route)
  {
    id: 5,
    departure: "Johannesburg",
    destination: "East London",
    distance: 1020, // km
    duration: 18, // hours
    intermediateStops: [
      { station: "Bloemfontein", km: 400, hours: 7 },
      { station: "Aliwal North", km: 635, hours: 11 },
      { station: "Queenstown", km: 850, hours: 15 },
    ],
  },
  
  // PRETORIA ↔ CAPE TOWN (Blue Train / Premier Route)
  {
    id: 6,
    departure: "Pretoria",
    destination: "Cape Town",
    distance: 1600, // km
    duration: 27, // hours
    intermediateStops: [
      { station: "Johannesburg", km: 58, hours: 1 },
      { station: "Kimberley", km: 1008, hours: 17 },
      { station: "De Aar", km: 1260, hours: 21 },
      { station: "Worcester", km: 1490, hours: 25 },
    ],
  },
];

export const realTrains = [
  // SHOSHOLOZA MEYL - Economy Class
  {
    name: "Shosholoza Meyl",
    trainNumber: "SM-001",
    class: "Economy",
    operator: "PRASA",
    amenities: ["Power Outlets", "Dining Car", "Luggage Racks", "Toilets"],
    seatsPerCoach: 60,
    totalSeats: 300, // 5 coaches
    priceMultiplier: 1.0, // Base price
    description: "Comfortable and affordable long-distance travel",
  },
  
  // PREMIER CLASSE - Business Class
  {
    name: "Premier Classe",
    trainNumber: "PC-001",
    class: "Business",
    operator: "PRASA",
    amenities: [
      "WiFi",
      "Power Outlets",
      "Premium Dining",
      "Lounge Access",
      "Extra Legroom",
      "Air Conditioning",
    ],
    seatsPerCoach: 40,
    totalSeats: 160, // 4 coaches
    priceMultiplier: 1.8,
    description: "Enhanced comfort with premium services",
  },
  
  // BLUE TRAIN - Luxury Class (Cape Town-Pretoria only)
  {
    name: "Blue Train",
    trainNumber: "BT-001",
    class: "Luxury",
    operator: "Rovos Rail / Blue Train",
    amenities: [
      "WiFi",
      "Power Outlets",
      "Fine Dining",
      "Butler Service",
      "Private Suites",
      "Observation Car",
      "Lounge Bar",
      "Conference Facilities",
    ],
    seatsPerCoach: 20,
    totalSeats: 80, // 4 luxury coaches
    priceMultiplier: 3.5,
    description: "World-class luxury rail experience",
    routeRestriction: ["Pretoria", "Cape Town"], // Only operates this route
  },
];

// Pricing formula: distance (km) × R0.45/km × class multiplier
// Examples:
// - Cape Town → Johannesburg (1532 km) × R0.45 × 1.0 = R690 (Economy)
// - Cape Town → Johannesburg (1532 km) × R0.45 × 1.8 = R1,242 (Business)
// - Pretoria → Cape Town (1600 km) × R0.45 × 3.5 = R2,520 (Luxury)

export const basePricePerKm = 0.45; // R0.45 per kilometer

// Schedule templates (departure times for each route)
export const scheduleTemplates = [
  { time: "06:00", label: "Early Morning" },
  { time: "09:30", label: "Morning" },
  { time: "14:00", label: "Afternoon" },
  { time: "18:30", label: "Evening" },
  { time: "22:00", label: "Night" },
];

// Major station GPS coordinates
export const stationCoordinates = {
  // Gauteng
  "Johannesburg": { lat: -26.2041, lng: 28.0473 },
  "Pretoria": { lat: -25.7479, lng: 28.2293 },
  "Germiston": { lat: -26.2278, lng: 28.1704 },
  
  // Western Cape
  "Cape Town": { lat: -33.9189, lng: 18.4233 },
  "Worcester": { lat: -33.6453, lng: 19.4487 },
  
  // Eastern Cape
  "Port Elizabeth": { lat: -33.9608, lng: 25.6022 },
  "East London": { lat: -33.0292, lng: 27.9119 },
  "Uitenhage": { lat: -33.7578, lng: 25.3971 },
  "Graaff-Reinet": { lat: -32.2522, lng: 24.5308 },
  
  // KwaZulu-Natal
  "Durban": { lat: -29.8587, lng: 31.0218 },
  "Pietermaritzburg": { lat: -29.6008, lng: 30.3794 },
  "Ladysmith": { lat: -28.5615, lng: 29.7816 },
  "Newcastle": { lat: -27.7574, lng: 29.9319 },
  
  // Free State
  "Bloemfontein": { lat: -29.1211, lng: 26.2142 },
  "Kroonstad": { lat: -27.6506, lng: 27.2340 },
  
  // Northern Cape
  "Kimberley": { lat: -28.7383, lng: 24.7637 },
  "De Aar": { lat: -30.6500, lng: 24.0128 },
  "Colesberg": { lat: -30.7172, lng: 25.0972 },
  
  // KwaZulu-Natal (cont.)
  "Volksrust": { lat: -27.3667, lng: 29.8833 },
  "Springs": { lat: -26.2500, lng: 28.4333 },
  
  // Eastern Cape (cont.)
  "Aliwal North": { lat: -30.6972, lng: 26.7111 },
  "Queenstown": { lat: -31.8976, lng: 26.8753 },
};

export default {
  realRoutes,
  realTrains,
  basePricePerKm,
  scheduleTemplates,
  stationCoordinates,
};
