import { useState, useEffect } from "react";

export default function TrainModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    seats: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      // 🧭 Prefill when editing
      setFormData({
        name: initialData.name || "",
        number: initialData.number || "",
        seats: initialData.seats || "",
        price: initialData.price || "",
      });
    } else {
      // 🧹 Reset when adding
      setFormData({ name: "", number: "", seats: "", price: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 handleSubmit triggered");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Unauthorized: Please log in again.");
      console.warn("❌ No token found in localStorage");
      return;
    }

    const payload = {
      ...formData,
      seats: parseInt(formData.seats, 10),
      price: parseFloat(formData.price),
    };

    const isEdit = Boolean(initialData);
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `http://localhost:3001/api/trains/${initialData.id}`
      : `http://localhost:3001/api/trains`;

    console.log(`🌐 Sending ${method} request to:`, url);
    setLoading(true);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("🧾 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error:", errorText);
        throw new Error(`Failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Success:", result);

      await onSave(); // parent refresh
      onClose();
    } catch (error) {
      console.error("🔥 Error saving train:", error);
      alert("Failed to save train. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {initialData ? "Edit Train" : "Add New Train"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Train Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="number"
            placeholder="Train Number"
            value={formData.number}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="number"
            name="seats"
            placeholder="Number of Seats"
            value={formData.seats}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Ticket Price (R)"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white px-4 py-2 rounded`}
            >
              {loading
                ? "Saving..."
                : initialData
                ? "Save Changes"
                : "Add Train"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
