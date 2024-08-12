/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",  // Incluye todos los archivos JSX/TSX en screens
    "./navigation/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}

