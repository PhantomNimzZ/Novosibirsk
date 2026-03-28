// client/src/components/admin/TrainTable.jsx
const TrainTable = ({ trains, onEdit, onDelete }) => {
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this train?")) {
      onDelete(id);
    }
  };

  if (!trains || trains.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No trains found</p>
        <p className="text-sm text-gray-400 mt-1">Click "Add Train" to create your first train schedule</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow" style={{ maxWidth: "100%" }}>
      <table className="min-w-full divide-y divide-gray-200" style={{ fontSize: "0.875rem" }}>
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "180px" }}>
              Train
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "150px" }}>
              Route
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "120px" }}>
              Schedule
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "90px" }}>
              Class
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "80px" }}>
              Distance
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "70px" }}>
              Seats
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "80px" }}>
              Price
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: "140px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {trains.map((train) => (
            <tr key={train.id} className="hover:bg-gray-50">
              <td className="px-3 py-3">
                <div className="text-sm font-medium text-gray-900" style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {train.trainName}
                </div>
                <div className="text-xs text-gray-500">
                  {train.trainNumber}
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="text-sm text-gray-900">
                  {train.from} → {train.to}
                </div>
              </td>
              <td className="px-3 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(train.date).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  {train.time}
                </div>
              </td>
              <td className="px-3 py-3 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    train.class === "Economy"
                      ? "bg-blue-100 text-blue-800"
                      : train.class === "Business"
                      ? "bg-purple-100 text-purple-800"
                      : train.class === "Luxury"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {train.class || "Standard"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {train.distance ? `${train.distance} km` : "N/A"}
                {train.duration && (
                  <div className="text-xs text-gray-500">{train.duration}h</div>
                )}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                {train.seats}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                R{typeof train.price === 'number' 
                  ? train.price.toFixed(2) 
                  : parseFloat(train.price || 0).toFixed(2)}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(train)}
                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(train.id)}
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
  );
};

export default TrainTable;
