/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        '110': '28rem', // Custom height value
        '144': '36rem', // Custom height value
        '192': '48rem', // Custom height value
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
