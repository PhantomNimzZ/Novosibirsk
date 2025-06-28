export const stationCoordinatesByCity = {
  "durban": {
    Durban: { lat: -29.8587, lng: 31.0218 },
    Umlazi: { lat: -29.9645, lng: 30.8965 },
    Pinetown: { lat: -29.8156, lng: 30.8657 },
    KwaMashu: { lat: -29.7379, lng: 30.9935 }
  },
  "cape-town": {
    "Cape Town": { lat: -33.918861, lng: 18.4233 },
    Bellville: { lat: -33.8977, lng: 18.6296 },
    Wynberg: { lat: -34.0029, lng: 18.4656 },
    Retreat: { lat: -34.0454, lng: 18.4716 }
  },
  "johannesburg": {
    Johannesburg: { lat: -26.2041, lng: 28.0473 },
    Germiston: { lat: -26.2278, lng: 28.1704 },
    Midrand: { lat: -25.9992, lng: 28.1265 },
    Pretoria: { lat: -25.7479, lng: 28.2293 }
  }
};

// Also export cityStations as an array format for previews
export const cityStations = {
  "cape-town": [
    { name: "Cape Town", lat: -33.918861, lng: 18.4233 },
    { name: "Bellville", lat: -33.8977, lng: 18.6296 },
    { name: "Wynberg", lat: -34.0029, lng: 18.4656 },
    { name: "Retreat", lat: -34.0454, lng: 18.4716 }
  ],
  "johannesburg": [
    { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
    { name: "Germiston", lat: -26.2278, lng: 28.1704 },
    { name: "Midrand", lat: -25.9992, lng: 28.1265 },
    { name: "Pretoria", lat: -25.7479, lng: 28.2293 }
  ],
  "durban": [
    { name: "Durban", lat: -29.8587, lng: 31.0218 },
    { name: "Umlazi", lat: -29.9645, lng: 30.8965 },
    { name: "KwaMashu", lat: -29.7379, lng: 30.9935 },
    { name: "Pinetown", lat: -29.8156, lng: 30.8657 }
  ]
};
