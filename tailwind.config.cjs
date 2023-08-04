/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require("@tailwindcss/typography"),
    require("daisyui"),
  ],
};
