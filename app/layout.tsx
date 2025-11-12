import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bingo Associação - Master 1ª Linha',
  description: 'Sistema de sorteio de números para bingo da associação Master 1ª Linha',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-soccer-dark text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}

