/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0f1419",
          raised: "#1a2332",
          border: "#2a3544",
        },
        gpio: {
          high: "#22c55e",
          low: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        pin: "0 1px 2px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
        "pin-high": "0 0 12px rgba(34,197,94,0.35)",
        "pin-low": "0 0 12px rgba(239,68,68,0.25)",
      },
    },
  },
  plugins: [],
};
