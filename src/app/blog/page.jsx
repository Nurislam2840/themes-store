// src/app/blog/page.jsx
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaUser, FaArrowRight, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#09090B] flex justify-center items-center"><FaSpinner className="text-4xl text-brand-gold animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] pt-32 pb-20 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Insights & <span className="text-transparent bg-clip-text bg-gold-gradient">Updates</span>
          </h1>
          <p className="text-gray-500 dark:text-brand-muted text-lg max-w-2xl mx-auto">
            Read the latest news, tutorials, and updates from our team.
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl">
            <p className="text-gray-500 dark:text-brand-muted">No blog posts published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden group hover:border-brand-gold/30 transition-all flex flex-col"
              >
                <Link href={`/blog/${post.slug}`} className="relative h-48 w-full overflow-hidden block">
                  <Image src={post.image_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-brand-muted mb-3">
                    <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><FaUser /> {post.author_name}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">{post.title}</h2>
                  </Link>
                  <p className="text-gray-500 dark:text-brand-muted text-sm line-clamp-3 mb-4 flex-grow">{post.content.substring(0, 120)}...</p>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-brand-gold font-bold text-sm hover:gap-3 transition-all mt-auto">
                    Read More <FaArrowRight size={12} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}