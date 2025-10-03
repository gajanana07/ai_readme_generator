// InfoCard.jsx
import React from "react";

export default function InfoCard({ icon, title, description }) {
  return (
    <div
      className="w-full max-w-5xl mx-auto bg-gray-900/60 text-white p-8 rounded-xl shadow-lg border border-purple-900/40 
                    hover:shadow-green-800 hover:scale-105 transform transition-all duration-300"
    >
      <div className="flex items-start gap-6">
        {/* Icon */}
        <div className="text-5xl text-white">{icon}</div>

        {/* Text */}
        <div>
          <h3 className="text-2xl font-semibold mb-2 text-white">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
}
