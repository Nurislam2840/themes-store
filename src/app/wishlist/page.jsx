"use client";

import Navbar from '@/components/layout/Navbar';
import ThemeCard from '@/components/ui/ThemeCard';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import { FaHeartBroken } from 'react-icons/fa';

export default function WishlistPage() {
  const { wishlist } = useStore();

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Your Wishlist</h1>
          <p className="text-gray-400">You have {wishlist.length} theme{wishlist.length !== 1 ? 's' : ''} saved.</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-700 mb-6 flex justify-center">
              <FaHeartBroken />
            </div>
            <p className="text-gray-500 text-xl mb-8">Your wishlist is currently empty.</p>
            <Link href="/#themes" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-xl transition">
              Browse Themes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((theme, index) => (
              <ThemeCard key={theme.id} theme={theme} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}