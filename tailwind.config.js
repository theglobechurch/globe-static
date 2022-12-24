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
    },
    extend: {
      typography: ({ theme }) => ({
        globeBlue: {
          css: {
            '--tw-prose-body': theme('colors.blue.DEFAULT'),
            '--tw-prose-headings': theme('colors.blue.DEFAULT'),
            '--tw-prose-lead': theme('colors.blue.DEFAULT'),
            '--tw-prose-links': theme('colors.orange.DEFAULT'),
            '--tw-prose-bold': theme('colors.blue.DEFAULT'),
            '--tw-prose-counters': theme('colors.blue.DEFAULT'),
            '--tw-prose-bullets': theme('colors.blue.DEFAULT'),
            '--tw-prose-hr': theme('colors.blue.DEFAULT'),
            '--tw-prose-quotes': theme('colors.blue.DEFAULT'),
            '--tw-prose-quote-borders': theme('colors.blue.DEFAULT'),
            '--tw-prose-captions': theme('colors.blue.DEFAULT'),
            '--tw-prose-code': theme('colors.blue.DEFAULT'),
            '--tw-prose-pre-code': theme('colors.blue.DEFAULT'),
            '--tw-prose-pre-bg': theme('colors.blue.DEFAULT'),
            '--tw-prose-th-borders': theme('colors.blue.DEFAULT'),
            '--tw-prose-td-borders': theme('colors.blue.DEFAULT'),
          }
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
