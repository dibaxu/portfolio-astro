/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#89B9AD",
        secondary: "#C7DCA7",
        terciary: "#FFEBD8",
      },
      fontFamily: {
        secondary: "Modak",
      },
    },
  },
  plugins: [],
};
