// client/src/utils/routeUtils.js
// ✅ Single source of truth for route-building logic
// Previously duplicated in: LiveTracker.jsx, stationUtils.js, and routeUtils.js

import { stationCoordinatesByCity } from "../constants/stationCoordinates";

/**
 * Build an ordered array of coordinate points between two stations.
 * Works in both directions (forward and reverse).
 *
 * @param {Object} stations - { StationName: { lat, lng }, ... }
 * @param {string} from - departure station name
 * @param {string} to - destination station name
 * @returns {Array} [{ lat, lng, station }, ...]
 */
export const buildRoute = (stations, from, to) => {
  if (!stations || !from || !to) return [];

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

/**
 * Get a route within a specific city using the city key.
 *
 * @param {string} cityKey - e.g. "durban", "cape-town", "johannesburg"
 * @param {string} from - departure station name
 * @param {string} to - destination station name
 * @returns {Array} [{ lat, lng, station }, ...]
 */
export const getStationRoute = (cityKey, from, to) => {
  const cityStations = stationCoordinatesByCity[cityKey];
  if (!cityStations) return [];
  return buildRoute(cityStations, from, to);
};

/**
 * Infer a city key from a train name or ID string.
 *
 * @param {string} trainId - e.g. "commuter-line---durban" or "Blue Train Durban"
 * @returns {string|null} city key or null if not recognised
 */
export const getCityFromTrainId = (trainId) => {
  if (!trainId) return null;
  const lower = trainId.toLowerCase();
  if (lower.includes("durban")) return "durban";
  if (lower.includes("cape-town") || lower.includes("cape town") || lower.includes("capetown")) return "cape-town";
  if (lower.includes("johannesburg")) return "johannesburg";
  return null;
};
