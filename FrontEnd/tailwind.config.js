/* eslint-disable prettier/prettier */
import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        xl: "80rem", // Para monitores grandes (1280px)
        "2xl": "90rem", // Para monitores widescreen e ultrawide (1440px)
        "3xl": "96rem", // Para monitores ultrawide ainda maiores (1536px)
      },
    },
  },

  darkMode: "class",

  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: "#4091c5",
            secondary: "#7fc2ed",
            accent: "#42b3fc",
            background: "#ffffff",
            text: "#000000",
          },
        },

        dark: {
          colors: {
            primary: "#4091c5",
            secondary: "#7fc2ed",
            accent: "#42b3fc",
            background: "#000000",
            text: "#ffffff",
          },
        },
      },
    }),
  ],
};

