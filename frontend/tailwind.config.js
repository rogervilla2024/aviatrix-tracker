/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aviation Blue Sky Theme
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Primary sky blue
          600: '#0284c7',  // Aviation blue
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        aviation: {
          sky: '#0ea5e9',
          blue: '#0284c7',
          dark: '#0c4a6e',
          silver: '#e2e8f0',
          white: '#f8fafc',
        }
      },
      backgroundImage: {
        'gradient-aviation': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0c4a6e 100%)',
        'gradient-sky': 'linear-gradient(180deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)',
        'gradient-clouds': 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
      },
      animation: {
        'fly': 'fly 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'cloud-drift': 'cloudDrift 20s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'takeoff': 'takeoff 0.5s ease-out forwards',
      },
      keyframes: {
        fly: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        cloudDrift: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.8)' },
        },
        takeoff: {
          '0%': { transform: 'translateX(0) translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(50px) translateY(-30px) rotate(15deg)', opacity: '0.8' },
        },
      },
      boxShadow: {
        'aviation': '0 4px 20px rgba(14, 165, 233, 0.3)',
        'aviation-lg': '0 10px 40px rgba(14, 165, 233, 0.4)',
      }
    },
  },
  plugins: [],
}
