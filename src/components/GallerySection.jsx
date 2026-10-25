"use client";
import { useState } from "react";
import { FaTimes, FaImage } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function GallerySection({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-8 mb-8">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-white/5 pb-4">
        <div className="w-10 h-10 bg-pink-500/10 text-pink-500 dark:text-pink-400 rounded-xl flex items-center justify-center text-lg">
          <FaImage />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Screenshots</h2>
          <p className="text-gray-500 dark:text-brand-muted text-xs">Click any image to view full size</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setSelectedImage(img)}
            className="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 group cursor-pointer"
          >
            <img
              src={img}
              alt={`Screenshot ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* লাইটবক্স (মোডাল) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="Full Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}