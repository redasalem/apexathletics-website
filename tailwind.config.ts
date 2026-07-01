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
        sans: ['var(--font-albert)', 'Albert Sans', 'Avenir Next', 'system-ui', 'sans-serif'],
        display: ['var(--font-alumni)', 'Alumni Sans Pinstripe', 'sans-serif'],
        wordmark: ['var(--font-alumni-solid)', 'Alumni Sans', 'sans-serif'],
      },
      colors: {
        'lacquer-black': 'oklch(7% 0.006 95)',
        'lacquer-deep': 'oklch(4% 0.004 95)',
        'raised-lacquer': 'oklch(11% 0.006 95)',
        'graphite': 'oklch(15% 0.008 95)',
        'kinpaku-gold': 'oklch(84% 0.19 80.46)',
        'kinpaku-rich': 'oklch(77% 0.13 82)',
        'kinpaku-pale': 'oklch(86% 0.07 84)',
        'verdigris-patina': 'oklch(70% 0.12 188)',
        'champagne': 'oklch(91% 0 0)',
        'text-warm': 'oklch(88% 0 0)',
        'text-muted': 'oklch(72% 0 0)',
        'gold-hairline': 'oklch(78% 0 0 / 0.16)',
        'gold-hairline-strong': 'oklch(74% 0.09 82 / 0.6)',
      },
      boxShadow: {
        'panel': '0 24px 70px oklch(2% 0.004 95 / 0.42)',
        'cta-lift': '0 18px 48px oklch(2% 0.004 95 / 0.4)',
        'patina-glow': '0 0 22px oklch(70% 0.105 190 / 0.24)',
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
