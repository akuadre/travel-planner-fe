import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import Modal from './Modal';

const SuccessModal = ({
  isOpen,
  onClose,
  title = "Sukses!",
  message,
  type = "success"
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      footer={
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            Tutup
          </button>
        </div>
      }
    >
      <div className="text-center py-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-gray-700 text-lg">{message}</p>
      </div>
    </Modal>
  );
};

export default SuccessModal;