/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Agrega Playfair Display como fuente serif
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'bounce-subtle': 'bounce-subtle 0.6s ease-in-out',
      },
      backgroundImage: {
        // Mesh gradient helper para el hero
        'mesh-indigo': 'radial-gradient(circle at 30% 20%, #6366f1 0%, transparent 50%), radial-gradient(circle at 70% 80%, #8b5cf6 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}