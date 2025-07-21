module.exports = {
  content: [
    './src/**/*.{astro,js,jsx,ts,tsx,mdx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        marker: ['"Permanent Marker"', '"Caveat"', 'cursive'],
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
      colors: {
        'sticky-yellow': '#FFF9B0', // Pastel Yellow
        'sticky-pink': '#FFD1DC',   // Soft Pink
        'sticky-blue': '#B3E5FC',   // Light Blue
        'sticky-green': '#B9F6CA',  // Mint Green
        marker: {
          black: '#111827',
          red: '#D83333',
          blue: '#3245FF',
          green: '#00B894',
        },
        highlighter: {
          yellow: 'rgba(255, 255, 0, 0.5)', // Fluorescent Yellow
          pink: 'rgba(255, 0, 128, 0.3)',   // Fluorescent Pink
        },
      },
    },
  },
  plugins: [],
}; 