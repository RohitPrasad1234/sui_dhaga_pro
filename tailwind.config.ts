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
        primary: "#8b5e3c",
        secondary: "#d4af37",
        accent: "#cd7f32",
        background: "var(--background)",
        foreground: "var(--text)",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)"],
        sans: ["var(--font-inter)"],
      },
      animation: {
        "pulse-slow": "pulse 20s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
