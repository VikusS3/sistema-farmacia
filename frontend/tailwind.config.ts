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
        background: {
          DEFAULT: "#121212",
          secondary: "#1E1E2E",
        },
        text: {
          primary: "#E0E0E0",
          secondary: "#A6A6A6",
        },
        primary: "#00ADB5",
        success: "#4CAF50",
        warning: "#F9A825",
        error: "#FF5252",
        border: "#292929",
      },
    },
  },
  plugins: [],
} satisfies Config;
