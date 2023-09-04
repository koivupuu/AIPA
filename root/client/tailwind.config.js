/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '100': '#ebf5fa',
          '200': '#d1e8f2',
          '300': '#a6d3e9',
          '400': '#7abde0',
          '500': '#3498db', // Primary color
          '600': '#2983c2',
          '700': '#206e99',
          '800': '#185870',
          '900': '#104247',
        },
        go: '#98db34', 
        stop: '#db3445',
      },
      height: {
        'screen-78': '78vh',
      },
      minHeight: {
        '45vh': '45vh'
      },
      animation: {
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}