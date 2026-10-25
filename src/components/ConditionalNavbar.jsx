"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar({ initialTheme }) {
  const pathname = usePathname();
  
  // অ্যাডমিন পেজে গেলে নেভবার দেখাবে না
  if (pathname.startsWith("/admin")) return null;
  
  return <Navbar initialTheme={initialTheme} />;
}