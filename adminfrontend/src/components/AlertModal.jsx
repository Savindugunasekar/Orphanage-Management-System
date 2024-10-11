
import React from 'react';

export default function AlertModal({ showModal, onClose, message }) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-1/3 p-6 shadow-lg text-center">
        <p className="text-lg">{message}</p>
        <button 
          onClick={onClose} 
          className="mt-4 bg-primary text-white py-2 px-4 rounded-md">
          OK
        </button>
      </div>
    </div>
  );
}
