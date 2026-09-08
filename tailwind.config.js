/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sauda: {
          50: '#fff8f1',
          100: '#feeedc',
          200: '#fcd9b6',
          300: '#f9bd85',
          400: '#f59a50',
          500: '#FF9800',
          600: '#FFA000',
          700: '#F57C00',
          800: '#c75308',
          900: '#9c430c',
          dark: '#1F2937',
          gray: '#6B7280',
          bg: '#F5F7FA',
        }
      },
      boxShadow: {
        'card': '0 2px 8px -1px rgba(0, 0, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
