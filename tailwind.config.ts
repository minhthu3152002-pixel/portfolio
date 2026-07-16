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
        bg: '#0f1014',
        surface: '#16181f',
        line: '#262a36',
        text: '#eef0f4',
        muted: '#9aa1b0',
        accent: '#ff7a45',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        card: '22px',
      },
      maxWidth: {
        wrap: '1120px',
      },
    },
  },
  plugins: [],
};

export default config;
