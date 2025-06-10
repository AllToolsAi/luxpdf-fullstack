/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',      // Your pages folder
    './components/**/*.{js,ts,jsx,tsx}', // Your components folder
    './app/**/*.{js,ts,jsx,tsx}',        // Your app folder (if used)
  ],
  darkMode: 'class', // Enables dark mode with a CSS class 'dark'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#e63946',
        'primary-dark': '#d62839',
        background: '#f9fafb',
        heading: '#1f2937',
        muted: '#6b7280',
        white: '#ffffff',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
      },
    },
  },
  plugins: [],
};
