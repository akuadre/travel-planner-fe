import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import Modal from './Modal';

/**
 * Modal khusus untuk konfirmasi penghapusan.
 * @param {object} props - Props untuk komponen.
 * @param {boolean} props.isOpen - State untuk menampilkan modal.
 * @param {function} props.onClose - Fungsi untuk menutup modal.
 * @param {function} props.onConfirm - Fungsi yang dipanggil saat konfirmasi.
 * @param {string} [props.title] - Judul item yang akan dihapus.
 * @param {string} [props.message] - Pesan kustom.
 * @param {boolean} [props.isBulk] - Apakah penghapusan bulk.
 * @param {number} [props.itemCount] - Jumlah item untuk bulk delete.
 * @param {boolean} [props.isLoading] - State loading.
 */
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isBulk = false,
  itemCount = 0,
  isLoading = false
}) => {
  const getMessage = () => {
    if (message) return message;
    
    if (isBulk && itemCount > 0) {
      return `Apakah Anda yakin ingin menghapus ${itemCount} destinasi? Tindakan ini tidak dapat dibatalkan.`;
    }
    
    if (title) {
      return `Apakah Anda yakin ingin menghapus destinasi "${title}"? Tindakan ini tidak dapat dibatalkan.`;
    }
    
    return "Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isBulk ? "Hapus Destinasi" : "Hapus Destinasi"}
      type="error"
      isLoading={isLoading}
      footer={
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5 mr-2" />
                Ya, Hapus
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-100 rounded-xl">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-gray-700 text-lg font-medium mb-2">
            {getMessage()}
          </p>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 mt-4">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-semibold">Perhatian:</span>
            </div>
            <ul className="mt-2 space-y-1 text-red-600 text-sm">
              <li>• Data yang dihapus tidak dapat dikembalikan</li>
              <li>• Semua itinerary terkait juga akan dihapus</li>
              <li>• Foto dan file yang diunggah akan dihapus</li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;