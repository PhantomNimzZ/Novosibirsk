import { useEffect, useState } from "react";
import LiveTrackerMap from "./LiveTrackerMap";

const LiveTracker = ({ trainId, from, to, cityStations }) => {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);

  // 🔄 Fetch live train location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/live-location/${trainId}`);
        const data = await res.json();

        const coords = cityStations[data.location];

        if (!coords) return;

        setLocation({
          station: data.location,
          status: data.status,
          updatedAt: data.updatedAt,
          position: {
            lat: coords.lat,
            lng: coords.lng,
            station: data.location
          }
        });
      } catch (error) {
        console.error("❌ Live tracking error:", error);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);
    return () => clearInterval(interval);
  }, [trainId, cityStations]);

  // 🗺️ Build ordered route
  useEffect(() => {
    if (!from || !to) return;

    const stationEntries = Object.entries(cityStations);

    const startIndex = stationEntries.findIndex(([name]) => name === from);
    const endIndex = stationEntries.findIndex(([name]) => name === to);

    if (startIndex === -1 || endIndex === -1) return;

    const step = startIndex < endIndex ? 1 : -1;
    const points = [];

    for (let i = startIndex; i !== endIndex + step; i += step) {
      const [name, coords] = stationEntries[i];
      points.push({ lat: coords.lat, lng: coords.lng, station: name });
    }

    setRoute(points);
  }, [from, to, cityStations]);

  if (!location) return <p>📡 Fetching live location...</p>;

  return (
    <div style={{ backgroundColor: "#eef", padding: "1rem", margin: "1rem 0", borderRadius: "8px" }}>
      <strong>📍 Current Station:</strong> {location.station}<br />
      <strong>🛰️ Position:</strong> Lat {location.position.lat}, Lng {location.position.lng}<br />
      <strong>Status:</strong> {location.status}<br />
      <small>Last Updated: {new Date(location.updatedAt).toLocaleTimeString()}</small>

      <LiveTrackerMap
        lat={location.position.lat}
        lng={location.position.lng}
        station={location.station}
        route={route}
      />
    </div>
  );
};

export default LiveTracker;
