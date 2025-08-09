/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#181818',
        surface: '#232323',
        primary: {
          DEFAULT: '#4A90E2',
          hover: '#357ABD',
        },
        secondary: '#6C757D',
        text: {
          primary: '#F1F1F1',
          secondary: '#C0C0C0',
        },
        border: '#3A3A3A',
        error: '#D9534F',
        success: '#5CB85C',
        warning: '#F0AD4E',
      },
    },
  },
  plugins: [],
}