// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "@/providers/AlertProvider";
import { StoreProvider } from "@/providers/StoreProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { StoreHydrator } from "@/providers/StoreHydrator";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "ThemesStore | Premium Themes Marketplace",
  description: "Buy premium Next.js, WordPress, and HTML themes.",
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();

  // ডিফল্ট থিম লোড
  const { data: settings } = await supabase
    .from("site_settings")
    .select("default_theme")
    .eq("id", 1)
    .single();
  let activeTheme = settings?.default_theme || "dark";

  // ইউজারের থিম লোড
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("theme")
      .eq("id", user.id)
      .single();
    if (profile?.theme) activeTheme = profile.theme;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-[#FAFAFA] dark:bg-[#09090B] text-gray-900 dark:text-[#FAFAFA] flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme={activeTheme}
          enableSystem={false}
          disableTransitionOnChange
        >
          <AlertProvider>
            <SessionProvider>
              <StoreProvider>
                <StoreHydrator />
                <ConditionalNavbar initialTheme={activeTheme} />
                <main className="pt-20 flex-grow w-full overflow-x-hidden">
                  {children}
                </main>
                <Footer />
              </StoreProvider>
            </SessionProvider>
          </AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}