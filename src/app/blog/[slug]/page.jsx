import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { blogData } from '@/data/blogData';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const post = blogData.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
        <Navbar />
        <div className="pt-32 pb-20 text-center flex-grow">
          <h1 className="text-3xl font-bold text-cyan-400 mb-4">Post not found!</h1>
          <Link href="/blog" className="text-gray-400 hover:text-cyan-400">← Back to Blog</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full flex-grow">
        
        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-8">
          <FaArrowLeft /> Back to Blog
        </Link>

        {/* Article Header */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 pb-6 border-b border-gray-800">
            <span className="flex items-center gap-2"><FaUser className="text-cyan-400" /> {post.author}</span>
            <span className="flex items-center gap-2"><FaCalendarAlt className="text-cyan-400" /> {post.date}</span>
          </div>
        </div>

        {/* Featured Image */}
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-64 md:h-96 object-cover rounded-2xl mb-10 border border-gray-800"
        />

        {/* Content */}
        <article className="prose prose-invert max-w-none">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-300 text-lg leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Related / Back CTA */}
        <div className="mt-16 pt-10 border-t border-gray-800 text-center">
          <h3 className="text-2xl font-bold mb-6">Enjoyed this article?</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/blog" className="bg-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition">
              Read More Articles
            </Link>
            <Link href="/#themes" className="bg-cyan-600 px-6 py-3 rounded-xl font-bold hover:bg-cyan-700 transition">
              Browse Themes
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}