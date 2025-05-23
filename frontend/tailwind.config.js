/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mongodb: {
          green: '#00ED64',
          darkgreen: '#001E2B',
          lightgreen: '#E8FCF1',
          gray: {
            50: '#FFFFFF',
            100: '#F8FAFC',
            200: '#F1F5F9',
            300: '#E2E8F0',
            400: '#CBD5E1',
            500: '#94A3B8',
            600: '#64748B',
            700: '#475569',
            800: '#334155',
            900: '#1E293B',
          }
        }
      },
      fontFamily: {
        sans: ['Euclid Circular A', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'mongodb': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'mongodb-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}