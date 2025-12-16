/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'firefly': {
          'red': '#7f1d1d',
          'red-light': '#991b1b',
          'red-dark': '#450a0a',
          'gold': '#d4af37',
          'brown': '#78350f',
          'leather': {
            'DEFAULT': '#d97706',
            'dark': '#b45309',
          },
          'parchment': {
            'bg': '#faf8ef',
            'text': '#292524',
            'border': '#d6cbb0',
            'subtle': '#fef3c7',
          },
          'stone': {
            'DEFAULT': '#a8a29e',
            'dark': '#57534e',
          }
        }
      },
      fontFamily: {
        western: ['CIND', 'serif'],
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      }
    },
  },
  plugins: [],
}
