// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
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
    },
  },
  plugins: [],
};
