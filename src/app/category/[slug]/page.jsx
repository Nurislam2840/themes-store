"use client";

import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ThemeCard from '@/components/ui/ThemeCard';
import { themesData } from '@/data/themesData';
import Link from 'next/link';
import { FaArrowLeft, FaFolderOpen } from 'react-icons/fa';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug;

  // URL slug থেকে ডাটা ফাইলের ক্যাটাগরি নামে ম্যাপিং করা
  const categoryMap = {
    'react-nextjs': 'Next.js/React',
    'wordpress': 'WordPress',
    'html-css-js': 'HTML/CSS/JS',
  };

  const targetCategory = categoryMap[slug];

  // নির্দিষ্ট ক্যাটাগরির থিম ফিল্টার করা
  const filteredThemes = themesData.filter((theme) => theme.category === targetCategory);

  // ক্যাটাগরির সুন্দর টাইটেল তৈরি করা
  const displayTitle = targetCategory ? targetCategory.replace('/', ' & ') + ' Themes' : 'Category Not Found';

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full flex-grow">
        
        {/* Back Button */}
        <Link href="/#themes" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-8">
          <FaArrowLeft /> Back to All Themes
        </Link>

        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{displayTitle}</h1>
          <p className="text-gray-400">Explore our premium {targetCategory} themes.</p>
        </div>

        {/* Theme Grid */}
        {filteredThemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredThemes.map((theme, index) => (
              <ThemeCard key={theme.id} theme={theme} index={index} />
            ))}
          </div>
        ) : (
          // কোনো থিম না পাওয়া গেলে
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl">
            <div className="text-6xl text-gray-700 mb-6 flex justify-center">
              <FaFolderOpen />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Themes Found</h3>
            <p className="text-gray-400 mb-8">We haven't added any {targetCategory} themes yet. Please check back later!</p>
            <Link href="/#themes" className="bg-cyan-600 px-6 py-3 rounded-xl font-bold hover:bg-cyan-700 transition">
              Browse All Themes
            </Link>
          </div>
        )}

      </div>

      <Footer />
    </main>
  );
}