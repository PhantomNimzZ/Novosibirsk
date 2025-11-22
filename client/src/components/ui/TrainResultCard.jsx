import React from "react";
import PrimaryButton from "./PrimaryButton";

const TrainResultCard = ({ train, onSelect }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {train.name}
          </h2>

          <p className="mt-1 text-gray-600">
            {train.from} → {train.to}
          </p>

          <p className="text-gray-500 text-sm">
            Departure: {train.time}
          </p>
        </div>

        <PrimaryButton onClick={() => onSelect(train)}>
          Book
        </PrimaryButton>
      </div>
    </div>
  );
};

export default TrainResultCard;
