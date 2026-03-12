/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1976d2", light: "#e8f4fd", dark: "#0d47a1" },
        success: { DEFAULT: "#2e7d32", light: "#e8f5e9" },
        danger: { DEFAULT: "#c62828", light: "#ffebee" },
        purple: { DEFAULT: "#6a1b9a", light: "#f3e5f5" },
      },
    },
  },
  plugins: [],
};
