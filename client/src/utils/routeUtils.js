// src/utils/routeUtils.js

export const buildRoute = (stations, from, to) => {
  const stationNames = Object.keys(stations);
  const startIndex = stationNames.indexOf(from);
  const endIndex = stationNames.indexOf(to);

  if (startIndex === -1 || endIndex === -1) return [];

  const step = startIndex < endIndex ? 1 : -1;
  const path = [];

  for (let i = startIndex; i !== endIndex + step; i += step) {
    const name = stationNames[i];
    const coords = stations[name];
    if (coords) {
      path.push({ lat: coords.lat, lng: coords.lng, station: name });
    }
  }

  return path;
};
