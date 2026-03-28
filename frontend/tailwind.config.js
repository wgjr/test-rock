/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bbdeff',
          300: '#8fcbff',
          400: '#5ab0ff',
          500: '#2f92ff',
          600: '#1674f0',
          700: '#125cd9',
          800: '#154bb0',
          900: '#183f8a'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)'
      }
    },
  },
  plugins: [],
};
