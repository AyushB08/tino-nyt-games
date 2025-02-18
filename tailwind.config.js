/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          shake: {
            '10%, 90%': { transform: 'translateX(-1px)' },
            '20%, 80%': { transform: 'translateX(2px)' },
            '30%, 50%, 70%': { transform: 'translateX(-4px)' },
            '40%, 60%': { transform: 'translateX(4px)' },
          },
          'flip-0': {
            '0%': { transform: 'rotateX(0deg)' },
            '50%': { transform: 'rotateX(-90deg)' },
            '100%': { transform: 'rotateX(0deg)' },
          },
          'flip-1': {
            '0%': { transform: 'rotateX(0deg)' },
            '50%': { transform: 'rotateX(-90deg)' },
            '100%': { transform: 'rotateX(0deg)' },
          },
          'flip-2': {
            '0%': { transform: 'rotateX(0deg)' },
            '50%': { transform: 'rotateX(-90deg)' },
            '100%': { transform: 'rotateX(0deg)' },
          },
          'flip-3': {
            '0%': { transform: 'rotateX(0deg)' },
            '50%': { transform: 'rotateX(-90deg)' },
            '100%': { transform: 'rotateX(0deg)' },
          },
          'flip-4': {
            '0%': { transform: 'rotateX(0deg)' },
            '50%': { transform: 'rotateX(-90deg)' },
            '100%': { transform: 'rotateX(0deg)' },
          },
          'bounce-0': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          'bounce-1': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          'bounce-2': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          'bounce-3': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          'bounce-4': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        },
        animation: {
          'shake': 'shake 0.25s linear',
          'flip-0': 'flip-0 0.5s ease-in-out',
          'flip-1': 'flip-1 0.5s ease-in-out',
          'flip-2': 'flip-2 0.5s ease-in-out',
          'flip-3': 'flip-3 0.5s ease-in-out',
          'flip-4': 'flip-4 0.5s ease-in-out',
          'bounce-0': 'bounce-0 0.5s ease-in-out',
          'bounce-1': 'bounce-1 0.5s ease-in-out 0.1s',
          'bounce-2': 'bounce-2 0.5s ease-in-out 0.2s',
          'bounce-3': 'bounce-3 0.5s ease-in-out 0.3s',
          'bounce-4': 'bounce-4 0.5s ease-in-out 0.4s',
        },
      },
    },
    plugins: [],
  }