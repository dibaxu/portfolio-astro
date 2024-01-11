/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#89B9AD",
        secondary: "#C7DCA7",
        terciary: "#FFEBD8",
      },
    },
  },
  plugins: [],
};
