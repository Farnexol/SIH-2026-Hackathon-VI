/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9ddfd',
          300: '#7cc2fb',
          400: '#36a3f7',
          500: '#0c87eb',
          600: '#006ac9',
          700: '#0054a3',
          800: '#044786',
          900: '#093b6f',
          950: '#06254a',
        },
        navy: {
          800: '#111d33',
          900: '#0b1322',
          950: '#070b14',
        },
        competency: {
          strong: '#059669',
          'strong-light': '#ecfdf5',
          moderate: '#d97706',
          'moderate-light': '#fffbeb',
          gap: '#e11d48',
          'gap-light': '#fff1f2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
