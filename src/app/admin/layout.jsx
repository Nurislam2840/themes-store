"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // ১৫ মিনিট (সেকেন্ডে)

  useEffect(() => {
    let timer;

    const resetTimer = () => setTimeLeft(15 * 60); // ইউজার মুভ করলে রিসেট

    // ইভেন্ট লিসেনার (মাউস, কিবোর্ড, স্ক্রল)
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    // কাউন্টডাউন টাইমার
    timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // টাইম শেষ, লগআউট
          supabase.auth.signOut().then(() => {
            router.push("/admin/login");
            alert("Session expired. Please login again.");
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      clearInterval(timer);
    };
  }, [router]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative">
      {/* টাইমার ডিসপ্লে (উপরে ডানদিকে ফিক্সড) */}
      <div className="fixed bottom-6 right-6 z-[9999] bg-[#121214] border border-red-500/30 text-red-400 text-xs font-mono px-4 py-2 rounded-full shadow-lg">
        Auto Logout: {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      {children}
    </div>
  );
}