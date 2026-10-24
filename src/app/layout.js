import { Inter } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "@/providers/AlertProvider";
import { StoreProvider } from "@/providers/StoreProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { StoreHydrator } from "@/providers/StoreHydrator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "ThemesStore | Premium Themes Marketplace",
  description: "Buy premium Next.js, WordPress, and HTML themes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* 🚨 overflow-x-hidden যোগ করা হয়েছে */}
      <body className={`${inter.variable} font-sans antialiased bg-brand-dark text-brand-light flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden`}>
        <AlertProvider>
          <SessionProvider>
            <StoreProvider>
              <StoreHydrator />
              <Navbar />
              <main className="pt-20 flex-grow w-full overflow-x-hidden">
                {children}
              </main>
              <Footer />
            </StoreProvider>
          </SessionProvider>
        </AlertProvider>
      </body>
    </html>
  );
}