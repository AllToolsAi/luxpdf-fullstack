// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // Include this if using app directory (Next.js 13+)
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],   // Default utility: font-sans
        inter: ['Inter', 'sans-serif'],  // Optional custom alias
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
