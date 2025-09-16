/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        scroll: 'scroll 12s linear infinite',
        gradientMove: 'gradientMove 10s ease infinite', // New animation added
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        gradientMove: { // New keyframes for gradient movement
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
