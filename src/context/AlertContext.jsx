"use client";

import { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle, FaTimes, FaTrash } from 'react-icons/fa';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  // alert = { type, title, message, confirmText, cancelText, onConfirm, isConfirm }

  const showAlert = (title, message = '', type = 'success') => {
    setAlert({ type, title, message, isConfirm: false });
  };

  const showConfirm = ({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm }) => {
    setAlert({ type: 'confirm', title, message, confirmText, cancelText, onConfirm, isConfirm: true });
  };

  const closeAlert = () => setAlert(null);

  const handleConfirm = () => {
    if (alert?.onConfirm) alert.onConfirm();
    closeAlert();
  };

  // Icon & color based on type
  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return { icon: <FaCheckCircle />, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' };
      case 'error':
        return { icon: <FaTimesCircle />, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
      case 'warning':
        return { icon: <FaExclamationTriangle />, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
      case 'confirm':
        return { icon: <FaTrash />, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
      default:
        return { icon: <FaInfoCircle />, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, closeAlert }}>
      {children}
      
      {/* Alert Popup */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={alert.isConfirm ? undefined : closeAlert}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                alert.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                alert.type === 'error' || alert.type === 'confirm' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                alert.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}></div>

              {/* Close button */}
              {!alert.isConfirm && (
                <button
                  onClick={closeAlert}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
                >
                  <FaTimes />
                </button>
              )}

              {/* Icon */}
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${getTypeStyles(alert.type).bg} ${getTypeStyles(alert.type).color} rounded-full flex items-center justify-center text-3xl mb-5 border-2 ${getTypeStyles(alert.type).border}`}>
                  {getTypeStyles(alert.type).icon}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{alert.title}</h3>
                
                {alert.message && (
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{alert.message}</p>
                )}

                {/* Buttons */}
                {alert.isConfirm ? (
                  <div className="flex gap-3 w-full mt-2">
                    <button
                      onClick={closeAlert}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition text-sm"
                    >
                      {alert.cancelText}
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-sm"
                    >
                      {alert.confirmText}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={closeAlert}
                    className={`w-full ${
                      alert.type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                      alert.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                      alert.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                      'bg-cyan-600 hover:bg-cyan-700'
                    } text-white font-bold py-3 rounded-xl transition text-sm mt-2`}
                  >
                    OK
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);