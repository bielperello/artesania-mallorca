module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#ec4913",
        "terracotta": "#e2725b",
        "terracotta-light": "#fceee9",
        "sand": "#e8d8c3",
        "sand-dark": "#d1bfae",
        "background-light": "#f8f6f6",
        "background-dark": "#221510",
      },
      fontFamily: {
        "display": ["Newsreader", "serif"],
        "serif": ["Playfair Display", "serif"],
        "body": ["Plus Jakarta Sans", "sans-serif"],
        "sans": ["Inter", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
