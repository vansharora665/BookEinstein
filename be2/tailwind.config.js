module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#1EA7C5",
        accent: "#FF8A4C",
        softBg: "#F5F8FF",
        textDark: "#0F172A",
        textLight: "#64748B",
        borderSoft: "#E2E8F0",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        card: "0 10px 30px rgba(15,23,42,0.06)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
