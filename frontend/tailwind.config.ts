import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#0D6E6E",
          200: "#4a9d9c",
          300: "#afffff",
        },
        accent: {
          100: "#FF3D3D",
          200: "#ffe0c8",
        },
        text: {
          100: "#FFFFFF",
          200: "#e0e0e0",
        },
        background: {
          100: "#0D1F2D",
          200: "#1d2e3d",
          300: "#354656",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
