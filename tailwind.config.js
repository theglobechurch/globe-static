/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'black': '#12131a',
      'orange': {
        DEFAULT: '#d06348'
      },
      'blue': {
        DEFAULT: '#282938'
      },
      'gold': {
        DEFAULT: '#c6ae40'
      },
      'green': {
        DEFAULT: '#83c3a5'
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
