const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    screens: {
      'xs': '500px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        sans: ["Rubik"],
        body: ["Rubik"],
      },
      colors: {
        primary: "#46E5FC",
        secondary: "#F6685D",
        onHeader: "#F1F1F1",
        onFooter: "#A1A1A1",
        background: "#121212",
        onBackground: "#E3E3E3",
        
      },
    },
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
  variants: {
    extend: {
      visibility: ["group-hover"],
    },
  },
};
