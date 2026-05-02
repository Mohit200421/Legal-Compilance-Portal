/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // darkMode removed
  theme: {
    extend: {
      colors: {
        secondary: "#4648d4",
        "secondary-fixed": "#e1e0ff",
        "tertiary-fixed": "#fadfb8",
        "tertiary-fixed-dim": "#ddc39d",
        primary: "#091426",
        "primary-fixed": "#d8e3fb",
        outline: "#75777d",
        "outline-variant": "#c5c6cd",
        "surface-container-low": "#f5f3f4",
        "surface-container": "#f0edef",
      },
    },
  },
  plugins: [],
};
