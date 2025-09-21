import { Inter, Teko } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const teko = Teko({
  subsets: ['latin'],
  variable: '--font-teko',
  weight: ['400', '500', '600', '700'],
})
