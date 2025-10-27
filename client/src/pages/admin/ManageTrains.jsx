import React, { useState, useEffect } from "react";
import TrainTable from "../../components/admin/TrainTable.jsx";
import TrainModal from "../../components/admin/TrainModal.jsx";

export default function ManageTrains() {
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🧠 Fetch all trains (GET — public)
  const fetchTrains = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/trains");
      if (!res.ok) throw new Error("Failed to fetch trains");
      const data = await res.json();
      setTrains(data);
    } catch (err) {
      console.error("Error fetching trains:", err);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  // 🪪 Get JWT token
  const getToken = () => localStorage.getItem("adminToken");

  // ✅ Handle save from modal
  const handleSave = async () => {
    await fetchTrains();
    setShowModal(false);
    setSelectedTrain(null);
  };

  // 🗑️ Delete Train
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this train?")) return;

    const token = getToken();
    if (!token) {
      alert("Unauthorized. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/trains/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        alert("Unauthorized. Please log in again.");
        return;
      }

      if (!res.ok) throw new Error("Failed to delete train");

      await fetchTrains();
      alert("Train deleted successfully!");
    } catch (err) {
      console.error("Error deleting train:", err);
      alert("Error deleting train. Check console for details.");
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    alert("You have been logged out.");
    window.location.href = "/admin/login";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Manage Trains</h1>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedTrain(null);
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + Add Train
          </button>

          <button
            onClick={handleLogout}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ✅ Train Table Integration */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <TrainTable
          trains={trains}
          onEdit={(train) => {
            setSelectedTrain(train);
            setShowModal(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      {/* ✨ Train Modal */}
      {showModal && (
        <TrainModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialData={selectedTrain}
        />
      )}
    </div>
  );
}
