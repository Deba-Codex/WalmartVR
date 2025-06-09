/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0071ce', // Walmart blue
          600: '#005ba0',
          700: '#004577',
          800: '#003460',
          900: '#002347',
        },
        accent: {
          50: '#fffdf0',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#ffc220', // Walmart gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'coin-flip': 'coinFlip 1s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        coinFlip: {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '50%': { transform: 'rotateY(180deg) scale(1.2)' },
          '100%': { transform: 'rotateY(360deg) scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};