import React from "react";

/**
 * Skeleton loader for table rows (loading state)
 */
export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-200">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <td key={colIdx} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

/**
 * Loading spinner component
 */
export const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14274E]"></div>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};

export default TableSkeleton;
