import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "var(--color-primary, #0B67C2)",
        "secondary": "var(--color-secondary, #003366)",
        "accent": "var(--color-accent, #3D9BFF)", 
        "neutral": "var(--color-neutral, #F1F5F9)",
        "dark-accent": "var(--color-dark-accent, #0F172A)",
        "background-light": "var(--color-neutral, #F1F5F9)",
        "background-dark": "var(--color-dark-accent, #0F172A)",
        "slate": {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        }
      },
      fontFamily: {
        "poppins": ["Poppins", "sans-serif"],
        "roboto": ["Roboto", "sans-serif"],
        "outfit": ["Outfit", "sans-serif"],
        "inter": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        "4xl": "3rem",
        "5xl": "3.5rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    forms,
    containerQueries
  ],
}
