/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#181818',
        surface: '#232323',
        'surface-2': '#3A3A3A',
        "ph": "#7D7D7D",
        primary: {
          DEFAULT: '#4A90E2',
          hover: '#357ABD',
        },
        secondary: '#D9D9D9',
        'popup-bg': '#C0C0C0',
        'popup-title-bg': '#6C757D',
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