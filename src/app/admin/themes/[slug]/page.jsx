import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ReviewSection from '@/components/ui/ReviewSection';
import { themesData } from '@/data/themesData';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  FaCheckCircle, FaExternalLinkAlt, FaShoppingCart, FaArrowLeft, 
  FaCode, FaBoxOpen, FaCog, FaLayerGroup, FaSync, FaFileAlt,
  FaReact, FaWordpress, FaHtml5, FaCss3Alt, FaFigma, FaNodeJs, 
  FaDatabase, FaStripe, FaBootstrap, FaMobileAlt, FaSearch, FaMoon, FaRocket
} from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiFramer, SiTypescript, SiJavascript, SiSupabase, SiMongodb, SiVercel } from 'react-icons/si';

// টেকনোলজির নাম থেকে আইকন বের করার হেল্পার
const getTechIcon = (tech) => {
  const t = tech.toLowerCase();
  if (t.includes('next')) return <SiNextdotjs />;
  if (t.includes('react')) return <FaReact />;
  if (t.includes('tailwind')) return <SiTailwindcss />;
  if (t.includes('framer')) return <SiFramer />;
  if (t.includes('typescript')) return <SiTypescript />;
  if (t.includes('javascript')) return <SiJavascript />;
  if (t.includes('wordpress')) return <FaWordpress />;
  if (t.includes('woocommerce')) return <FaWordpress />;
  if (t.includes('html')) return <FaHtml5 />;
  if (t.includes('css')) return <FaCss3Alt />;
  if (t.includes('bootstrap')) return <FaBootstrap />;
  if (t.includes('supabase')) return <SiSupabase />;
  if (t.includes('mongo')) return <SiMongodb />;
  if (t.includes('stripe')) return <FaStripe />;
  if (t.includes('figma')) return <FaFigma />;
  if (t.includes('node')) return <FaNodeJs />;
  if (t.includes('vercel')) return <SiVercel />;
  return <FaCode />;
};

async function getTheme(slug) {
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  return data;
}

export default async function ThemeDetailsPage({ params }) {
  const resolvedParams = await params;
  const theme = await getTheme(resolvedParams.slug);

  if (!theme) {
    return (
      <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
        <Navbar />
        <div className="pt-32 pb-20 text-center flex-grow">
          <h1 className="text-3xl font-bold text-cyan-400 mb-4">Theme not found!</h1>
          <Link href="/" className="text-gray-400 hover:text-cyan-400">← Back to Store</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const technologies = theme.technologies || [];
  const includedFiles = theme.included_files || [];
  const requirements = theme.requirements || [];
  const features = theme.features || [];

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans selection:bg-cyan-500 flex flex-col">
      <Navbar />

      <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto w-full flex-grow">

        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-8">
          <FaArrowLeft /> Back to Store
        </Link>

        {/* ============ HERO SECTION ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="relative">
            <img 
              src={theme.image} 
              alt={theme.title} 
              className="w-full h-72 md:h-[420px] object-cover rounded-3xl border-4 border-gray-800 shadow-2xl"
            />
            {/* Version Badge */}
            <div className="absolute top-4 left-4 bg-gray-950/90 backdrop-blur-sm border border-gray-700 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <FaRocket className="text-cyan-400" /> v{theme.version || '1.0.0'}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-2">{theme.category}</p>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{theme.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-white">${theme.price}</span>
              <span className="bg-green-500/10 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
                <FaCheckCircle /> Lifetime Access
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed mb-6">{theme.description}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                <FaFileAlt className="text-cyan-400 mx-auto mb-1 text-sm" />
                <p className="text-lg font-bold text-white">{theme.pages_included || 5}</p>
                <p className="text-[10px] text-gray-500">Pages</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                <FaLayerGroup className="text-purple-400 mx-auto mb-1 text-sm" />
                <p className="text-lg font-bold text-white">{features.length}</p>
                <p className="text-[10px] text-gray-500">Features</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                <FaSync className="text-green-400 mx-auto mb-1 text-sm" />
                <p className="text-lg font-bold text-white">{theme.last_updated ? new Date(theme.last_updated).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</p>
                <p className="text-[10px] text-gray-500">Updated</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(theme.tags || []).map((tag, i) => (
                <span key={i} className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-lg border border-gray-700">{tag}</span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/checkout" className="flex-1 bg-cyan-600 text-center py-3.5 rounded-xl font-bold hover:bg-cyan-700 transition shadow-[0_0_20px_rgba(8,145,178,0.4)] flex items-center justify-center gap-2">
                <FaShoppingCart /> Buy Now
              </Link>
              <a href={theme.demo_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-800 text-center py-3.5 rounded-xl font-bold hover:bg-gray-700 transition flex items-center justify-center gap-2">
                <FaExternalLinkAlt /> Live Preview
              </a>
            </div>
          </div>
        </div>

        {/* ============ TECH STACK SECTION ============ */}
        {technologies.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center text-2xl">
                <FaCode />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Technology Stack</h2>
                <p className="text-gray-500 text-xs">Built with modern, industry-standard technologies</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {technologies.map((tech, i) => (
                <div key={i} className="bg-gray-950 border border-gray-800 hover:border-cyan-500/50 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl text-cyan-400">{getTechIcon(tech)}</div>
                  <p className="text-xs font-semibold text-gray-300 text-center">{tech}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============ FEATURES SECTION ============ */}
        {features.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center text-2xl">
                <FaLayerGroup />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Key Features</h2>
                <p className="text-gray-500 text-xs">Everything included in this premium theme</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-950 border border-gray-800 p-4 rounded-xl hover:border-purple-500/40 transition">
                  <FaCheckCircle className="text-purple-400 text-lg flex-shrink-0" />
                  <span className="text-gray-300 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============ WHAT'S INCLUDED + REQUIREMENTS ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* What's Included */}
          {includedFiles.length > 0 && (
            <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center text-xl">
                  <FaBoxOpen />
                </div>
                <h3 className="text-xl font-bold">What's Included</h3>
              </div>
              <ul className="space-y-3">
                {includedFiles.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <FaCheckCircle className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {requirements.length > 0 && (
            <div className="bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/20 rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center text-xl">
                  <FaCog />
                </div>
                <h3 className="text-xl font-bold">Requirements</h3>
              </div>
              <ul className="space-y-3">
                {requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <FaCog className="text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* ============ EXTRA INFO CARDS ============ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <FaMobileAlt className="text-cyan-400 text-2xl mx-auto mb-2" />
            <p className="text-sm font-bold text-white">Fully Responsive</p>
            <p className="text-xs text-gray-500 mt-1">Mobile & Tablet Ready</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <FaSearch className="text-green-400 text-2xl mx-auto mb-2" />
            <p className="text-sm font-bold text-white">SEO Optimized</p>
            <p className="text-xs text-gray-500 mt-1">Rank Higher on Google</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <FaMoon className="text-purple-400 text-2xl mx-auto mb-2" />
            <p className="text-sm font-bold text-white">Dark Mode Ready</p>
            <p className="text-xs text-gray-500 mt-1">Elegant Dark UI</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <FaRocket className="text-orange-400 text-2xl mx-auto mb-2" />
            <p className="text-sm font-bold text-white">Blazing Fast</p>
            <p className="text-xs text-gray-500 mt-1">Optimized Performance</p>
          </div>
        </div>

        {/* ============ REVIEW SECTION ============ */}
        <ReviewSection themeSlug={theme.slug} />

      </div>

      <Footer />
    </main>
  );
}