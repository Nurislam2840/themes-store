import "./globals.css";
import { StoreProvider } from '@/context/StoreContext';
import { AlertProvider } from '@/context/AlertContext';

export const metadata = {
  title: "Themes Store | Premium Next.js, WordPress & HTML Themes",
  description: "Buy premium Next.js, WordPress, and HTML themes. Beautifully crafted, fully responsive, and highly optimized for developers and businesses worldwide.",
  keywords: ["Themes", "Next.js Themes", "WordPress Themes", "HTML Templates", "React Themes", "Premium Themes"],
  authors: [{ name: "Themes Store" }],
  openGraph: {
    title: "Themes Store",
    description: "Premium themes for your next project.",
    siteName: "Themes Store",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AlertProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </AlertProvider>
      </body>
    </html>
  );
}