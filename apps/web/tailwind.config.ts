import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFEFA',
          100: '#FAF6F0',
          200: '#F5EBE1',
          300: '#EBE0D2',
          400: '#DFCDB8',
        },
        espresso: {
          500: '#6D4C41',
          600: '#5D4037',
          700: '#4E342E',
          800: '#3E2723',
          900: '#231709',
          950: '#181006',
        },
        terracotta: {
          100: '#FBECE7',
          400: '#E6866B',
          500: '#D97736',
          600: '#C86D51',
          700: '#A95237',
        },
        sand: {
          100: '#F4EFEA',
          200: '#E8DFD5',
          300: '#D5C7B7',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
