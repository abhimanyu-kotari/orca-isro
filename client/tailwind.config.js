/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marine: {
          950: '#020d1a', // Abyssal Trench
          900: '#051b30', // Deep Midnight Ocean
          850: '#082642', // Deep Reef
          800: '#0b3254', // Coastal Blue
          700: '#104975', // Twilight Sea
          600: '#17669e', // Caribbean Wave
          500: '#1d8acb', // Tropical Ocean
          400: '#38aef0', // Sky Ocean
          300: '#67cbf7', // Seafoam Shallow
          200: '#a5e4fc', // Wave Crest
          100: '#e0f2fe'
        },
        biolum: {
          teal: '#00f5c4', // Bioluminescent Plankton Teal
          aqua: '#00d2ff', // Coral Lagoon Aqua
          emerald: '#10e797', // Seaweed Emerald
          coral: '#ff6b6b', // Coral Reef Pink
          amber: '#ffb300'  // Sunken Amber
        }
      },
      backgroundImage: {
        'ocean-gradient': 'radial-gradient(ellipse at top, #082642 0%, #051b30 50%, #020d1a 100%)',
        'coral-glow': 'linear-gradient(135deg, rgba(0,245,196,0.15) 0%, rgba(0,210,255,0.05) 100%)',
      },
      animation: {
        'wave-gentle': 'wave 8s ease-in-out infinite',
        'bubble-float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}
