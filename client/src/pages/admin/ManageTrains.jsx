import React, { useState, useEffect } from "react";
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

  // ✅ Handle save from modal (just refresh and close)
  const handleSave = async () => {
    await fetchTrains();
    setShowModal(false);
    setSelectedTrain(null);
  };

  // 🗑️ Delete Train (DELETE — requires token)
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

  // 🚪 Logout — remove token and redirect
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    alert("You have been logged out.");
    window.location.href = "/admin/login"; // adjust route as needed
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

      {/* Trains List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 text-left">Train Name</th>
              <th className="px-6 py-3 text-left">Number</th>
              <th className="px-6 py-3 text-left">Seats</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trains.length > 0 ? (
              trains.map((train) => (
                <tr key={train.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">{train.name}</td>
                  <td className="px-6 py-3">{train.number}</td>
                  <td className="px-6 py-3">{train.seats}</td>
                  <td className="px-6 py-3">R{train.price}</td>
                  <td className="px-6 py-3 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedTrain(train);
                        setShowModal(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(train.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No trains available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Train Modal */}
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
