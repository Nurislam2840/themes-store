"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function SessionProvider({ children }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const ensureSession = async () => {
      try {
        // ১. আগে চেক করি সেশন আছে কিনা
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (!session) {
          // ২. সেশন না থাকলে Anonymous Login
          const { error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error("Anonymous login failed:", error.message);
          }
        }
      } catch (err) {
        console.error("Session error:", err);
      } finally {
        if (mounted) setIsReady(true);
      }
    };

    ensureSession();
    
    return () => { mounted = false; };
  }, []);

  // সেশন তৈরি না হওয়া পর্যন্ত চিলড্রেন রেন্ডার হবে না (যাতে ডেটা লোডে সমস্যা না হয়)
  if (!isReady) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
}