// client/src/components/booking/SeatSelector.jsx
import { useState, useEffect } from "react";

/**
 * Interactive seat selector component
 * Shows a grid of seats with availability status
 * 
 * @param {number} totalSeats - Total seats available on the train
 * @param {Array} bookedSeats - Array of seat numbers already booked (e.g. ["1A", "2B"])
 * @param {string} selectedSeat - Currently selected seat
 * @param {Function} onSeatSelect - Callback when a seat is selected
 */
const SeatSelector = ({ totalSeats = 60, bookedSeats = [], selectedSeat, onSeatSelect }) => {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    // Generate seat layout: rows of 4 (A, B, C, D)
    const rows = Math.ceil(totalSeats / 4);
    const seatLayout = [];

    for (let row = 1; row <= rows; row++) {
      for (let col of ["A", "B", "C", "D"]) {
        const seatNumber = `${row}${col}`;
        const seatIndex = (row - 1) * 4 + ["A", "B", "C", "D"].indexOf(col);
        
        if (seatIndex < totalSeats) {
          seatLayout.push({
            number: seatNumber,
            row,
            col,
            isBooked: bookedSeats.includes(seatNumber),
            isSelected: seatNumber === selectedSeat,
          });
        }
      }
    }

    setSeats(seatLayout);
  }, [totalSeats, bookedSeats, selectedSeat]);

  const handleSeatClick = (seatNumber, isBooked) => {
    if (!isBooked) {
      onSeatSelect(seatNumber);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Select Your Seat</h3>

      {/* Legend */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 border border-gray-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 border border-blue-700 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-100 border border-red-300 rounded text-red-500 flex items-center justify-center text-xs">
            ✕
          </div>
          <span>Booked</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="max-w-md mx-auto">
        {/* Front of train indicator */}
        <div className="text-center mb-4 text-sm text-gray-500 font-medium">
          ← Front of Train
        </div>

        <div className="grid grid-cols-4 gap-2">
          {seats.map((seat, index) => (
            <button
              key={seat.number}
              onClick={() => handleSeatClick(seat.number, seat.isBooked)}
              disabled={seat.isBooked}
              className={`
                h-10 rounded font-medium text-sm transition-all border
                ${seat.isBooked
                  ? "bg-red-100 border-red-300 text-red-500 cursor-not-allowed opacity-60"
                  : seat.isSelected
                  ? "bg-blue-600 border-blue-700 text-white scale-105 shadow-md"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400"
                }
                ${(index % 4 === 1 || index % 4 === 2) ? "mx-1" : ""} // Aisle spacing
              `}
            >
              {seat.isBooked ? "✕" : seat.number}
            </button>
          ))}
        </div>

        {/* Aisle labels */}
        <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-gray-400 text-center">
          <span>Window</span>
          <span>Aisle</span>
          <span>Aisle</span>
          <span>Window</span>
        </div>
      </div>

      {selectedSeat && (
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-center">
          <span className="text-sm font-medium text-blue-900">
            Selected: Seat {selectedSeat}
          </span>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;
