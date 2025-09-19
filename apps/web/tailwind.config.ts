import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Cognition/Devin-inspired palette (adjustable)
        brand: {
          DEFAULT: '#5B8CFF', // primary
          dark: '#3B6FE6',
          light: '#A6C2FF'
        },
        accent: {
          DEFAULT: '#22C55E', // emerald accent
          dark: '#16A34A',
          light: '#86EFAC'
        },
        surface: {
          DEFAULT: '#0B0F13', // deep surface for dark
          light: '#0F172A',
          alt: '#111827'
        }
      }
    }
  },
  plugins: []
} satisfies Config
