/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00BCD4',
          light: '#26C6DA',
          dark: '#0097A7',
        },
        accent: {
          DEFAULT: '#1E3A5F',
          light: '#2C5282',
          dark: '#152840',
        },
        secondary: {
          DEFAULT: '#E91E63',
          light: '#F06292',
        },
        element: {
          fire: '#FF6B6B',
          aqua: '#4FC3F7',
          wind: '#66BB6A',
          earth: '#FFA726',
          light: '#FFD54F',
          dark: '#7E57C2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-up': 'slide-up 0.6s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

