import Link from 'next/link';
import { FaWordpress, FaHtml5, FaReact, FaArrowRight } from 'react-icons/fa';

export default function ThemeTechnologies() {
  const technologies = [
    {
      id: 1,
      slug: "react-nextjs", // URL এর জন্য
      icon: <FaReact />,
      title: "React & Next.js Themes",
      desc: "Modern, blazing-fast, and SEO-friendly themes built with the latest React and Next.js ecosystem.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      count: "10+ Themes"
    },
    {
      id: 2,
      slug: "wordpress",
      icon: <FaWordpress />,
      title: "WordPress Themes",
      desc: "Customizable, easy-to-manage WordPress themes with Elementor and WooCommerce support.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      count: "15+ Themes"
    },
    {
      id: 3,
      slug: "html-css-js",
      icon: <FaHtml5 />,
      title: "HTML, CSS & JS Templates",
      desc: "Lightweight, dependency-free, and highly optimized static templates for any business need.",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      count: "20+ Templates"
    }
  ];

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">What We Offer</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We provide premium quality themes and templates for every technology stack you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {technologies.map((tech) => (
            // পুরো কার্ডটিকে Link দিয়ে মুড়িয়ে দেওয়া হয়েছে
            <Link key={tech.id} href={`/category/${tech.slug}`} className="block h-full group">
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                
                {/* Background Glow on Hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition"></div>

                <div className={`w-16 h-16 ${tech.bg} ${tech.color} rounded-2xl flex items-center justify-center text-3xl mb-6 border ${tech.border}`}>
                  {tech.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition">{tech.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">{tech.desc}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${tech.bg} ${tech.color} border ${tech.border}`}>
                    {tech.count}
                  </span>
                  {/* Arrow Icon that moves on hover */}
                  <span className="text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all">
                    <FaArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}