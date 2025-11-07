import { useEffect } from "react";

const Toast = ({ isOpen, message, onClose, type = "success" }) => {
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      onClose?.();
    }, 3000);
    return () => clearTimeout(t);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isError = type === "error";
  const bg = isError ? "bg-red-50" : "bg-emerald-50";
  const border = isError ? "border-red-200" : "border-emerald-200";
  const text = isError ? "text-red-800" : "text-emerald-800";
  const iconBg = isError ? "bg-red-100" : "bg-emerald-100";
  const iconColor = isError ? "text-red-600" : "text-emerald-600";
  const closeText = isError
    ? "text-red-600 hover:text-red-800"
    : "text-emerald-600 hover:text-emerald-800";

  return (
    <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50">
      <div
        className={`max-w-xs w-full ${bg} border ${border} ${text} px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg`}
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className={`${iconBg} p-1.5 sm:p-2 rounded-full`}>
            {isError ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="flex-1 text-xs sm:text-sm font-medium">{message}</div>
          <button
            onClick={onClose}
            className={`${closeText} text-xs sm:text-sm font-semibold`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
