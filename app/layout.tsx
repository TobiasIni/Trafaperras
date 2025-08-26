import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tragaperras Casino',
  description: 'Un juego de tragaperras virtual con 3 columnas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
