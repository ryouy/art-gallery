import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#151514",
        ink: "#f2efe7",
        muted: "#9a9588",
        line: "#34322e",
        steel: "#c9c3b5",
        bone: "#1d1c1a"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        quiet: "0 24px 80px rgba(0, 0, 0, 0.32)"
      }
    }
  },
  plugins: []
};

export default config;
