/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito Sans"', 'sans-serif'],
      },
      colors: {
        primary: '#4361ee',
        secondary: '#f8f9fa',
        dark: '#212529',
        'soft-blue': '#edf2fb',
        'muted-blue': '#ccdbfd'
      }
    },
  },
  plugins: [],
}
