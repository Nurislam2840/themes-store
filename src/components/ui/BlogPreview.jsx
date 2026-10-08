import Link from 'next/link';
import { blogData } from '@/data/blogData';
import { FaArrowRight } from 'react-icons/fa';

export default function BlogPreview() {
  const latestBlogs = blogData.slice(0, 3);

  return (
    <section className="py-20 bg-gray-900/40 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Latest From Our Blog</h2>
            <p className="text-gray-400">Tips, tutorials, and industry insights.</p>
          </div>
          <Link href="/blog" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2">
            View All <FaArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestBlogs.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                <div className="relative h-44 w-full overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">{post.category}</span>
                  <h3 className="text-base font-bold text-white mb-3 group-hover:text-cyan-400 transition line-clamp-2 flex-grow">
                    {post.title}
                  </h3>
                  <span className="text-xs text-gray-500 mt-3">{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}