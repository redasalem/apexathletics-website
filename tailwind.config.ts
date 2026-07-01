import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-display)', 'Bebas Neue', 'sans-serif'],
      },
      colors: {
        primary: {
          400: '#ff1a1a',
          500: '#d80000',
          600: '#a30000',
          700: '#7a0000',
          800: '#520000',
        },
        background: '#0a0a0a',
        surface: '#171717',
        surfaceHighlight: '#262626',
        textMain: '#ffffff',
        textMuted: '#a3a3a3',
        textDark: '#525252',
        border: '#333333',
        error: '#f87171',
        success: '#4ade80',
        warning: '#facc15'
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)',
        'elevation-2': '0 4px 14px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
        'elevation-3': '0 10px 30px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)',
        'glow-primary': '0 0 20px rgba(216,0,0,0.3), 0 0 60px rgba(216,0,0,0.1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'count-up': 'count-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
export default config;
