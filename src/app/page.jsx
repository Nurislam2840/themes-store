import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import ThemeFilter from '@/components/ui/ThemeFilter';
import FAQ from '@/components/ui/FAQ';
import Footer from '@/components/layout/Footer';
import ThemeTechnologies from '@/components/ui/ThemeTechnologies';
import BlogPreview from '@/components/ui/BlogPreview';
import { FaCode, FaRocket, FaHeadset } from 'react-icons/fa';

export default function ThemeStore() {
  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
      
      <Navbar />

      {/* ১. Hero Section */}
      <section className="pt-36 pb-20 px-6 text-center max-w-4xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full -z-10"></div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Premium <span className="text-cyan-400">Themes</span> For Your <br /> Next Project
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
          Beautifully crafted, fully responsive, and highly optimized themes to launch your website in minutes.
        </p>
        <Link href="#themes" className="bg-cyan-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-700 transition shadow-[0_0_25px_rgba(8,145,178,0.5)]">
          Browse Themes
        </Link>
      </section>

      {/* ২. Features */}
      <section className="py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-cyan-500/20"><FaCode /></div>
            <h3 className="text-xl font-bold mt-2">Clean Code</h3>
            <p className="text-gray-400 text-sm">Well-structured, modern code that is easy to customize.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-blue-500/20"><FaRocket /></div>
            <h3 className="text-xl font-bold mt-2">Blazing Fast</h3>
            <p className="text-gray-400 text-sm">Optimized for performance with Next.js and Tailwind CSS.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-green-500/20"><FaHeadset /></div>
            <h3 className="text-xl font-bold mt-2">24/7 Support</h3>
            <p className="text-gray-400 text-sm">Dedicated support to help you with any issues or customizations.</p>
          </div>
        </div>
      </section>

      {/* ৩. What We Offer (Categories) */}
      <ThemeTechnologies />

      {/* ৪. Theme Filter & Grid */}
      <ThemeFilter />
      
      {/* ৫. Blog Preview Section (নতুন যুক্ত) */}
      <BlogPreview />

      {/* ৬. FAQ Section */}
      <FAQ />

      {/* ৭. Footer */}
      <Footer />

    </main>
  );
}