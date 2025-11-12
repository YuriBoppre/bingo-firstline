/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'soccer-blue': '#1e40af',
        'soccer-gold': '#fbbf24',
        'soccer-dark': '#0f172a',
      },
      animation: {
        'pop': 'pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'oscillate': 'oscillate 2s ease-in-out infinite',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        oscillate: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(2deg)' },
          '75%': { transform: 'translateY(5px) rotate(-2deg)' },
        },
      },
    },
  },
  plugins: [],
}

