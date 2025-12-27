/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./state/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '350px',
      },
      colors: {
        'expansion': {
          'cyan': '#06b6d4',
          'tan': '#d2b48c',
          'mediumPurple': '#9370DB',
          'gamblingGreen': '#047857',
          'steelBlue': '#4682B4',
          'darkSlateBlue': '#483D8B',
          'deepBrown': '#231709',
          'rebeccaPurple': '#663399',
          'cordovan': '#893f45',
          'darkOliveGreen': '#556b2f',
          'teal': '#0d9488',
        },
        'firefly': {
          'red': '#7f1d1d',
          'red-light': '#991b1b',
          'red-dark': '#450a0a',
          'gold': '#d4af37',
          'brown': '#78350f',
          'saddleBrown': '#8B4513',
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
        },
        kenBurns: {
          '0%': { transform: 'scale(1.05) translate(1%, -1%)' },
          '100%': { transform: 'scale(1) translate(0, 0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'ken-burns': 'kenBurns 60s ease-out infinite alternate',
      },
      backgroundSize: {
        'zoom-slice': '257.14% auto', // 900px image / 350px slice
        'full-width': '100% auto',
      },
    },
  },
  plugins: [],
}