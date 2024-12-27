/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "primary-200" : "#ffbf00",
        "primary-100" : "#ffc929",
        "secondary-200" : "#00b050",
        "secondary-100" : "#0b1a78",
        'tg-theme-bg': 'var(--tg-theme-bg-color)',
        'tg-theme-text': 'var(--tg-theme-text-color)',
        'tg-theme-button': 'var(--tg-theme-button-color)',
        'tg-theme-secondary-bg': 'var(--tg-theme-secondary-bg-color)',
      }
    },
  },
  plugins: [],
}

