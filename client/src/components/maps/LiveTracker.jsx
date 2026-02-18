// client/src/components/maps/LiveTracker.jsx
import { useEffect, useState } from "react";
import LiveTrackerMap from "./LiveTrackerMap";
import { buildRoute } from "../../utils/routeUtils"; // ✅ No more inline duplicate
import { API_BASE } from "../../api/config";         // ✅ No more hardcoded URL

const LiveTracker = ({ trainId, from, to, cityStations }) => {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);

  // Fetch live position
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/live-location/${trainId}`);
        if (!res.ok) return; // silently skip if route not found

        const data = await res.json();

        // Override with official station coordinates if available
        const officialCoords = cityStations[data.location];
        const correctedPosition = officialCoords
          ? { ...officialCoords, station: data.location }
          : data.position;

        setLocation({ ...data, position: correctedPosition });
      } catch (error) {
        console.error("Live tracking error:", error);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);
    return () => clearInterval(interval);
  }, [trainId, cityStations]);

  // Build route from station coordinates
  useEffect(() => {
    // ✅ Uses shared buildRoute utility — no more duplicated loop
    const points = buildRoute(cityStations, from, to);
    setRoute(points);
  }, [from, to, cityStations]);

  if (!location) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-4">
        <span className="animate-pulse">📡</span>
        <span>Fetching live location...</span>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-2">
      <div className="text-sm text-gray-700 mb-3 space-y-1">
        <p><strong>📍 Current Station:</strong> {location.location}</p>
        <p><strong>Status:</strong> {location.status}</p>
        <small className="text-gray-400">
          Last updated: {new Date(location.updatedAt).toLocaleTimeString()}
        </small>
      </div>

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
