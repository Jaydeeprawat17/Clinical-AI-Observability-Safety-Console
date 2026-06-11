/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#080a10",
        bgSecondary: "#0f1322",
        bgCard: "rgba(17, 23, 41, 0.6)",
        accentCyan: "#06b6d4",
        accentEmerald: "#10b981",
        accentCrimson: "#f43f5e",
        accentAmber: "#f59e0b",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
