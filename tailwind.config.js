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
        'slideUp': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#00AB70', // primary-light
            a: {
              color: '#00FF9E', // primary
              '&:hover': {
                color: '#00AB70', // primary-light
              },
            },
            strong: {
              color: '#00FF9E', // primary
            },
            h1: {
              color: '#00FF9E', // primary
              fontWeight: '700',
            },
            h2: {
              color: '#00FF9E', // primary
              fontWeight: '600',
            },
            h3: {
              color: '#00FF9E', // primary
              fontWeight: '600',
            },
            h4: {
              color: '#00FF9E', // primary
              fontWeight: '600',
            },
            code: {
              color: '#00AB70', // primary-light
              backgroundColor: '#003B24', // primary-dark
              fontFamily: 'JetBrains Mono, monospace',
            },
            pre: {
              backgroundColor: '#003B24', // primary-dark
              color: '#00AB70', // primary-light
              fontFamily: 'JetBrains Mono, monospace',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              fontFamily: 'inherit',
            },
            blockquote: {
              borderLeftColor: '#00734A', // primary-medium
              color: '#00AB70', // primary-light
            },
            'ul > li::marker': {
              color: '#00FF9E', // primary
            },
            'ol > li::marker': {
              color: '#00FF9E', // primary
            },
            hr: {
              borderColor: '#003B24', // primary-dark
            },
            th: {
              color: '#00FF9E', // primary
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
