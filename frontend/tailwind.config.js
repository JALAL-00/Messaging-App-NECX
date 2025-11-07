/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1A1F2E', // Main background
        'secondary': '#242B3D', // Component backgrounds (input, header)
        'accent': {
          'green': '#4ADE80', // Main accent color for buttons and 'me' messages
          'light-green': '#22C55E' // A darker green for hover states
        },
        'text': {
          'primary': '#FFFFFF',
          'secondary': '#9CA3AF' // Lighter text for timestamps, placeholders
        },
        'border': '#3A4759',
      }
    },
  },
  plugins: [],
}