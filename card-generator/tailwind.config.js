/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        canvas: "#FAF7F2",
        ink: "#1A1A1A",
        clay: {
          DEFAULT: "#D97757",
          soft: "#E89A7E",
          deep: "#B85C3E",
        },
        moss: {
          DEFAULT: "#7A9B83",
          soft: "#A3BCA6",
          deep: "#5C7A66",
        },
        line: "#E8E3DA",
        muted: "#8A847A",
        paper: "#FFFFFF",
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Noto Serif SC"', "serif"],
        serif: ['"Noto Serif SC"', "serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
        script: ['"Dancing Script"', "cursive"],
        hand: ['"Caveat"', "cursive"],
        brush: ['"Ma Shan Zheng"', "cursive"],
        xiaowei: ['"ZCOOL XiaoWei"', "serif"],
      },
      boxShadow: {
        card: "0 10px 40px -12px rgba(26,26,26,0.18), 0 4px 12px -4px rgba(26,26,26,0.08)",
        soft: "0 2px 8px -2px rgba(26,26,26,0.08)",
        lift: "0 8px 24px -8px rgba(217,119,87,0.35)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};
