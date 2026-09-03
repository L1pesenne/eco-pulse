import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1717",
        moss: "#b9ff76",
        aqua: "#7de7d4",
        fog: "#dce9e2"
      },
      fontFamily: {
        sans: ["var(--font-sora)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-space-mono)", "ui-monospace", "SFMono-Regular"]
      },
      boxShadow: {
        glow: "0 0 35px rgba(185, 255, 118, 0.18)",
        panel: "0 20px 55px rgba(0, 0, 0, 0.24)"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -8px, 0)" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "20%": { opacity: "0.8" },
          "100%": { transform: "translateY(520%)", opacity: "0" }
        }
      },
      animation: {
        drift: "drift 5s ease-in-out infinite",
        scan: "scan 5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
