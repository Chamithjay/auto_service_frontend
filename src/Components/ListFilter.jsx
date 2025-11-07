import React from "react";

/**
 * Reusable filter bar component with search input and filter buttons
 */
const ListFilter = ({
  searchTerm,
  onSearchChange,
  filters = [],
  onFilterChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#394867]"
        />
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter.active
                  ? "bg-[#394867] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListFilter;
