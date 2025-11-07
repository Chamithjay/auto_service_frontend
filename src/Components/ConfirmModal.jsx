import React from "react";

const ConfirmModal = ({
  isOpen,
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="bg-white rounded-lg shadow-xl z-60 max-w-md w-full p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-[#14274E] mb-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[#394867] mb-4 sm:mb-6">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 border rounded-md text-[#394867] bg-[#F1F6F9] text-sm sm:text-base hover:bg-[#9BA4B4]/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm sm:text-base transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
