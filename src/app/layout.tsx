import Header from '@/components/Header'
import { Providers } from '@/providers'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Human Tech',
  description: 'Human Tech',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={``}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
