import { useNavigate } from "react-router-dom";

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-[#1e1f3f] to-[#2a2759] flex flex-col items-center justify-center text-white font-sans">
      
      <h1 className="text-5xl mb-8">PRASA</h1>

      <button
        onClick={() => navigate("/select")}
        className="px-8 py-4 text-lg bg-indigo-600 rounded-lg cursor-pointer text-white hover:bg-indigo-700 transition"
      >
        Start
      </button>

      <p className="mt-4 opacity-70">Book your journey now</p>

      {/* Admin Dashboard Button */}
      <button
        onClick={() => navigate("/admin")}
        className="mt-8 px-6 py-3 text-base bg-cyan-400 rounded-md text-white cursor-pointer hover:bg-cyan-500 transition"
      >
        Admin Dashboard
      </button>
    </div>
  );
}

export default StartPage;
