/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1F2E',
        secondary: '#242B3D',
        accent: {
          green: '#4ADE80',
          'light-green': '#22C55E'
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF'
        },
        border: '#3A4759'
      }
    }
  },
  plugins: []
};
