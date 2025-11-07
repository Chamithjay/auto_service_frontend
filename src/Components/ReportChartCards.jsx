import React from "react";
import { CSVLink } from "react-csv";

const ReportChartCards = ({
  title,
  children,
  csvData,
  csvHeaders,
  csvFilename,
  breakAfter = false, // when true, add a page break after this card when printing
}) => {
  const containerClass = `relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-md ring-1 ring-[#9BA4B4]/15 backdrop-blur transition-all duration-200 hover:shadow-xl${
    breakAfter ? " page-break" : ""
  }`;
  return (
    <div className={containerClass}>
      {/* gradient top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-sky-400" />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#14274E]">{title}</h3>

        {/* Export button */}
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename={csvFilename}
          className="no-print rounded-lg bg-white/60 px-3 py-1.5 text-sm font-semibold text-[#394867] ring-1 ring-inset ring-[#9BA4B4]/30 backdrop-blur hover:bg-white/80"
        >
          Export CSV
        </CSVLink>
      </div>

      {/* Chart wrapper (important for printing) */}
      <div className="chart-print-wrapper mt-4" style={{ height: 300 }}>
        {children}
      </div>
    </div>
  );
};

export default ReportChartCards;
