import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jetbrains: ["JetBrains Mono", "monospace"],
      },
      colors: {
        prim: "#E9FF5F",
        sec: "#DFFF1A",
        dest: "#FF563F",
        ter: "#39FFAC",
        mute: "#52525B",
      },
    },
  },
  plugins: [],
};
export default config;
