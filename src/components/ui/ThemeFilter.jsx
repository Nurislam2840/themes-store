"use client";

import { useState, useMemo } from 'react';
import ThemeCard from '@/components/ui/ThemeCard';
import { FaSearch } from 'react-icons/fa';
import { useStore } from '@/context/StoreContext';

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
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Explore Our Themes</h2>
        <p className="text-gray-400">Find the perfect theme for your business, portfolio, or e-commerce store.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-10 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text"
            placeholder="Search themes or technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none border border-gray-700 focus:border-cyan-500 transition text-sm"
          />
        </div>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-1/4 bg-gray-800 text-white px-4 py-3 rounded-xl outline-none border border-gray-700 focus:border-cyan-500 transition cursor-pointer text-sm"
        >
          <option value="default">Sort by: Default</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3 mb-10 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
              selectedCategory === cat
                ? 'bg-cyan-600 text-white border-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.5)]'
                : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-cyan-500 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-sm text-center mb-8">
        Showing <span className="text-cyan-400 font-bold">{filteredThemes.length}</span> theme{filteredThemes.length !== 1 ? 's' : ''}
      </p>

      {isLoadingThemes ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredThemes.length > 0 ? (
        // ৩ কলাম গ্রিড - মোবাইলেও ২ কলাম, বড় স্ক্রিনে ৩ কলাম
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {filteredThemes.map((theme, index) => (
            <ThemeCard key={theme.id} theme={theme} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">😔 No themes found matching your criteria.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSortBy('default'); }}
            className="mt-4 text-cyan-400 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}