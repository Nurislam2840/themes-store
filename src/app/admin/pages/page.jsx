"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaSpinner, FaFileAlt } from "react-icons/fa";

export default function AdminPagesPage() {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState("privacy");
  const [pagesData, setPagesData] = useState({ privacy: "", terms: "" });

  useEffect(() => {
    const fetchPages = async () => {
      const { data } = await supabase.from("pages").select("*");
      if (data) {
        const pages = { privacy: "", terms: "" };
        data.forEach(page => { pages[page.slug] = page.content; });
        setPagesData(pages);
      }
      setLoading(false);
    };
    fetchPages();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("pages")
      .update({ content: pagesData[selectedPage], updated_at: new Date() })
      .eq("slug", selectedPage);

    if (error) showAlert("Failed to save content", "error");
    else showAlert("Page content saved successfully!", "success");
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center"><FaSpinner className="text-4xl text-brand-gold animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-4 text-sm font-medium">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
            <FaFileAlt className="text-brand-gold" /> Manage Pages
          </h1>
          <p className="text-brand-muted text-sm mt-2">Edit your legal pages content.</p>
        </div>

        <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex gap-4 mb-6 border-b border-white/5 pb-4">
            <button 
              onClick={() => setSelectedPage("privacy")}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${selectedPage === "privacy" ? "bg-brand-gold text-black" : "bg-white/5 text-brand-muted hover:text-white"}`}
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setSelectedPage("terms")}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${selectedPage === "terms" ? "bg-brand-gold text-black" : "bg-white/5 text-brand-muted hover:text-white"}`}
            >
              Terms & Conditions
            </button>
          </div>

          <textarea
            value={pagesData[selectedPage]}
            onChange={(e) => setPagesData({ ...pagesData, [selectedPage]: e.target.value })}
            rows="15"
            className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-4 text-white text-sm outline-none focus:border-brand-gold leading-relaxed font-mono"
            placeholder="Enter page content here..."
          ></textarea>

          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="mt-6 bg-brand-gold hover:bg-brand-gold-hover text-black font-bold px-8 py-3.5 rounded-xl transition-all flex items-center gap-2 text-sm"
          >
            <FaSave /> {saving ? "Saving..." : "Save Content"}
          </button>
        </div>
      </div>
    </div>
  );
}