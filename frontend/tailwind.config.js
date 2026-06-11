/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#111111',
          secondary: '#161616',
          tertiary: '#1A1A1A',
          elevated: '#1E1E1E',
          hover: '#222222',
        },
        text: {
          primary: '#E8EAED',
          secondary: '#9AA0A6',
          tertiary: '#6B7280',
          muted: '#5F6368',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.04)',
          default: 'rgba(255, 255, 255, 0.06)',
          hover: 'rgba(255, 255, 255, 0.1)',
        },
        accent: {
          DEFAULT: '#14B8A6',
          muted: 'rgba(20, 184, 166, 0.08)',
          hover: '#2DD4BF',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
