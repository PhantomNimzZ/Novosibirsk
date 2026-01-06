import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const trainIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41]
});

const AnimateZoomToStations = ({ route }) => {
  const map = useMap();
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 means "overview"
  const intervalRef = useRef();
  const timeoutRef = useRef();

  useEffect(() => {
    if (route.length === 0) return;

    // Fit map bounds to whole route initially
    const bounds = route.map(pt => [pt.lat, pt.lng]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // After 3 seconds, start zoom animation
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex(0);
      map.flyTo([route[0].lat, route[0].lng], 14, { duration: 3 }); // slower zoom on first station

      // Start interval to move along stations every 4 seconds
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = prev + 1;
          if (nextIndex >= route.length) {
            clearInterval(intervalRef.current);
            return prev; // stop at last station
          } else {
            map.flyTo([route[nextIndex].lat, route[nextIndex].lng], 14, { duration: 3 });
            return nextIndex;
          }
        });
      }, 4000);
    }, 3000);

    // Cleanup timers on unmount or route change
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [route, map]);

  return null;
};

const LiveTrackerMap = ({ lat, lng, station = "Unknown Station", route = [] }) => {
  if (!lat || !lng) return null;
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%", marginTop: "1rem", borderRadius: "8px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      />

      {route.map((pt, i) => (
        <Marker key={`station-${pt.station}-${i}`} position={[pt.lat, pt.lng]}>
          <Popup>🚉 {pt.station}</Popup>
          <Tooltip direction="top" offset={[0, -10]} permanent>{pt.station}</Tooltip>
        </Marker>
      ))}

      <Marker position={[lat, lng]} icon={trainIcon}>
        <Popup>🚆 Train is currently at {station}</Popup>
        <Tooltip direction="top" offset={[0, -10]} permanent>
          🚆 {station}
        </Tooltip>
      </Marker>


      {route.length > 1 && (
        <Polyline
          positions={route.map(pt => [pt.lat, pt.lng])}
          color="blue"
        />
      )}

      {/* Animate zoom and pan through stations */}
      <AnimateZoomToStations route={route} />
    </MapContainer>
  );
};

export default LiveTrackerMap;