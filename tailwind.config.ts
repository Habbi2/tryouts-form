import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-inter)',
          ...fontFamily.sans,
        ],
        display: [
          'var(--font-teko)',
          ...fontFamily.sans,
        ],
      },
      colors: {
        cs: {
          bg: '#0a0b14',
          card: '#111634',
          accent: '#8b5cf6', // purple
          accent2: '#facc15', // gold
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,92,246,0.35), 0 8px 30px rgba(139,92,246,0.25)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(1000px 500px at 80% -10%, rgba(250,204,21,.25), rgba(0,0,0,0))',
        'radial-fade-2': 'radial-gradient(800px 400px at 10% 110%, rgba(139,92,246,.25), rgba(0,0,0,0))',
      },
      keyframes: {
        grid: {
          '0%': { backgroundPosition: '0px 0px' },
          '100%': { backgroundPosition: '60px 60px' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 0 1px rgba(139,92,246,0.35), 0 8px 30px rgba(139,92,246,0.25)' },
          '50%': { boxShadow: '0 0 0 1px rgba(250,204,21,0.4), 0 8px 35px rgba(250,204,21,0.3)' },
        },
      },
      animation: {
        grid: 'grid 12s linear infinite',
        glow: 'glow 3s ease-in-out infinite',
      },
    }
  },
  plugins: []
}

export default config
