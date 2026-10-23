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
  // বেসিক SEO
  title: {
    default: "ThemesStore | Premium Themes Marketplace",
    template: "%s | ThemesStore",
  },
  description: "Buy premium Next.js, WordPress, and HTML themes. Beautifully crafted, fully dynamic, and highly optimized for modern businesses.",
  keywords: [
    "premium themes", "nextjs themes", "wordpress themes", 
    "react templates", "HTML templates", "ThemesStore", 
    "premium website templates", "saas themes"
  ],
  authors: [{ name: "MD NUR ISLAM" }],
  creator: "MD NUR ISLAM",
  publisher: "ThemesStore",
  
  // সোশ্যাল শেয়ারের জন্য Open Graph (Facebook, LinkedIn)
  openGraph: {
    title: "ThemesStore | Premium Themes Marketplace",
    description: "Discover beautifully crafted, highly optimized premium themes for your next big project.",
    url: "https://yourdomain.com",
    siteName: "ThemesStore",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "ThemesStore Premium Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter কার্ড
  twitter: {
    card: "summary_large_image",
    title: "ThemesStore | Premium Themes Marketplace",
    description: "Discover beautifully crafted premium themes for your next project.",
    images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"],
    creator: "@themesstore",
  },

  // ফেভিকন (গোল্ডেন T আইকন - SVG দিয়ে তৈরি)
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%2309090B'/><text x='50' y='72' font-family='Arial,Helvetica,sans-serif' font-size='68' font-weight='900' text-anchor='middle' fill='%23F59E0B'>T</text></svg>",
    apple: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%2309090B'/><text x='50' y='72' font-family='Arial,Helvetica,sans-serif' font-size='68' font-weight='900' text-anchor='middle' fill='%23F59E0B'>T</text></svg>",
  },

  // রোবট নির্দেশনা
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-brand-dark text-brand-light flex flex-col min-h-screen`}>
        <AlertProvider>
          <SessionProvider>
            <StoreProvider>
              <StoreHydrator />
              <Navbar />
              <main className="pt-20 flex-grow">
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