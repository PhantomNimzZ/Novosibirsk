import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { stationCoordinatesByCity } from "../../constants/stationCoordinates";

const CityMapPreview = ({ cityId }) => {
  const cityStations = stationCoordinatesByCity[cityId] || {};
  const stations = Object.entries(cityStations).map(([name, coords]) => ({
    name,
    lat: coords.lat,
    lng: coords.lng,
  }));

  const center = stations.length
    ? [stations[0].lat, stations[0].lng]
    : [-29.8587, 31.0218]; // fallback (Durban)

  return (
    <div className="mt-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={false}
        className="h-[300px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stations.map((station, index) => (
          <Marker key={index} position={[station.lat, station.lng]}>
            <Popup>{station.name}</Popup>
            <Tooltip direction="top" offset={[0, -10]} permanent>
              {station.name}
            </Tooltip>
          </Marker>
        ))}

        {stations.length > 1 && (
          <Polyline
            positions={stations.map((s) => [s.lat, s.lng])}
            pathOptions={{ color: "#2563eb", weight: 4 }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default CityMapPreview;
