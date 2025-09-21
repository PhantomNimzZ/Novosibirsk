import { useState, useEffect } from "react";
import TrainModal from "../../components/admin/TrainModal";

function ManageTrains() {
  const [trains, setTrains] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);

  // Fetch all trains
  const fetchTrains = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/trains");
      const data = await res.json();
      setTrains(data);
    } catch (err) {
      console.error("Error fetching trains:", err);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  // Delete a train
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this train?")) return;
    try {
      await fetch(`http://localhost:3001/api/trains/${id}`, { method: "DELETE" });
      fetchTrains();
    } catch (err) {
      console.error("Error deleting train:", err);
    }
  };

  // Save (create or update) a train
  const handleSave = async (trainData) => {
    try {
      if (selectedTrain) {
        // Update
        await fetch(`http://localhost:3001/api/trains/${selectedTrain.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trainData),
        });
      } else {
        // Create
        await fetch("http://localhost:3001/api/trains", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trainData),
        });
      }
      fetchTrains();
    } catch (err) {
      console.error("Error saving train:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Trains</h2>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setSelectedTrain(null);
          setIsModalOpen(true);
        }}
      >
        Add Train
      </button>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Number</th>
            <th className="border px-3 py-2">Seats</th>
            <th className="border px-3 py-2">Price</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train) => (
            <tr key={train.id}>
              <td className="border px-3 py-2">{train.name}</td>
              <td className="border px-3 py-2">{train.number}</td>
              <td className="border px-3 py-2">
                {train.seats !== undefined && train.seats !== null ? train.seats : "-"}
              </td>
              <td className="border px-3 py-2">
                {train.price !== undefined && train.price !== null ? train.price.toFixed(2) : "-"}
              </td>
              <td className="border px-3 py-2 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    setSelectedTrain(train);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(train.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TrainModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedTrain}
      />
    </div>
  );
}

export default ManageTrains;
