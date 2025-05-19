/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-delay-200': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 0.2s infinite',
        'pulse-delay-400': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 0.4s infinite',
      },
    },
  },
  plugins: [require('daisyui')],
}
