"use client";
import { 
  FaCode, FaReact, FaNodeJs, FaFigma, FaWordpress, 
  FaHtml5, FaCss3Alt, FaJs, FaDatabase, FaGithub, 
  FaTerminal, FaServer, FaPaintBrush, FaLayerGroup 
} from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiSupabase, SiVercel } from "react-icons/si";
import { motion } from "framer-motion";

export default function ToolsSection({ technologies }) {
  if (!technologies || technologies.length === 0) {
    return null;
  }

  // টুলের নাম অনুযায়ী আইকন ম্যাপিং
  const getIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("next")) return <SiNextdotjs />;
    if (lowerName.includes("react")) return <FaReact />;
    if (lowerName.includes("tailwind")) return <SiTailwindcss />;
    if (lowerName.includes("typescript")) return <SiTypescript />;
    if (lowerName.includes("javascript") || lowerName.includes("js")) return <FaJs />;
    if (lowerName.includes("supabase")) return <SiSupabase />;
    if (lowerName.includes("node")) return <FaNodeJs />;
    if (lowerName.includes("figma")) return <FaFigma />;
    if (lowerName.includes("wordpress")) return <FaWordpress />;
    if (lowerName.includes("html")) return <FaHtml5 />;
    if (lowerName.includes("css")) return <FaCss3Alt />;
    if (lowerName.includes("database") || lowerName.includes("sql")) return <FaDatabase />;
    if (lowerName.includes("git") || lowerName.includes("github")) return <FaGithub />;
    if (lowerName.includes("vs code") || lowerName.includes("vscode")) return <FaTerminal />;
    if (lowerName.includes("vercel")) return <SiVercel />;
    if (lowerName.includes("photoshop") || lowerName.includes("illustrator")) return <FaPaintBrush />;
    return <FaCode />; // ডিফল্ট আইকন
  };

  // টুলের নাম অনুযায়ী রঙ নির্ধারণ
  const getColor = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("next")) return "text-white";
    if (lowerName.includes("react")) return "text-cyan-400";
    if (lowerName.includes("tailwind")) return "text-sky-400";
    if (lowerName.includes("typescript")) return "text-blue-500";
    if (lowerName.includes("javascript") || lowerName.includes("js")) return "text-yellow-400";
    if (lowerName.includes("supabase")) return "text-emerald-400";
    if (lowerName.includes("node")) return "text-green-500";
    if (lowerName.includes("figma")) return "text-pink-400";
    if (lowerName.includes("wordpress")) return "text-blue-400";
    if (lowerName.includes("html")) return "text-orange-500";
    if (lowerName.includes("css")) return "text-blue-500";
    if (lowerName.includes("github")) return "text-white";
    if (lowerName.includes("vercel")) return "text-white";
    return "text-brand-gold";
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 md:p-10 mb-8">
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
        <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center text-2xl">
          <FaLayerGroup />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Tools & Software Used</h2>
          <p className="text-brand-muted text-sm">Technologies and tools used to craft this theme</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {technologies.map((tech, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 bg-[#09090B] border border-white/10 px-5 py-3 rounded-2xl hover:border-brand-gold/50 hover:bg-white/5 transition-all group"
          >
            <div className={`text-2xl ${getColor(tech)} group-hover:scale-110 transition-transform`}>
              {getIcon(tech)}
            </div>
            <span className="text-white font-medium text-sm">{tech}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}