import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e6edff',
          200: '#c7d9ff',
          300: '#a8c5ff',
          400: '#89b1ff',
          500: '#6a9dff',
          600: '#4a7dff',
          700: '#2a5dff',
          800: '#1a3dff',
          900: '#0a1dff',
        },
        accent: {
          50: '#f0fef9',
          100: '#ccfdf0',
          200: '#99fbe1',
          300: '#66f9d2',
          400: '#33f7c3',
          500: '#1ae8b3',
          600: '#16d4a0',
          700: '#12c08d',
          800: '#0eac7a',
          900: '#0a9867',
        },
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 1s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
export default config
