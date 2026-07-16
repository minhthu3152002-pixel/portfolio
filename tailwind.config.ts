import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apple light theme
        bg: '#f5f5f7', // page background
        surface: '#ffffff', // white sections / cards
        line: '#e5e5ea', // hairline borders
        text: '#1d1d1f', // primary text
        muted: '#6e6e73', // secondary text
        accent: '#0071e3', // Apple blue (generic accent / links)
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '28px',
      },
      maxWidth: {
        wrap: '1120px',
      },
    },
  },
  plugins: [],
};

export default config;
