import React from "react";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl px-4 py-8">
        {children}
      </div>
    </div>
  );
}
