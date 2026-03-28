// client/src/components/admin/BookingsTable.jsx
import { useState } from "react";
import EditBookingModal from "./EditBookingModal";
import "./BookingsTable.css";

const BookingsTable = ({ bookings, onDelete, onUpdate }) => {
  const [editingBooking, setEditingBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingBooking(null);
    setIsModalOpen(false);
  };

  const handleSave = (updatedBooking) => {
    onUpdate(updatedBooking);
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      onDelete(id);
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No bookings found</p>
      </div>
    );
  }

  return (
    <>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow" style={{ maxWidth: "100%" }}>
        <table className="min-w-full divide-y divide-gray-200" style={{ fontSize: "0.875rem" }}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "60px" }}>
                ID
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "150px" }}>
                Passenger
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "180px" }}>
                Route
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "120px" }}>
                Date & Time
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "80px" }}>
                Seat
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "80px" }}>
                Price
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "90px" }}>
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "140px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{booking.id}
                </td>
                <td className="px-3 py-3">
                  <div className="text-sm font-medium text-gray-900" style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {booking.passengerName}
                  </div>
                  <div className="text-xs text-gray-500" style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {booking.email}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="text-sm text-gray-900">
                    {booking.departure} → {booking.destination}
                  </div>
                  <div className="text-xs text-gray-500">
                    {booking.trainNumber || booking.train?.trainNumber || "N/A"}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {booking.time || "N/A"}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                  {booking.seat || "N/A"}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  R{typeof booking.price === 'number' 
                    ? booking.price.toFixed(2) 
                    : parseFloat(booking.price || 0).toFixed(2)}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(booking)}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 transition"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default BookingsTable;
