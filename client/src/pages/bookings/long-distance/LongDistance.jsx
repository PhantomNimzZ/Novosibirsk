// client/src/pages/bookings/long-distance/LongDistance.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../api/config";

// ✅ Correct import paths (three ../ to go up from long-distance folder)
import RouteSelector from "../../../components/booking/RouteSelector";
import RouteAnimation from "../../../components/booking/RouteAnimation";

const LongDistance = () => {
  const navigate = useNavigate();
  
  // Step 1: Route selection
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRouteSelector, setShowRouteSelector] = useState(true);
  
  // Step 2: Date/time/results (not built yet)
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  
  // Animation state
  const [showAnimation, setShowAnimation] = useState(false);

  const handleRouteSelect = (route) => {
    console.log("Route selected:", route);
    setSelectedRoute(route);
    setShowRouteSelector(false);
    
    // TODO: Next step would be date/time picker
    // For now, just navigate to a placeholder or show a message
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Step 1: Route Selector */}
      {showRouteSelector && (
        <div className="py-10">
          <RouteSelector onRouteSelect={handleRouteSelect} />
        </div>
      )}

      {/* Step 2: Show selected route and next steps */}
      {!showRouteSelector && selectedRoute && (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Route Selected</h2>
            <p className="mb-2">
              <strong>From:</strong> {selectedRoute.from}
            </p>
            <p className="mb-2">
              <strong>To:</strong> {selectedRoute.to}
            </p>
            <p className="mb-2">
              <strong>Distance:</strong> ~{selectedRoute.distance} km
            </p>
            <p className="mb-4">
              <strong>Duration:</strong> ~{selectedRoute.duration} hours
            </p>

            <button
              onClick={() => setShowRouteSelector(true)}
              className="px-4 py-2 bg-gray-200 rounded mr-4 hover:bg-gray-300"
            >
              ← Change Route
            </button>

            <button
              onClick={() => setShowAnimation(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Preview Journey Animation
            </button>
          </div>

          {/* TODO: Add date/time picker here */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-900">
              🚧 Date/Time selection coming next!
            </p>
            <p className="text-sm text-blue-700 mt-2">
              For now, you can preview the route animation above.
            </p>
          </div>
        </div>
      )}

      {/* Route Animation (plays on demand or after booking) */}
      {showAnimation && selectedRoute && (
        <RouteAnimation
          route={{
            from: selectedRoute.from,
            to: selectedRoute.to,
            distance: selectedRoute.distance,
            duration: selectedRoute.duration,
            arrivalTime: "22:00", // TODO: Calculate from actual schedule
          }}
          onComplete={() => {
            setShowAnimation(false);
            alert("Animation complete! This would normally go to confirmation.");
          }}
        />
      )}
    </div>
  );
};

export default LongDistance;