// src/app/blog/[slug]/page.js
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaCalendarAlt, FaUser } from "react-icons/fa";

async function getPost(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).single();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Blog`,
    description: post.content.substring(0, 160),
    openGraph: { title: post.title, images: [{ url: post.image_url }] },
  };
}

export default async function SingleBlogPage({ params }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] pt-32 pb-20 px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 dark:text-brand-muted hover:text-brand-gold mb-8 text-sm font-medium">
          <FaArrowLeft /> Back to Blog
        </Link>

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-brand-gold font-bold uppercase tracking-wider mb-4">
            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center gap-1"><FaUser /> {post.author_name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">{post.title}</h1>
        </div>

        <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl mb-12">
          <Image src={post.image_url} alt={post.title} fill priority className="object-cover" />
        </div>

        <div className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="prose dark:prose-invert prose-lg max-w-none text-gray-600 dark:text-brand-muted leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </div>
    </main>
  );
}