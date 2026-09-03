import React from "react";

function Errorpage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-gray-600 mb-6">This page isn’t available right now. Let’s take you back to where you belong.</p>
      </div>
    </div>
  );
}

export default Errorpage;