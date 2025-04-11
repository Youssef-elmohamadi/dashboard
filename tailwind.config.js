module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",  // المسارات التي يجب أن يتصفحها Tailwind للبحث عن الـ classes
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
