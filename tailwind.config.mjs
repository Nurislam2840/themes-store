/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#09090B",       // Deep Charcoal (Background)
          card: "#18181B",       // Card Background
          border: "#27272A",     // Border Color
          gold: "#F59E0B",       // Premium Royal Gold
          "gold-hover": "#D97706", 
          light: "#FAFAFA",      // Text Light
          muted: "#A1A1AA",      // Text Muted
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        'gold-gradient': "linear-gradient(to right, #F59E0B, #FCD34D)",
      }
    },
  },
  plugins: [],
};
