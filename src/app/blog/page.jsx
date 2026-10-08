import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { blogData } from '@/data/blogData';
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full flex-grow">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Blog & <span className="text-cyan-400">Insights</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tips, tutorials, and industry news to help you build better websites.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogData.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><FaCalendarAlt /> {post.date}</span>
                    <span className="flex items-center gap-1"><FaUser /> {post.author}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                    <span className="text-cyan-400 text-sm font-semibold">Read Article</span>
                    <FaArrowRight className="text-cyan-400 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>

      <Footer />
    </main>
  );
}