// src/components/ui/CustomSelect.jsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaCheck } from "react-icons/fa";

export default function CustomSelect({ options, value, onChange, placeholder = "Select an option", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-left flex items-center justify-between outline-none focus:border-brand-gold transition-colors"
      >
        <span className={selectedOption ? "text-white text-sm" : "text-brand-muted text-sm"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown
          size={12}
          className={`text-brand-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[100] top-full left-0 w-full mt-2 bg-[#121214] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-brand-muted">No options available</div>
            ) : (
              <div className="p-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors ${
                      value === option.value
                        ? "bg-brand-gold/10 text-brand-gold font-semibold"
                        : "text-brand-muted hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {option.label}
                    {value === option.value && <FaCheck size={12} />}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}