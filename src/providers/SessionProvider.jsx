// src/providers/SessionProvider.jsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function SessionProvider({ children }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        // শুধু সেশন আছে কিনা চেক করি — অ্যানোনিমাস লগইন আর নেই
        await supabase.auth.getSession();
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        if (mounted) setIsReady(true);
      }
    };

    checkSession();

    return () => { mounted = false; };
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
}