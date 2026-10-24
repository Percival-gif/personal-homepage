import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        paper: 'var(--paper)',
        acid: 'var(--acid)',
        blue: 'var(--blue)',
        magenta: 'var(--magenta)',
        amber: 'var(--amber)',
        teal: 'var(--teal)',
      },
      boxShadow: { comic: '8px 8px 0 var(--ink)' },
      borderWidth: { 3: '3px', 5: '5px' },
    },
  },
  plugins: [],
} satisfies Config;
