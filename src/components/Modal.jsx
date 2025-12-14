import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Komponen modal yang dapat digunakan kembali dengan berbagai tipe.
 * @param {object} props - Props untuk komponen.
 * @param {boolean} props.isOpen - State untuk menampilkan atau menyembunyikan modal.
 * @param {function} props.onClose - Fungsi yang dipanggil saat modal ditutup.
 * @param {string} props.title - Judul yang ditampilkan di header modal.
 * @param {React.ReactNode} props.children - Konten utama dari modal.
 * @param {string} [props.type='default'] - Tipe modal: 'default', 'success', 'warning', 'error', 'info'.
 * @param {React.ReactNode} [props.footer] - Konten opsional untuk footer modal (biasanya untuk tombol aksi).
 * @param {boolean} [props.isLoading=false] - State loading untuk tombol aksi.
 * @param {string} [props.size='md'] - Ukuran modal: 'sm', 'md', 'lg', 'xl'.
 * @example
 * <Modal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   title="Konfirmasi Hapus"
 *   type="warning"
 *   footer={
 *     <div className="flex justify-end gap-3">
 *       <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Batal</button>
 *       <button onClick={handleDelete} className="btn-danger">Hapus</button>
 *     </div>
 *   }
 * >
 *   <p>Apakah Anda yakin ingin menghapus item ini?</p>
 * </Modal>
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  type = 'default',
  footer,
  isLoading = false,
  size = 'md'
}) => {
  const typeConfig = {
    default: { icon: Info, color: 'blue', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    success: { icon: CheckCircle, color: 'green', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    warning: { icon: AlertTriangle, color: 'orange', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    error: { icon: AlertCircle, color: 'red', bgColor: 'bg-red-100', iconColor: 'text-red-600' },
    info: { icon: Info, color: 'blue', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const Icon = typeConfig[type].icon;
  const { color, bgColor, iconColor } = typeConfig[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`relative ${sizeClasses[size]} w-full max-h-[90vh] flex flex-col`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Container */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className={`flex items-center justify-between p-5 border-b ${bgColor} border-${color}-200`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Tutup modal"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {children}
                  </div>
                </div>
                
                {/* Modal Footer (Opsional) */}
                {footer && (
                  <div className="p-5 border-t border-gray-200 bg-gray-50">
                    {footer}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;