module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      serif: ["Rubik", "ui-sans-serif"],
      sans: ["Fira Code", "monospace"],
    },
    extend: {
      colors: {
        primary_red: {
          0: "#F8312F",
          1: "#F87171",
        },
        darkmode_gray: {
          0: "#303030",
        },
        linkedin:{
          0: "#00A0DC",
        },
        twitter:{
          0: "#1DA1F2",
        },
        leaderboardbg:{
          0:"#FFECDE",
        }
      },
      screens: {
        "3xl": "1600px",
      },
      maxWidth: {
        '1': '29rem',
      }
    },
  },
  plugins: [],
};