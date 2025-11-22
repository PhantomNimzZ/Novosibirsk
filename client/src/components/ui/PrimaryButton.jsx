import React from "react";

const PrimaryButton = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`
        px-4 py-2 font-medium rounded-md 
        bg-blue-600 text-white 
        hover:bg-blue-700 transition 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
