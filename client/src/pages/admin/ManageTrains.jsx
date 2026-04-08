// client/src/pages/admin/ManageTrains.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainTable from "../../components/admin/TrainTable";
import TrainModal from "../../components/admin/TrainModal";
import { API_BASE } from "../../api/config";

const ManageTrains = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin-login");
        return;
      }


      const response = await fetch(`${API_BASE}/api/trains`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch trains: ${response.status}`);
      }

      const data = await response.json();
      setTrains(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTrain(null);
    setIsModalOpen(true);
  };

  
  const handleEdit = async (train) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const bookings = await response.json();
        const activeBookings = bookings.filter(
          b => b.trainId === train.id && b.status === "Active"
        );
        
        if (activeBookings.length > 0) {
          const confirmEdit = window.confirm(
            `⚠️ WARNING: This train has ${activeBookings.length} active booking(s)!\n\n` +
            `Editing this train's route, date, or time will cause data inconsistencies with existing bookings.\n\n` +
            `Recommended: Only edit non-critical fields (seats, price, amenities).\n\n` +
            `Continue editing anyway?`
          );
          
          if (!confirmEdit) {
            return; // Cancel edit
          }
        }
      }
    } catch (error) {
      // Continue anyway if check fails
    }
    
    setEditingTrain(train);
    setIsModalOpen(true);
  };

  
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const bookings = await response.json();
        const activeBookings = bookings.filter(
          b => b.trainId === id && b.status === "Active"
        );
        
        if (activeBookings.length > 0) {
          alert(
            `❌ Cannot delete this train!\n\n` +
            `This train has ${activeBookings.length} active booking(s).\n\n` +
            `You must cancel all bookings first before deleting the train.`
          );
          return; // Block deletion
        }
      }
    } catch (error) {
      alert("Error checking bookings. Please try again.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this train?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE}/api/trains/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete train");
      }

      setTrains(trains.filter((t) => t.id !== id));
      alert("Train deleted successfully");
    } catch (err) {
      alert("Failed to delete train: " + err.message);
    }
  };

  const handleSave = async (trainData) => {
    try {
      const token = localStorage.getItem("adminToken");
      const method = editingTrain ? "PUT" : "POST";
      const url = editingTrain
        ? `${API_BASE}/api/trains/${editingTrain.id}`
        : `${API_BASE}/api/trains`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trainData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save train");
      }

      const savedTrain = await response.json();

      if (editingTrain) {
        // Update existing
        setTrains(trains.map((t) => (t.id === savedTrain.id ? savedTrain : t)));
      } else {
        // Add new
        setTrains([...trains, savedTrain]);
      }

      setIsModalOpen(false);
      setEditingTrain(null);
      alert("Train saved successfully");
    } catch (err) {
      alert("Failed to save train: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading trains...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Trains</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchTrains}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Trains</h1>
          <p className="text-sm text-gray-600 mt-1">
            {trains.length} {trains.length === 1 ? "train" : "trains"} in system
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Train
        </button>
      </div>

      {/* Trains Table */}
      <TrainTable
        trains={trains}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Train Modal */}
      {isModalOpen && (
        <TrainModal
          train={editingTrain}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTrain(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ManageTrains;
