import React from 'react';

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center  z-1">
      <div className="bg-white rounded shadow-lg relative">
        {children}
        {/* <button onClick={onClose} className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700">
          &times;
        </button> */}
      </div>
    </div>
  );
};

export default Modal;