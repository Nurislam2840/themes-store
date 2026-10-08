"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeCard from '@/components/ui/ThemeCard';
import { FaSearch, FaChevronDown, FaSort, FaCheck } from 'react-icons/fa';
import { useStore } from '@/context/StoreContext';

// ============ CUSTOM SORT DROPDOWN COMPONENT ============
function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'default', label: 'Default', desc: 'Featured order' },
    { value: 'low-high', label: 'Price: Low to High', desc: 'Cheapest first' },
    { value: 'high-low', label: 'Price: High to Low', desc: 'Premium first' },
  ];

  const selected = options.find(o => o.value === value) || options[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full md:w-1/3" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gray-800 hover:bg-gray-750 border ${isOpen ? 'border-cyan-500/60 ring-1 ring-cyan-500/20' : 'border-gray-700'} rounded-xl px-4 py-3 outline-none transition-all duration-300 flex items-center justify-between group`}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-cyan-500/10 text-cyan-400 rounded-lg flex items-center justify-center">
            <FaSort className="text-xs" />
          </div>
          <span className="text-white text-sm font-medium">{selected.label}</span>
        </div>
        <FaChevronDown className={`text-gray-400 text-xs transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {options.map((option, idx) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors border-b border-gray-800/70 last:border-0 ${
                  value === option.value 
                    ? 'bg-cyan-500/10' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <div>
                  <p className={`text-sm font-semibold ${value === option.value ? 'text-cyan-400' : 'text-white'}`}>
                    {option.label}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{option.desc}</p>
                </div>
                {value === option.value && (
                  <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCheck className="text-[9px] text-white" />
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// ============ END SORT DROPDOWN ============

export default function ThemeFilter() {
  const { themes, isLoadingThemes } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const categories = ['All', ...new Set(themes.map((theme) => theme.category))];

  const filteredThemes = useMemo(() => {
    let result = [...themes];
    if (searchTerm) {
      result = result.filter(
        (theme) =>
          theme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (theme.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter((theme) => theme.category === selectedCategory);
    }
    if (sortBy === 'low-high') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'high-low') result.sort((a, b) => b.price - a.price);
    return result;
  }, [themes, searchTerm, selectedCategory, sortBy]);

  return (
    <section id="themes" className="py-24 px-6 max-w-7xl mx-auto">
      
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
          Explore Our <span className="text-cyan-400">Themes</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Find the perfect theme for your business, portfolio, or e-commerce store.
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-5 mb-8 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
        
        {/* Search Input */}
        <div className="relative w-full md:w-2/3">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input 
            type="text"
            placeholder="Search themes, technologies, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-11 pr-4 py-3 rounded-xl outline-none border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm placeholder:text-gray-500"
          />
        </div>

        {/* Custom Sort Dropdown */}
        <SortDropdown value={sortBy} onChange={setSortBy} />

      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-8 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 border ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-cyan-500/50 hover:text-white hover:bg-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
        <p className="text-gray-400 text-xs md:text-sm">
          Showing <span className="text-cyan-400 font-bold">{filteredThemes.length}</span> theme{filteredThemes.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && <span className="text-gray-500"> in {selectedCategory}</span>}
        </p>
      </div>

      {/* Theme Grid */}
      {isLoadingThemes ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading themes...</p>
        </div>
      ) : filteredThemes.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {filteredThemes.map((theme, index) => (
            <ThemeCard key={theme.id} theme={theme} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/50 border border-gray-800 rounded-3xl">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🔍
          </div>
          <p className="text-gray-400 text-lg mb-2">No themes found</p>
          <p className="text-gray-500 text-sm mb-6">Try different search terms or clear filters</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSortBy('default'); }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:from-cyan-600 hover:to-blue-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}

    </section>
  );
}