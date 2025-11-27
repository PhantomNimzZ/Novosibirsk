import { useNavigate } from "react-router-dom";

const RouteType = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#12172b] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-semibold mb-10 text-center">
        Where would you like to travel?
      </h1>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/long-distance")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-medium shadow-md transition"
        >
          🚄 Long-Distance
        </button>

        <button
          onClick={() => navigate("/commuter")}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-medium shadow-md transition"
        >
          🚉 Commuter Route
        </button>
      </div>
    </div>
  );
};

export default RouteType;
