import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const ConfirmModal = ({ onConfirm, onCancel }) => {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center min-w-[300px]">
        <p className="mb-4 text-lg text-gray-800 text-center">Are you sure you want to delete this test?</p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
