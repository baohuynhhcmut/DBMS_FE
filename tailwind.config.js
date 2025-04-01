/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}", // Ensure it scans all files inside src/
  ],
  theme: {
    extend: {
      colors: {
        whiteText: "#fff",
        darkText: "#000000",
        lightText: "#9b9b9b",
        greenText: "#1d8221",
        redText: "#E02B2B ",
        skyText: "#32BDE8",
      },
      flex: {
        full: "0 0 100%",
      },
    },
    keyframes: {
      slideUp: {
        "0%": { opacity: 0, transform: "translateY(50px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
      },
      rotateOnce: {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
      },
    },
    animation: {
      "slide-up": "slideUp 1.5s ease-out",
      "rotate-once": "rotateOnce 0.3s ease-in-out 1",
    },
  },  
  plugins: [
    typography,
    aspectRatio
  ],
};