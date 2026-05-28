module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
    },
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/globals.css',
  ],
  plugins: [],
};
