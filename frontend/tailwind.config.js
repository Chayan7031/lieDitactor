/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          green: '#00ff41',
          red: '#ff003c',
          yellow: '#fcee0a',
          dark: '#0a0a0a',
          darker: '#050505',
          blue: '#00f0ff'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-green': '0 0 10px #00ff41, 0 0 20px #00ff41',
        'neon-red': '0 0 10px #ff003c, 0 0 20px #ff003c',
        'neon-blue': '0 0 10px #00f0ff, 0 0 20px #00f0ff',
      }
    },
  },
  plugins: [],
}
