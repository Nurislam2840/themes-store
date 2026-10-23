"use client";
import Link from "next/link";
import { FaArrowLeft, FaFileContract, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaCopyright, FaGavel } from "react-icons/fa";
import { motion } from "framer-motion";

export default function TermsPage() {
  const sections = [
    {
      icon: <FaCheckCircle />,
      title: "1. Acceptance of Terms",
      content: "By accessing or purchasing from ThemesStore, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services."
    },
    {
      icon: <FaCopyright />,
      title: "2. License & Usage Rights",
      content: "Upon purchase, you receive a non-exclusive, non-transferable license to use the theme for one (1) project. You may not resell, redistribute, or sublicense the theme as-is. Bundle and Lifetime licenses grant extended commercial usage as specified at purchase."
    },
    {
      icon: <FaTimesCircle />,
      title: "3. Prohibited Actions",
      content: "You may not: reverse-engineer, decompile, or modify the original theme for resale; redistribute files as free downloads; claim authorship of the theme; or use themes for illegal activities."
    },
    {
      icon: <FaMoneyBillWave />,
      title: "4. Payments & Refunds",
      content: "All payments are processed securely through SSLCommerz. Due to the digital nature of our products, all sales are final. Refunds are only issued if the product is fundamentally broken and we fail to fix it within 14 days."
    },
    {
      icon: <FaFileContract />,
      title: "5. Support & Updates",
      content: "Free lifetime updates are included with all purchased themes. Support is provided for bugs and technical issues. Custom modifications or third-party integrations are not covered unless specified."
    },
    {
      icon: <FaGavel />,
      title: "6. Limitation of Liability",
      content: "ThemesStore is not liable for any indirect, incidental, or consequential damages arising from the use of our themes. You are solely responsible for how you use the purchased products."
    },
    {
      icon: <FaCopyright />,
      title: "7. Intellectual Property",
      content: "All themes, images, code, and content on ThemesStore remain the intellectual property of MD NUR ISLAM. Unauthorized use may result in legal action."
    },
    {
      icon: <FaFileContract />,
      title: "8. Changes to Terms",
      content: "We reserve the right to modify these terms at any time. Continued use of the platform after changes means you accept the updated terms."
    },
  ];

  return (
    <main className="min-h-screen bg-[#09090B] relative overflow-hidden pt-32 pb-20 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-8 text-sm font-medium">
          <FaArrowLeft /> Back to Store
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium mb-6">
            <FaGavel /> Legal Agreement
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Terms & <span className="text-transparent bg-clip-text bg-gold-gradient">Conditions</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using ThemesStore. They govern your use of our services.
          </p>
          <p className="text-brand-muted/60 text-xs mt-4">Last Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-brand-gold/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl flex-shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
                  <p className="text-brand-muted leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-brand-gold/10 to-transparent border border-brand-gold/20 rounded-2xl p-6 text-center">
          <p className="text-brand-muted text-sm">
            Have questions about our terms? <Link href="/contact" className="text-brand-gold font-semibold hover:underline">Reach out to us</Link>
          </p>
        </div>
      </div>
    </main>
  );
}