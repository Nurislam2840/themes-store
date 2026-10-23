"use client";
import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const closeAlert = () => setAlert(null);

  const getIcon = (type) => {
    switch (type) {
      case "success": return <FaCheckCircle className="text-brand-gold text-3xl" />;
      case "error": return <FaExclamationCircle className="text-red-500 text-3xl" />;
      default: return <FaInfoCircle className="text-blue-500 text-3xl" />;
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-brand-card border border-brand-border shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px] max-w-[90vw]"
          >
            <div>{getIcon(alert.type)}</div>
            <p className="text-brand-light font-medium flex-grow">{alert.message}</p>
            <button onClick={closeAlert} className="text-brand-muted hover:text-white transition">
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
