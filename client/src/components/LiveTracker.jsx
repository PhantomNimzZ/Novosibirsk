import { useEffect, useState } from "react";
import LiveTrackerMap from "./LiveTrackerMap";

const LiveTracker = ({ trainId, from, to, cityStations }) => {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/live-location/${trainId}`);
        const data = await res.json();
        
        // ✅ Override position to match fixed station coordinates
        const officialCoords = cityStations[data.location];
        const correctedPosition = officialCoords
          ? { ...officialCoords, station: data.location }
          : data.position;

        setLocation({
          ...data,
          position: correctedPosition
        });
      } catch (error) {
        console.error("❌ Live tracking error:", error);
      }
    };
    
    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);
    return () => clearInterval(interval);
  }, [trainId]);

  useEffect(() => {
    const stationNames = Object.keys(cityStations);
    const startIndex = stationNames.indexOf(from);
    const endIndex = stationNames.indexOf(to);

    if (startIndex !== -1 && endIndex !== -1) {
      const step = startIndex < endIndex ? 1 : -1;
      const points = [];

      for (let i = startIndex; i !== endIndex + step; i += step) {
        const name = stationNames[i];
        const coords = cityStations[name];
        if (coords) {
          points.push({ lat: coords.lat, lng: coords.lng, station: name });
        }
      }

      setRoute(points);
    }
  }, [from, to, cityStations]);

  if (!location) return <p>📡 Fetching live location...</p>;

  return (
    <div style={{ backgroundColor: "#eef", padding: "1rem", margin: "1rem 0", borderRadius: "8px" }}>
      <strong>📍 Current Station:</strong> {location.location}<br />
      <strong>🛰️ Position:</strong> Lat {location.position.lat}, Lng {location.position.lng}<br />
      <strong>Status:</strong> {location.status}<br />
      <small>Last Updated: {new Date(location.updatedAt).toLocaleTimeString()}</small>

      <LiveTrackerMap
        lat={location.position.lat}
        lng={location.position.lng}
        station={location.position.station}
        route={route}
      />
    </div>
  );
};

export default LiveTracker;
