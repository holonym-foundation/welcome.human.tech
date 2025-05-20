'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type ReactNode, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { useHumanWalletStore } from './store/useHumanWalletStore'

const queryClient = new QueryClient()

function InitializeHumanWallet() {
  const { initializeHumanWallet } = useHumanWalletStore()

  useEffect(() => {
    initializeHumanWallet()
  }, [initializeHumanWallet])

  return null
}

export function Providers({
  children,
}: {
  children: ReactNode
  initialState?: any
}) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <InitializeHumanWallet />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <ToastContainer />
    </>
  )
}
