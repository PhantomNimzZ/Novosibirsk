import { stationCoordinatesByCity } from "../constants/stationCoordinates";

/**
 * Get ordered station route between two stops within a city.
 */
export const getStationRoute = (cityKey, from, to) => {
  const cityStations = stationCoordinatesByCity[cityKey];
  if (!cityStations) return [];

  const stationNames = Object.keys(cityStations);
  const startIndex = stationNames.indexOf(from);
  const endIndex = stationNames.indexOf(to);

  if (startIndex === -1 || endIndex === -1) return [];

  const step = startIndex < endIndex ? 1 : -1;
  const route = [];

  for (let i = startIndex; i !== endIndex + step; i += step) {
    const stationName = stationNames[i];
    const coords = cityStations[stationName];
    if (coords) {
      route.push({ ...coords, station: stationName });
    }
  }

  return route;
};

/**
 * Attempt to infer a city key from a train name.
 */
export const getCityFromTrainId = (trainId) => {
  const lower = trainId.toLowerCase();
  if (lower.includes("durban")) return "durban";
  if (lower.includes("cape-town") || lower.includes("capetown")) return "cape-town";
  if (lower.includes("johannesburg")) return "johannesburg";
  return null;
};

