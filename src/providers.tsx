'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type ReactNode, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { WagmiProvider, useAccount, useChainId } from 'wagmi'
import { config } from './wagmi'
import { useHumanWalletStore } from './store/useHumanWalletStore'

const queryClient = new QueryClient()

// Separate component to handle wallet state sync
function WalletStateSync() {
  const { address, isConnected, connector } = useAccount()
  const chainId = useChainId()
  const { syncWagmiState } = useHumanWalletStore()

  useEffect(() => {
    if (address && isConnected && chainId) {
      const walletName = connector?.name || 'Human Wallet'
      syncWagmiState(address, isConnected, chainId, walletName)
    }
  }, [address, isConnected, chainId, connector, syncWagmiState])

  return null
}

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: any
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <WalletStateSync />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <ToastContainer />
    </WagmiProvider>
  )
}
