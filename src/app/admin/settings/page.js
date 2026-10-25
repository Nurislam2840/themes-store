"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaSpinner, FaCog } from "react-icons/fa";

export default function AdminSettingsPage() {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    email: "", phone: "", location: "", facebook: "", twitter: "", instagram: "", linkedin: "", github: "",
    default_theme: "dark" // নতুন ফিল্ড
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (data) setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => setSettings({ ...settings, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({
      email: settings.email, phone: settings.phone, location: settings.location,
      facebook: settings.facebook, twitter: settings.twitter, instagram: settings.instagram,
      linkedin: settings.linkedin, github: settings.github,
      default_theme: settings.default_theme // থিম আপডেট
    }).eq("id", 1);

    if (error) showAlert("Failed to save settings", "error");
    else showAlert("Settings saved successfully!", "success");
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center"><FaSpinner className="text-4xl text-brand-gold animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-4 text-sm font-medium">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
            <FaCog className="text-brand-gold" /> Site Settings
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          
          {/* ডিফল্ট থিম সিলেক্টর */}
          <div className="mb-8 bg-[#09090B] border border-white/10 rounded-xl p-4">
            <label className="block text-sm font-bold text-white mb-2">Default Theme (For Guests)</label>
            <p className="text-xs text-brand-muted mb-3">This theme will be applied to all new visitors who are not logged in.</p>
            <select name="default_theme" value={settings.default_theme || "dark"} onChange={handleChange} className="w-full bg-[#121214] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold">
              <option value="dark">Dark Mode (Premium Black & Gold)</option>
              <option value="light">Light Mode (Clean White)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-xs text-brand-muted mb-2">Contact Email</label>
              <input type="email" name="email" value={settings.email || ""} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-2">Phone / WhatsApp</label>
              <input type="text" name="phone" value={settings.phone || ""} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-brand-muted mb-2">Location Address</label>
              <input type="text" name="location" value={settings.location || ""} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-4 mt-8 border-t border-white/5 pt-6">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div><label className="block text-xs text-brand-muted mb-2">Facebook URL</label><input type="text" name="facebook" value={settings.facebook || ""} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
            <div><label className="block text-xs text-brand-muted mb-2">Twitter / X URL</label><input type="text" name="twitter" value={settings.twitter || ""} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
            <div><label className="block text-xs text-brand-muted mb-2">Instagram URL</label><input type="text" name="instagram" value={settings.instagram || ""} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
            <div><label className="block text-xs text-brand-muted mb-2">LinkedIn URL</label><input type="text" name="linkedin" value={settings.linkedin || ""} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
          </div>

          <button type="submit" disabled={saving} className="bg-brand-gold hover:bg-brand-gold-hover text-black font-bold px-8 py-3.5 rounded-xl transition-all flex items-center gap-2 text-sm">
            <FaSave /> {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}