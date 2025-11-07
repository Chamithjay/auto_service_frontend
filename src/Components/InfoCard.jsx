import React from "react";

export default function InfoCard({ title, icon: Icon, items }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#14274E] mb-3 sm:mb-4 flex items-center gap-2">
        {Icon && <Icon className="text-[#394867]" size={24} />}
        {title}
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-xs sm:text-sm">
            <span className="text-[#9BA4B4]">{item.label}:</span>
            <span
              className={`text-[#14274E] ${item.mono ? "font-mono" : ""} ${
                item.bold ? "font-semibold" : ""
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
