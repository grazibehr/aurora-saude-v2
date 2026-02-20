/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de bem-estar - tons calmantes e acolhedores
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',  // Teal - equilibrio e saude
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Verde suave - renovacao e natureza
        wellness: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Azul claro - calma e serenidade
        calm: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Tons neutros acolhedores
        warm: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8dfd0',
          300: '#d4c5ad',
          400: '#bda686',
          500: '#a68d6a',
          600: '#8b7355',
          700: '#6f5c45',
          800: '#5a4a38',
          900: '#4a3d2f',
        },
        // Aurora brand - verde-agua suave
        aurora: {
          light: '#e0f7f4',
          DEFAULT: '#14b8a6',
          dark: '#0f766e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-wellness': 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f0fdf4 100%)',
        'gradient-calm': 'linear-gradient(180deg, #f0f9ff 0%, #f0fdfa 100%)',
      }
    },
  },
  plugins: [],
}
