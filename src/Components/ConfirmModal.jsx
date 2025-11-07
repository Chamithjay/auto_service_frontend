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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="bg-white rounded-lg shadow-xl z-60 max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-[#14274E] mb-2">{title}</h3>
        <p className="text-sm text-[#394867] mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-md text-[#394867] bg-[#F1F6F9]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
