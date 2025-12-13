// components/Notification.jsx - PERBAIKI UNTUK GLOBAL
import React, { useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

const icons = {
  success: <CheckCircle className="w-6 h-6 text-green-500" />,
  error: <XCircle className="w-6 h-6 text-red-500" />,
  warning: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
  info: <Info className="w-6 h-6 text-blue-500" />,
};

// 🔥 CREATE CONTEXT UNTUK GLOBAL NOTIFICATION
const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);

  const showNotification = useCallback((message, type = "info") => {
    const id = Date.now();
    setNotification({ id, message, type });
    setNotificationKey((prev) => prev + 1);

    // Auto dismiss setelah 3 detik
    setTimeout(() => {
      setNotification((prev) => (prev?.id === id ? null : prev));
    }, 3000);
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
    setNotificationKey((prev) => prev + 1);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notification,
        notificationKey,
        showNotification,
        dismissNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const Notification = ({ notification, notificationKey, onDismiss }) => {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999]">
      <AnimatePresence mode="wait">
        {notification && (
          <motion.div
            key={notificationKey}
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 min-w-[300px] max-w-[500px]"
          >
            {icons[notification.type]}
            <span className="font-medium text-gray-800 flex-1">
              {notification.message}
            </span>
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;