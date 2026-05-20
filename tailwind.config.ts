import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151922",
        paper: "#f7f8fb",
        market: {
          green: "#0f8f63",
          blue: "#2457d6",
          amber: "#d98c17",
          clay: "#be4f3a",
          mint: "#dff7ed"
        }
      },
      boxShadow: {
        soft: "0 24px 80px rgba(18, 24, 38, 0.10)",
        line: "0 0 0 1px rgba(21, 25, 34, 0.08)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
