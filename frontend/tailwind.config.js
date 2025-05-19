/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',    // all your React code
    '../backend/apps/**/*.html',             // if you ever serve templates
  ],
  theme: {
    extend: {
      // (optional) add custom colors, spacing, etc.
    },
  },
  plugins: [
    // you can add Tailwind plugins here later (forms, typography…)
  ],
};
