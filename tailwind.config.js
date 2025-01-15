/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00FF9E',
        'primary-dark': '#003B24',
        'primary-medium': '#00734A',
        'primary-light': '#00AB70',
        background: '#000000',
        surface: '#111111',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 10px rgba(0, 255, 158, 0.3)',
        'glow-strong': '0 0 20px rgba(0, 255, 158, 0.5)',
      },
      animation: {
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
