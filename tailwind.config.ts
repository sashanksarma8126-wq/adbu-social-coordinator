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
        adbu: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#94bcdb',
          400: '#5e9bc7',
          500: '#387eb2',
          600: '#276394',
          700: '#204f77',
          800: '#1e4363',
          900: '#0f2438',
          gold: '#c99700',
          navy: '#0b1d3a',
        },
      },
    },
  },
  plugins: [],
};
export default config;
