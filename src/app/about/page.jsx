import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { 
  FaCode, FaRocket, FaHeadset, FaPalette, FaShieldAlt, FaSync,
  FaCheckCircle, FaUsers, FaAward, FaGlobeAsia, FaEnvelope, 
  FaWhatsapp, FaArrowRight, FaLayerGroup, FaWordpress, FaReact, FaHtml5 
} from 'react-icons/fa';

export const metadata = {
  title: "About Us | Themes Store",
  description: "Learn about Themes Store - Premium Next.js, WordPress, and HTML themes crafted in Bangladesh for developers and businesses worldwide.",
};

export default function AboutPage() {
  const stats = [
    { icon: <FaLayerGroup />, value: '50+', label: 'Premium Themes', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { icon: <FaUsers />, value: '500+', label: 'Happy Customers', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: <FaGlobeAsia />, value: '25+', label: 'Countries Served', color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: <FaAward />, value: '5★', label: 'Average Rating', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  const values = [
    {
      icon: <FaCode />,
      title: 'Clean, Modern Code',
      desc: 'Every theme is built with the latest technologies and best coding practices, making it easy for developers to customize.',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      icon: <FaPalette />,
      title: 'Pixel-Perfect Design',
      desc: 'Our designs are not just beautiful — they are crafted with attention to detail, ensuring a premium user experience.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      icon: <FaRocket />,
      title: 'Blazing Fast Performance',
      desc: 'Optimized for speed with lazy loading, image optimization, and modern build tools for lightning-fast websites.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure & Reliable',
      desc: 'We follow industry-standard security practices and provide regular updates to keep your website safe.',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      icon: <FaHeadset />,
      title: '24/7 Dedicated Support',
      desc: 'Our expert team is always here to help you with any issues, customizations, or general questions.',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      icon: <FaSync />,
      title: 'Lifetime Free Updates',
      desc: 'When you buy a theme, you get free lifetime updates with new features and security patches.',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
    },
  ];

  const technologies = [
    { icon: <FaReact />, name: 'React & Next.js' },
    { icon: <FaWordpress />, name: 'WordPress' },
    { icon: <FaHtml5 />, name: 'HTML / CSS / JS' },
    { icon: <FaCode />, name: 'Tailwind CSS' },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-widest">
            <FaAward /> About Themes Store
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Premium Themes For <br />
            <span className="text-cyan-400">Modern Businesses</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            We are a small but passionate team of designers and developers from Bangladesh, 
            dedicated to building world-class digital products that help businesses grow online.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-gray-800 bg-gray-900/30">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3`}>
                {stat.icon}
              </div>
              <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
              <p className="text-gray-400 text-xs md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Our <span className="text-cyan-400">Story</span>
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                <strong className="text-white">Themes Store</strong> started in 2023 as a solo 
                developer's vision to create premium quality website themes that don't break the bank. 
                What began as a small side project has now grown into a trusted brand serving customers 
                in over 25 countries.
              </p>
              <p>
                We understand the struggle developers and small businesses face — paying hundreds of 
                dollars for themes that are either too complex or lack quality. That's why we build 
                themes that are <span className="text-cyan-400 font-semibold">beautifully designed, 
                blazing fast, and easy to customize</span>, all at a fair price.
              </p>
              <p>
                Every theme we release goes through rigorous testing on multiple devices and browsers, 
                ensuring a seamless experience for you and your customers.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {technologies.map((tech, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-2 rounded-lg text-sm">
                  <span className="text-cyan-400">{tech.icon}</span>
                  <span className="text-gray-300">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 border-2 border-cyan-500/20 rounded-3xl transform rotate-3 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" 
              alt="Team working" 
              className="rounded-3xl shadow-2xl w-full h-[400px] object-cover border-4 border-gray-900"
            />
            <div className="absolute -bottom-6 -left-6 bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-2xl">
              <p className="text-3xl font-extrabold text-cyan-400 mb-1">2023</p>
              <p className="text-xs text-gray-400">Founded In</p>
            </div>
          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-gray-900/30 border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-cyan-400">Us?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're not just selling themes — we're building long-term partnerships with our customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 ${value.bg} ${value.color} rounded-2xl flex items-center justify-center text-2xl mb-5 border ${value.border}`}>
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-3xl p-8">
            <div className="w-14 h-14 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center text-2xl mb-5">
              <FaRocket />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed">
              To empower developers, agencies, and businesses of all sizes with premium quality 
              website themes that are affordable, easy to use, and built with world-class standards.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-3xl p-8">
            <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center text-2xl mb-5">
              <FaGlobeAsia />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed">
              To become the most trusted name in the theme marketplace from Bangladesh — 
              known globally for quality, innovation, and exceptional customer support.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Something <span className="text-cyan-400">Amazing?</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Browse our collection of premium themes and launch your next project in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/#themes" className="bg-cyan-600 hover:bg-cyan-700 px-8 py-3 rounded-xl font-bold transition shadow-[0_0_20px_rgba(8,145,178,0.4)] flex items-center justify-center gap-2">
              Browse Themes <FaArrowRight />
            </Link>
            <a href="https://wa.me/8801758496622" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
              <FaWhatsapp className="text-green-400" /> Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}