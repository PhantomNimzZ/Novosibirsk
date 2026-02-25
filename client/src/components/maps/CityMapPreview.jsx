// client/src/components/maps/CityMapPreview.jsx
import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { stationCoordinatesByCity } from "../../constants/realStations";

const CityMapPreview = ({ cityId, from, to, routeInfo }) => {
  const cityStations = stationCoordinatesByCity[cityId] || {};

  // Build route coordinates based on route type
  const routeSegments = useMemo(() => {
    if (!routeInfo || !routeInfo.valid) return [];

    const segments = [];

    if (routeInfo.type === "direct") {
      // Single line route - use routeInfo.route
      const coords = routeInfo.route.map(station => {
        const c = cityStations[station];
        return c ? [c.lat, c.lng] : null;
      }).filter(Boolean);

      if (coords.length > 0) {
        segments.push({
          coordinates: coords,
          color: "#0066CC",
          weight: 4,
          label: routeInfo.lineName,
        });
      }
    } else if (routeInfo.type === "transfer") {
      // Multi-leg transfer route - use routeInfo.legs
      if (routeInfo.legs && routeInfo.legs.length > 0) {
        routeInfo.legs.forEach((leg, index) => {
          const coords = leg.stations.map(station => {
            const c = cityStations[station];
            return c ? [c.lat, c.lng] : null;
          }).filter(Boolean);

          if (coords.length > 0) {
            // Different color for each leg - using distinct colors that stand out
            const colors = ["#0066CC", "#9C27B0"]; // Blue for first leg, purple for second

            segments.push({
              coordinates: coords,
              color: colors[index % colors.length],
              weight: 5, // Slightly thicker for better visibility
              label: leg.line,
              isDashed: index > 0, // Dash the second leg to show it's a transfer
            });
          }
        });
      }
    }

    return segments;
  }, [routeInfo, cityStations]);

  // Get all stations on the route (for markers)
  const routeStations = useMemo(() => {
    if (!routeInfo || !routeInfo.valid) return [];

    if (routeInfo.type === "direct" && routeInfo.route) {
      return routeInfo.route;
    } else if (routeInfo.type === "transfer" && routeInfo.legs) {
      // Combine all stations from all legs (deduplicate)
      const allStations = [];
      routeInfo.legs.forEach(leg => {
        if (leg.stations) {
          leg.stations.forEach(station => {
            if (!allStations.includes(station)) {
              allStations.push(station);
            }
          });
        }
      });
      return allStations;
    }

    return [];
  }, [routeInfo]);

  // Calculate map bounds
  const bounds = useMemo(() => {
    if (routeStations.length === 0) {
      // No route - show all stations
      const allCoords = Object.values(cityStations).map(c => [c.lat, c.lng]);
      return allCoords.length > 0 ? allCoords : null;
    }

    // Show only stations on the route
    const routeCoords = routeStations.map(station => {
      const c = cityStations[station];
      return c ? [c.lat, c.lng] : null;
    }).filter(Boolean);

    return routeCoords.length > 0 ? routeCoords : null;
  }, [routeStations, cityStations]);

  // Get transfer station (if exists)
  const transferStation = useMemo(() => {
    if (routeInfo?.type === "transfer" && routeInfo.legs && routeInfo.legs.length > 0) {
      return routeInfo.legs[0].to;
    }
    return null;
  }, [routeInfo]);

  // Determine marker colors
  const getMarkerColor = (station) => {
    if (station === from) return "#00ACC1"; // Teal/cyan for origin
    if (station === to) return "#28A745"; // Green for destination (keep this)
    if (station === transferStation) return "#E91E63"; // Magenta/pink for transfer point
    return "#0066CC"; // Blue for intermediate
  };

  // Determine if marker should be large
  const isImportantStation = (station) => {
    return station === from || station === to || station === transferStation;
  };

  if (!bounds || bounds.length === 0) {
    return (
      <div style={styles.noData}>
        <p>No station data available for this city</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <MapContainer
        bounds={bounds}
        style={styles.map}
        scrollWheelZoom={false}
        key={`${from}-${to}-${routeInfo?.type}-${Date.now()}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Route lines */}
        {routeSegments.map((segment, index) => (
          <Polyline
            key={`segment-${index}`}
            positions={segment.coordinates}
            color={segment.color}
            weight={segment.weight}
            opacity={0.8}
            dashArray={segment.isDashed ? "10, 10" : null}
          />
        ))}

        {/* Station markers */}
        {routeStations.map((station) => {
          const coords = cityStations[station];
          if (!coords) return null;

          const isOrigin = station === from;
          const isDestination = station === to;
          const isTransfer = station === transferStation;
          const markerColor = getMarkerColor(station);
          const isLarge = isImportantStation(station);

          return (
            <Marker
              key={`marker-${station}`}
              position={[coords.lat, coords.lng]}
              icon={createCustomIcon(markerColor, isLarge)}
            >
              <Popup>
                <strong>{station}</strong>
                {isOrigin && <div style={styles.badge}>Origin</div>}
                {isDestination && <div style={styles.badge}>Destination</div>}
                {isTransfer && <div style={{...styles.badge, background: "#E91E63", color: "#FFF"}}>Transfer Here</div>}
              </Popup>
              {(isOrigin || isDestination || isTransfer) && (
                <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent>
                  <strong>{station}</strong>
                  {isTransfer && <div style={styles.transferLabel}>Transfer</div>}
                </Tooltip>
              )}
            </Marker>
          );
        })}
      </MapContainer>

      {/* Route Summary */}
      {routeInfo && routeInfo.valid && (
        <div style={styles.summary}>
          {routeInfo.type === "direct" && (
            <>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Route:</span>
                <span style={styles.summaryValue}>{from} → {to}</span>
              </div>
              <div style={styles.summaryDivider}>•</div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryValue}>{routeInfo.stops} stops</span>
              </div>
              <div style={styles.summaryDivider}>•</div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Line:</span>
                <span style={styles.summaryValue}>{routeInfo.lineName}</span>
              </div>
            </>
          )}

          {routeInfo.type === "transfer" && routeInfo.legs && (
            <>
              <div style={styles.summaryItem}>
                <span style={styles.summaryValue}>
                  <span style={{color: "#0066CC"}}>●</span> {routeInfo.legs[0].line}
                </span>
              </div>
              <div style={styles.summaryDivider}>→</div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryValue}>
                  <span style={{color: "#9C27B0"}}>●</span> {routeInfo.legs[1].line}
                </span>
              </div>
              <div style={styles.summaryDivider}>•</div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryValue}>{routeInfo.stops} total stops</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Transfer Legend */}
      {routeInfo?.type === "transfer" && (
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendLine, background: "#0066CC"}}></div>
            <span style={styles.legendText}>First leg</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{
              ...styles.legendLine, 
              background: "#9C27B0",
              backgroundImage: "repeating-linear-gradient(90deg, #9C27B0, #9C27B0 5px, transparent 5px, transparent 10px)"
            }}></div>
            <span style={styles.legendText}>Second leg</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendDot, background: "#E91E63"}}></div>
            <span style={styles.legendText}>Transfer point</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Create custom marker icon
function createCustomIcon(color, isLarge) {
  const size = isLarge ? 30 : 20;
  
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const styles = {
  container: {
    width: "100%",
    position: "relative",
  },
  map: {
    height: "clamp(300px, 50vh, 400px)",
    width: "100%",
    borderRadius: "12px",
    zIndex: 1,
  },
  noData: {
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
    borderRadius: "12px",
    color: "#666",
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    marginTop: "4px",
    fontSize: "11px",
    fontWeight: "600",
    borderRadius: "4px",
    background: "#e6f2ff",
    color: "#0066CC",
  },
  transferLabel: {
    fontSize: "10px",
    color: "#666",
    marginTop: "2px",
  },
  summary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "clamp(0.5rem, 2vw, 1rem)",
    marginTop: "clamp(0.5rem, 2vw, 0.75rem)",
    padding: "clamp(0.5rem, 2vw, 0.75rem)",
    background: "#f8f9fa",
    borderRadius: "8px",
    fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
    flexWrap: "wrap",
  },
  summaryItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  summaryLabel: {
    color: "#666",
  },
  summaryValue: {
    fontWeight: "600",
    color: "#333",
  },
  summaryDivider: {
    color: "#0066CC",
    fontWeight: "600",
  },
  legend: {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(0.75rem, 3vw, 1rem)",
    marginTop: "clamp(0.5rem, 2vw, 0.75rem)",
    padding: "clamp(0.5rem, 2vw, 0.75rem)",
    background: "#fff",
    borderRadius: "8px",
    fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
    flexWrap: "wrap",
    border: "1px solid #e0e0e0",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  legendLine: {
    width: "30px",
    height: "3px",
    borderRadius: "2px",
  },
  legendDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "2px solid white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },
  legendText: {
    fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
    color: "#666",
  },
};

export default CityMapPreview;
