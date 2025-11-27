import { useNavigate } from "react-router-dom";

const Commuter = () => {
  const navigate = useNavigate();

  const cities = [
    { name: "Cape Town", id: "cape-town" },
    { name: "Johannesburg", id: "johannesburg" },
    { name: "Durban", id: "durban" },
  ];

  return (
    <div className="min-h-screen bg-[#12172b] text-white flex flex-col items-center pt-24 px-4">
      <h1 className="text-3xl font-semibold mb-10">🚉 Choose Your City</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => navigate(`/commuter/${city.id}`)}
            className="px-6 py-3 bg-white text-black rounded-xl shadow-lg hover:bg-gray-200 transition font-medium"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Commuter;
