import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  // theme: {
  //   extend: {
  //     colors: {
  //       primary: {
  //         100: "#0D6E6E",
  //         200: "#4a9d9c",
  //         300: "#afffff",
  //       },
  //       accent: {
  //         100: "#FF3D3D",
  //         200: "#ffe0c8",
  //       },
  //       text: {
  //         100: "#FFFFFF",
  //         200: "#e0e0e0",
  //       },
  //       background: {
  //         100: "#0D1F2D",
  //         200: "#1d2e3d",
  //         300: "#354656",
  //       },
  //     },
  //   },
  // },
  theme: {
    extend: {
      colors: {
        background: {
          100: "#ffffff",
          200: "#fafafa",
          300: "#e6e6e6",
          400: "#d3d3d3",
        },
        primary: {
          50: "#044A8C",
          100: "#4a8ed8",
          200: "#6fa9e6",
          300: "#87bff9",
          400: "#d3d3d3",
        },
        accent: {
          100: "#87bff9",
          200: "#6fa9e6",
          300: "#d3d3d3",
        },
        text: {
          100: "#056fe3",
          200: "#2d557f",
          300: "#4a8ed8",
          400: "#d3d3d3",
        },
        variaty: {
          100: "#18508B",
          200: "#4a8ed8",
          300: "#6fa9e6",
          400: "#87bff9",
          500: "#d3d3d3",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
