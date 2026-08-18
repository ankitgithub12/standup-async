/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // DECISION: Using "class" strategy so dark mode is controlled by React state
  // (toggling a class on <html>) instead of OS preference. This gives the user
  // an explicit toggle, which is what was specified.
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', "serif"],
        body: ['"Inter"', "sans-serif"],
      },
      colors: {
        accent: {
          DEFAULT: "#E85D26",
          hover: "#D14E1C",
        },
      },
    },
  },
  plugins: [],
};
