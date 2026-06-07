import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background-rgb) / <alpha-value>)",
        foreground: "rgb(var(--foreground-rgb) / <alpha-value>)",
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
        secondary: "rgb(var(--secondary-rgb) / <alpha-value>)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        "theme-surface": "rgb(var(--surface-rgb) / <alpha-value>)",
        "theme-background": "rgb(var(--background-rgb) / <alpha-value>)",
        theme: "rgb(var(--surface-border-rgb) / <alpha-value>)",
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
