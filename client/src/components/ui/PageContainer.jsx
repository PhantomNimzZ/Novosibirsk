import React from "react";

const PageContainer = ({ title, children }) => {
  return (
    <div className="w-full px-4 py-8 flex flex-col items-center">
      {title && (
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {title}
        </h1>
      )}

      <div className="w-full max-w-3xl">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
