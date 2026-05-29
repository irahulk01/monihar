import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          pink: {
            50: "#FFF5F6", // Ultra soft rosewater blushing cream
            100: "#FDE2E4", // Soft blushing pink
            200: "#FBCFE8", // Romantic rose pastel
            300: "#F472B6", // Medium rose
            DEFAULT: "#FFF5F6",
          },
          gold: {
            DEFAULT: "#D4AF37", // Imperial bright gold
            muted: "#C5A059", // Elegant antique gold
            deep: "#AA7C11", // Warm burnished bronze
          },
          charcoal: {
            DEFAULT: "#2E2528", // Luxury warm off-black
            muted: "#6B5E62", // Muted slate charcoal
          }
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 4px 20px -2px rgba(212, 175, 55, 0.12), 0 2px 8px -1px rgba(212, 175, 55, 0.08)",
        card: "0 10px 30px -10px rgba(107, 94, 98, 0.08)",
      }
    },
  },
  plugins: [],
} satisfies Config;
