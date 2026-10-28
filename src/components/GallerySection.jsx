// src/components/GallerySection.jsx
"use client";
import { useState } from "react";
import { FaTimes, FaImage, FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function GallerySection({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const nextImage = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-4 md:p-8 mb-8">
      {/* হেডার */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-500/10 text-pink-500 dark:text-pink-400 rounded-xl flex items-center justify-center text-lg">
            <FaImage />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Screenshots</h2>
            <p className="text-gray-500 dark:text-brand-muted text-xs">Click to view full size</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-brand-muted px-3 py-1 rounded-full">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* মেইন বড় ইমেজ (১৬:৯ রেশিও) */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative w-full aspect-video rounded-2xl overflow-hidden group cursor-zoom-in bg-gray-200 dark:bg-[#09090B] border border-gray-200 dark:border-white/10"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              src={images[activeIndex]}
              alt={`Screenshot ${activeIndex + 1}`}
              className="w-full h-full object-cover object-top"
            />
          </AnimatePresence>
          
          {/* মেইন ইমেজের ওপর নেভিগেশন এরো (যদি ১টির বেশি ইমেজ থাকে) */}
          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-brand-gold text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10">
                <FaChevronLeft size={14} />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-brand-gold text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10">
                <FaChevronRight size={14} />
              </button>
            </>
          )}

          {/* এক্সপ্যান্ড আইকন */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10">
            <FaExpand size={14} />
          </div>
        </div>

        {/* থাম্বনেইল স্লাইডার */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 md:gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  activeIndex === i 
                    ? "border-brand-gold shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ফুল স্ক্রিন লাইটবক্স (মোডাল) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            {/* ক্লোজ বাটন */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-all z-50"
            >
              <FaTimes size={20} />
            </button>

            {/* বড় ইমেজ */}
            <motion.img
              key={activeIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[activeIndex]}
              alt="Full Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />

            {/* লাইটবক্স নেভিগেশন */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage} 
                  className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-brand-gold text-white flex items-center justify-center backdrop-blur-md transition-all z-50"
                >
                  <FaChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImage} 
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-brand-gold text-white flex items-center justify-center backdrop-blur-md transition-all z-50"
                >
                  <FaChevronRight size={20} />
                </button>
              </>
            )}

            {/* ইমেজ কাউন্টার */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium tracking-widest bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              {activeIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}