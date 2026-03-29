// client/src/components/admin/TrainTable.jsx
import { useState } from "react";

const TrainTable = ({ trains, onEdit, onDelete }) => {
  const [expandedRoutes, setExpandedRoutes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  if (!trains || trains.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 font-medium">No trains found</p>
        <p className="text-sm text-gray-400 mt-1">Click "Add Train" to create your first train schedule</p>
      </div>
    );
  }

  // Filter trains
  const filtered = trains.filter((t) => {
    if (filterType === "long-distance" && t.trainName?.includes("Metro Rail")) return false;
    if (filterType === "commuter" && !t.trainName?.includes("Metro Rail")) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (t.trainName || "").toLowerCase().includes(q) ||
        (t.trainNumber || "").toLowerCase().includes(q) ||
        (t.from || "").toLowerCase().includes(q) ||
        (t.to || "").toLowerCase().includes(q) ||
        (t.class || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Group by route, then by service (trainName + class)
  const routeGroups = {};
  for (const train of filtered) {
    const routeKey = `${train.from} → ${train.to}`;
    if (!routeGroups[routeKey]) {
      routeGroups[routeKey] = {
        from: train.from,
        to: train.to,
        distance: train.distance,
        duration: train.duration,
        isCommuter: train.trainName?.includes("Metro Rail"),
        services: {},
        totalTrains: 0,
      };
    }
    const serviceKey = `${train.trainName || "Unknown"}|${train.class || "Standard"}`;
    if (!routeGroups[routeKey].services[serviceKey]) {
      routeGroups[routeKey].services[serviceKey] = {
        trainName: train.trainName,
        class: train.class,
        price: train.price,
        seats: train.seats,
        trains: [],
      };
    }
    routeGroups[routeKey].services[serviceKey].trains.push(train);
    routeGroups[routeKey].totalTrains++;
  }

  // Sort: long-distance first, then commuter
  const sortedRoutes = Object.entries(routeGroups).sort(([, a], [, b]) => {
    if (a.isCommuter !== b.isCommuter) return a.isCommuter ? 1 : -1;
    return 0;
  });

  const toggleRoute = (key) => {
    setExpandedRoutes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const longDistanceCount = filtered.filter((t) => !t.trainName?.includes("Metro Rail")).length;
  const commuterCount = filtered.filter((t) => t.trainName?.includes("Metro Rail")).length;

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search trains, routes, classes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-1">
          {[
            { key: "all", label: `All (${filtered.length})` },
            { key: "long-distance", label: `Long-Dist (${longDistanceCount})` },
            { key: "commuter", label: `Commuter (${commuterCount})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterType === f.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        {sortedRoutes.length} routes • {filtered.length} total services
      </p>

      {/* Route Cards */}
      <div className="space-y-3">
        {sortedRoutes.map(([routeKey, group]) => {
          const isExpanded = expandedRoutes[routeKey];
          const serviceList = Object.values(group.services);

          return (
            <div key={routeKey} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              {/* Route Header */}
              <button
                onClick={() => toggleRoute(routeKey)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      group.isCommuter ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {group.isCommuter ? "Metro" : "Long-Dist"}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{routeKey}</div>
                    <div className="text-xs text-gray-500">
                      {group.distance ? `${group.distance} km` : ""}
                      {group.distance && group.duration ? " • " : ""}
                      {group.duration ? `${group.duration}h` : ""}
                      {" • "}
                      {serviceList.length} service{serviceList.length !== 1 ? "s" : ""}
                      {" • "}
                      {group.totalTrains} departure{group.totalTrains !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <span
                  className="text-gray-400 text-xs"
                  style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)", display: "inline-block", transition: "transform 0.2s" }}
                >
                  ▼
                </span>
              </button>

              {/* Expanded Services Table */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Departures</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Edit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {serviceList.map((service, si) => (
                        <tr key={si} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5">
                            <div className="font-medium text-gray-900">{service.trainName}</div>
                            <div className="text-xs text-gray-400">
                              {service.trains[0]?.trainNumber?.split("-").slice(0, 2).join("-")}
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                service.class === "Economy" ? "bg-blue-50 text-blue-700"
                                : service.class === "Business" ? "bg-purple-50 text-purple-700"
                                : service.class === "Luxury" ? "bg-yellow-50 text-yellow-700"
                                : "bg-gray-50 text-gray-700"
                              }`}
                            >
                              {service.class || "Standard"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex flex-wrap gap-1">
                              {service.trains
                                .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                                .map((t) => (
                                  <span key={t.id} className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700">
                                    {t.time}
                                  </span>
                                ))}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-gray-700">{service.seats}</td>
                          <td className="px-4 py-2.5 font-semibold text-gray-900">
                            R{typeof service.price === "number" ? service.price : parseFloat(service.price || 0)}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex flex-wrap gap-1">
                              {service.trains
                                .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                                .map((t) => (
                                  <button
                                    key={t.id}
                                    onClick={() => onEdit(t)}
                                    className="px-1.5 py-0.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                                    title={`Edit ${t.time} departure`}
                                  >
                                    {t.time}
                                  </button>
                                ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainTable;
