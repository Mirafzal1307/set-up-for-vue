/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: '#2E5BFF', // blue
        secondary: '#F1F1F3', // gray
        primaryLight: '#EDF1FD' // light
      }
    }
  },
  darkMode: 'class', // Enable dark mode and use 'class' to toggle it
  plugins: []
}
