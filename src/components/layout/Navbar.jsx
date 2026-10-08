"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaHeart, FaDollarSign } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/context/StoreContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { wishlist, currency, toggleCurrency } = useStore();

  const navLinks = [
    { name: 'Themes', href: '/#themes' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'Support', href: '/contact' },
  ];

  return (
    <>
      <nav className="fixed w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 py-4 px-6 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-[0_0_15px_rgba(8,145,178,0.4)] group-hover:scale-110 transition-transform">
            T
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Themes Store
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center text-sm font-medium text-gray-300">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-cyan-400 transition">
              {link.name}
            </Link>
          ))}
          
          {/* Wishlist Icon with Count */}
          <Link href="/wishlist" className="relative hover:text-cyan-400 transition">
            <FaHeart className="text-lg" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-cyan-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Currency Switcher */}
          <button 
            onClick={toggleCurrency} 
            className="flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-cyan-500 transition text-xs font-bold text-white"
          >
            <FaDollarSign className="text-cyan-400" />
            {currency}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-gray-950/98 backdrop-blur-lg pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl font-bold text-white">
              {navLinks.map((link, index) => (
                <motion.div 
                  key={link.name} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    onClick={() => setIsOpen(false)} 
                    className="hover:text-cyan-400 transition block border-b border-gray-800 pb-3"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Currency Switcher */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mt-2">
                <span className="text-lg">Currency:</span>
                <button onClick={toggleCurrency} className="bg-cyan-600 text-white px-4 py-1 rounded-lg text-sm">
                  {currency === 'USD' ? 'Switch to BDT' : 'Switch to USD'}
                </button>
              </div>

              {/* Mobile Browse Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4"
              >
                <Link 
                  href="/#themes" 
                  onClick={() => setIsOpen(false)}
                  className="bg-cyan-600 text-white text-center py-4 rounded-xl font-bold hover:bg-cyan-700 transition block shadow-[0_0_20px_rgba(8,145,178,0.4)]"
                >
                  Browse Themes
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}