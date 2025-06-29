/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#89A4E7',
        'primary-hover': '#7a95d9',
        'dark-bg': '#000000',
        'dark-sidebar': '#1A1A1A',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}