/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        velour: {
          50:  "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7B3FA0",
          800: "#5b21b6",
          900: "#3b0764",
          950: "#1a0533",
        },
        accent: "#C084E8",
        muted:  "#A78BC0",
      },
      fontFamily: {
        serif:   ["'Cormorant Garamond'", "Georgia", "serif"],
        display: ["'Cormorant'", "serif"],
        sans:    ["'DM Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        velour:    "0 4px 24px -4px rgba(123,63,160,0.3)",
        "velour-lg": "0 8px 48px -8px rgba(123,63,160,0.4)",
      },
    },
  },
  plugins: [],
};
