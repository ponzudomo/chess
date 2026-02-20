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
        background: "#1a1a1a",
        primary: "#81b64c",
        "board-light": "#eeeed2",
        "board-dark": "#769656",
        "text-main": "#ffffff",
        "text-muted": "#a1a1a1",
        "viz-my-attack": "rgba(59, 130, 246, 0.5)",
        "viz-opponent-attack": "rgba(239, 68, 68, 0.5)",
        "viz-contested": "rgba(168, 85, 247, 0.6)",
        "viz-dimmed": "rgba(0, 0, 0, 0.6)",
        "viz-last-move": "rgba(255, 255, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
