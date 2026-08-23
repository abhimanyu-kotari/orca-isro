/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#030b17',
          900: '#07162c',
          800: '#0d264a',
          700: '#13396d',
          600: '#1b4f93',
          500: '#256abf',
          400: '#3888e9',
          300: '#68a7f2',
          200: '#a3caf9',
          100: '#dbeafe'
        },
        tactical: {
          cyan: '#00f0ff',
          emerald: '#10b981',
          amber: '#f59e0b',
          crimson: '#ef4444'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-spin': 'spin 6s linear infinite'
      }
    },
  },
  plugins: [],
}
