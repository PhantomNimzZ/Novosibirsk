import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cityStations } from "../../constants/stationCoordinates";

// const cityStations = {
//   "cape-town": [
//     { name: "Cape Town", lat: -33.918861, lng: 18.4233 },
//     { name: "Bellville", lat: -33.8977, lng: 18.6296 },
//     { name: "Wynberg", lat: -34.0029, lng: 18.4656 },
//     { name: "Retreat", lat: -34.0454, lng: 18.4716 },
//   ],
//   "johannesburg": [
//     { name: "Park Station", lat: -26.2014, lng: 28.0436 },
//     { name: "Germiston", lat: -26.2278, lng: 28.1704 },
//     { name: "Midrand", lat: -25.9992, lng: 28.1265 },
//     { name: "Pretoria", lat: -25.7479, lng: 28.2293 },
//   ],
//   "durban": [
//     { name: "Durban", lat: -29.8587, lng: 31.0218 },
//     { name: "Umlazi", lat: -29.9645, lng: 30.8965 },
//     { name: "KwaMashu", lat: -29.7379, lng: 30.9935 },
//     { name: "Pinetown", lat: -29.8156, lng: 30.8657 },
//   ],
// };

const CityMapPreview = ({ cityId }) => {
  const stations = cityStations[cityId] || [];

  const center = stations.length
    ? [stations[0].lat, stations[0].lng]
    : [-29.8587, 31.0218]; // Fallback to Durban

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: "300px", width: "100%", marginTop: "1rem", borderRadius: "8px" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      />

      {stations.map((station, index) => (
        <Marker key={index} position={[station.lat, station.lng]}>
          <Popup>{station.name}</Popup>
          <Tooltip direction="top" offset={[0, -10]} permanent>{station.name}</Tooltip>
        </Marker>
      ))}

      {stations.length > 1 && (
        <Polyline
          positions={stations.map(s => [s.lat, s.lng])}
          color="blue"
        />
      )}
    </MapContainer>
  );
};

export default CityMapPreview;
