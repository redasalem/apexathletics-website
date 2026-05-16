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
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          500: '#d80000',
          600: '#a30000',
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
    },
  },
  plugins: [],
};
export default config;
