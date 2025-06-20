import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./public/index.html"
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      // ... باقي التعديلات حسب مشروعك
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-rtl"),
    require("@tailwindcss/forms")
  ]
} satisfies Config;
