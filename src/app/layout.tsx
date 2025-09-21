import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { inter, teko } from './fonts'

export const metadata: Metadata = {
  title: 'Tryout CS2 | Kings Of Space',
  description: 'Formulario de postulación para tryouts de CS2',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${teko.variable}`}>
      <body>
        <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6">
          <main className="w-full max-w-3xl card p-6 sm:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
