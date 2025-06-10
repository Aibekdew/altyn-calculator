// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // если нужна поддержка тёмной темы
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
 theme: {
    extend: {
      keyframes: {
        draw: { to: { strokeDashoffset: '0' } },
        pulse: {
          '0%,100%': { filter: 'drop-shadow(0 0 4px #21cdff) drop-shadow(0 0 12px #21cdff)' },
          '50%':     { filter: 'drop-shadow(0 0 8px #21cdff) drop-shadow(0 0 24px #21cdff)' },
        },
      },
      animation: {
        draw: 'draw 4s ease-out forwards',
        pulse: 'pulse 6s linear infinite',
      },
    },
  },
  plugins: [],
};
