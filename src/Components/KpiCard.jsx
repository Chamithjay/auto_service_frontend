import React from "react";

/**
 * KpiCard
 * Props:
 * - title: string
 * - value: string | number
 * - icon?: ReactNode (optional)
 * - accent?: string (hex color for gradient start, default indigo)
 */
const KpiCard = ({ title, value, icon, accent = "#6366F1" }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur p-5 shadow-md ring-1 ring-[#9BA4B4]/15 transition-all duration-200 hover:shadow-xl">
      {/* subtle gradient top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-sky-400" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9BA4B4]">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold text-[#14274E]">{value}</p>
        </div>

        {icon ? (
          <div
            className="ml-3 grid h-11 w-11 place-items-center rounded-xl text-white shadow"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, #394867 100%)`,
            }}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default KpiCard;
