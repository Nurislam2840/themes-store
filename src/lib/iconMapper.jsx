import { 
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs, FaDatabase, 
  FaWordpress, FaFigma, FaGithub, FaCode, FaServer, FaStripe 
} from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiSupabase, SiVercel } from "react-icons/si";

export function getTechIcon(techName) {
  const name = techName.toLowerCase();
  
  if (name.includes("next")) return <SiNextdotjs />;
  if (name.includes("react")) return <FaReact />;
  if (name.includes("tailwind")) return <SiTailwindcss />;
  if (name.includes("typescript") || name.includes("ts")) return <SiTypescript />;
  if (name.includes("javascript") || name.includes("js")) return <FaJs />;
  if (name.includes("supabase")) return <SiSupabase />;
  if (name.includes("node")) return <FaNodeJs />;
  if (name.includes("wordpress")) return <FaWordpress />;
  if (name.includes("figma")) return <FaFigma />;
  if (name.includes("html")) return <FaHtml5 />;
  if (name.includes("css")) return <FaCss3Alt />;
  if (name.includes("stripe")) return <FaStripe />;
  if (name.includes("vercel")) return <SiVercel />;
  if (name.includes("sql") || name.includes("database")) return <FaDatabase />;
  if (name.includes("github") || name.includes("git")) return <FaGithub />;
  if (name.includes("server")) return <FaServer />;
  
  return <FaCode />; // ডিফল্ট আইকন
}

export function getTechColor(techName) {
  const name = techName.toLowerCase();
  
  if (name.includes("next")) return "text-white";
  if (name.includes("react")) return "text-cyan-400";
  if (name.includes("tailwind")) return "text-sky-400";
  if (name.includes("typescript")) return "text-blue-500";
  if (name.includes("javascript") || name.includes("js")) return "text-yellow-400";
  if (name.includes("supabase")) return "text-emerald-400";
  if (name.includes("node")) return "text-green-500";
  if (name.includes("wordpress")) return "text-blue-400";
  if (name.includes("figma")) return "text-pink-400";
  if (name.includes("html")) return "text-orange-500";
  if (name.includes("css")) return "text-blue-500";
  if (name.includes("stripe")) return "text-indigo-400";
  
  return "text-brand-gold"; // ডিফল্ট রঙ
}