import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
})

export function getConfig() {
  return config
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
