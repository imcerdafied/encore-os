import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#FBF7EF",
          subtle: "#F2EADC",
        },
        surface: "#FFFAF2",
        text: {
          DEFAULT: "#15130F",
          secondary: "#6F6A60",
        },
        accent: {
          DEFAULT: "#C65A32",
          dark: "#9F3F22",
        },
        teal: "#0F8B8D",
        gold: "#C9A24F",
        border: "#DED2BD",
        night: "#10141F",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"Courier New"', "Courier", "monospace"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(21, 19, 15, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
