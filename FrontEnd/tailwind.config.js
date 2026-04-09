import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
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
        xl: "80rem",
        "2xl": "90rem",
        "3xl": "96rem",
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
