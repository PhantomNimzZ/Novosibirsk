// client/src/components/maps/LiveTrackerMap.jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon paths (Vite/webpack bundling issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ✅ Fixed: Leaflet does not ship a red marker — using correct CDN source
const trainIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const AnimateZoomToStations = ({ route }) => {
  const map = useMap();
  const intervalRef = useRef();
  const timeoutRef = useRef();

  useEffect(() => {
    if (route.length === 0) return;

    const bounds = route.map((pt) => [pt.lat, pt.lng]);
    map.fitBounds(bounds, { padding: [50, 50] });

    timeoutRef.current = setTimeout(() => {
      map.flyTo([route[0].lat, route[0].lng], 14, { duration: 3 });

      let index = 0;
      intervalRef.current = setInterval(() => {
        index += 1;
        if (index >= route.length) {
          clearInterval(intervalRef.current);
          return;
        }
        map.flyTo([route[index].lat, route[index].lng], 14, { duration: 3 });
      }, 4000);
    }, 3000);

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
          <Tooltip direction="top" offset={[0, -10]} permanent>
            {pt.station}
          </Tooltip>
        </Marker>
      ))}

      <Marker position={[lat, lng]} icon={trainIcon}>
        <Popup>🚆 Train is currently at {station}</Popup>
        <Tooltip direction="top" offset={[0, -10]} permanent>
          🚆 {station}
        </Tooltip>
      </Marker>

      {route.length > 1 && (
        <Polyline positions={route.map((pt) => [pt.lat, pt.lng])} color="blue" />
      )}

      <AnimateZoomToStations route={route} />
    </MapContainer>
  );
};

export default LiveTrackerMap;
