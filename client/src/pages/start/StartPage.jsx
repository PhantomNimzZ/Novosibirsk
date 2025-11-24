import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/ui/PrimaryButton";
import AppLayout from "../../components/layout/AppLayout";

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      {/* Fullscreen Centered Content */}
      <div className="flex flex-col items-center justify-center text-center min-h-screen">

        <h1 className="text-6xl font-bold mb-10 tracking-wide text-gray-900">
          PRASA
        </h1>

        <PrimaryButton
          onClick={() => navigate("/select")}
          className="px-8 py-4 text-xl"
        >
          Start
        </PrimaryButton>

        <p className="mt-5 text-gray-600 text-lg">Book your journey now</p>

        {/* TEMP ADMIN BUTTON */}
        <button
          onClick={() => navigate("/admin")}
          className="mt-10 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition text-white font-medium"
        >
          Admin Dashboard
        </button>
      </div>
    </AppLayout>
  );
}
