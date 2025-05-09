import { Providers } from '@/providers'
import { getConfig } from '@/wagmi'
import type { Metadata } from 'next'
import { cookieToInitialState } from 'wagmi'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Human Tech',
  description: 'Human Tech',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    typeof window !== 'undefined' ? document.cookie : ''
  )

  return (
    <html lang='en'>
      <body className={``}>
        <Providers initialState={initialState}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
