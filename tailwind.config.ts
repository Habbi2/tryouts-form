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
          bg: '#080c19',
          card: '#0e1630',
          accent: '#6d8bff',
          accent2: '#22d3ee',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(109,139,255,0.35), 0 8px 30px rgba(109,139,255,0.25)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(1000px 500px at 80% -10%, rgba(34,211,238,.25), rgba(0,0,0,0))',
        'radial-fade-2': 'radial-gradient(800px 400px at 10% 110%, rgba(109,139,255,.25), rgba(0,0,0,0))',
      },
      keyframes: {
        grid: {
          '0%': { backgroundPosition: '0px 0px' },
          '100%': { backgroundPosition: '60px 60px' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 0 1px rgba(109,139,255,0.35), 0 8px 30px rgba(109,139,255,0.25)' },
          '50%': { boxShadow: '0 0 0 1px rgba(34,211,238,0.4), 0 8px 35px rgba(34,211,238,0.3)' },
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
