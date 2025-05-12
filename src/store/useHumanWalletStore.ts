import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { initSilk } from '@silk-wallet/silk-wallet-sdk'
import { type Connector } from 'wagmi'
import type { UseConnectReturnType, useDisconnect } from 'wagmi'
import { config } from '@/wagmi'
import { showToast } from '@/utils/toast'
import { useStagingSilk } from '@/config'

// Add type declaration for window.silk
declare global {
  interface Window {
    silk: any
  }
}

interface HumanWalletState {
  // Provider State
  provider: any
  address: string
  chainId: number | null
  isConnected: boolean
  error: Error | null
  walletName: string | null

  // Provider Actions
  initializeProvider: () => void
  login: () => Promise<void>
  loginSelector: (
    connect: UseConnectReturnType<typeof config>['connect'],
    connectors: readonly Connector[]
  ) => Promise<void>
  logout: (
    disconnect: ReturnType<typeof useDisconnect>['disconnect']
  ) => Promise<void>
  setAddress: (address: string) => void
  setChainId: (chainId: number) => void
  syncWagmiState: (
    address: string,
    isConnected: boolean,
    chainId: number,
    walletName: string | null
  ) => void

  // Reset the store
  reset: () => void
}

const initialState = {
  provider: null,
  address: '',
  chainId: null,
  isConnected: false,
  error: null,
  walletName: null,
}

// Export the store directly for use with getState
export const humanWalletStore = create<HumanWalletState>((set, get) => ({
  ...initialState,

  initializeProvider: () => {
    try {
      const provider = initSilk({
        useStaging: useStagingSilk,
        config: {
          allowedSocials: ['google', 'twitter', 'discord', 'github'],
          authenticationMethods: ['email', 'phone', 'wallet', 'social'],
        },
      })
      window.silk = provider
      window.ethereum = provider
      set({ provider })

      // ! this does not work with wallet connect or injected even though
      // ! metamask provider or wagmi hook works
      // * this works with silk wallet provider
      provider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts: unknown) => {
          const accountArray = accounts as string[]
          const address = accountArray[0]
          if (address) {
            set({ address, isConnected: !!address, walletName: 'Human Wallet' })
          }
        })

      // ! this does not work with silk wallet provider
      // wallet_switchEthereumChain
      // provider.request({
      //   method: 'wallet_switchEthereumChain',
      //   params: [{ chainId: '0x1' }],
      // }).then((res: unknown) => {
      //   console.log('wallet_switchEthereumChain', res)
      // })

      // Set up event listeners
      // provider.on('accountsChanged', (accounts: string[]) => {
      //   set({ address: accounts[0], isConnected: accounts.length > 0 })
      // })

      // provider.on('chainChanged', (chainId: string) => {
      //   console.log('Chain changed:', chainId)
      //   const chainIdNumber = parseInt(chainId, 16)
      //   console.log('Parsed chain ID:', chainIdNumber)
      //   set({ chainId: chainIdNumber })
      // })

      // Check initial connection and chain
      // Promise.all([
      //   provider.request({ method: 'eth_accounts' }),
      //   provider.request({ method: 'eth_chainId' })
      // ]).then(([accounts, chainId]) => {
      //   console.log('Initial chain ID:', chainId)
      //   const accountArray = accounts as string[]
      //   const chainIdNumber = parseInt(chainId as string, 16)
      //   console.log('Initial parsed chain ID:', chainIdNumber)

      //   set({
      //     address: accountArray[0],
      //     isConnected: accountArray.length > 0,
      //     chainId: chainIdNumber
      //   })
      // }).catch(err => {
      //   console.error('Failed to get initial chain ID:', err)
      //   showToast('error', 'Failed to get chain ID')
      // })
    } catch (err) {
      console.error('Failed to initialize provider:', err)
      const error = err instanceof Error ? err : new Error(String(err))
      set({ error })
      showToast(
        'error',
        `Failed to initialize wallet provider: ${error.message}`
      )
    }
  },

  login: async () => {
    const { provider } = get()
    if (!provider) return

    try {
      await provider.login()
      window.ethereum = provider
      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      if (accounts.length > 0) {
        console.log('🚀MMM - ~ login: ~ accounts:', accounts)
        set({ address: accounts[0], isConnected: true, walletName: 'Human Wallet' })
      }
    } catch (err) {
      console.error('Failed to login:', err)
      const error = err instanceof Error ? err : new Error(String(err))
      set({ error })
      showToast('error', `Failed to login to wallet: ${error.message}`)
      throw err
    }
  },

  loginSelector: async (
    connect: UseConnectReturnType<typeof config>['connect'],
    connectors: readonly Connector[]
  ) => {
    try {
      const result = await window.silk.loginSelector()
      console.log('loginSelector result ', result)

      if (result === 'silk' || !result) {
        window.ethereum = window.silk
        await get().login()
      } else if (result === 'injected') {
        const injectedConnector = connectors.find(
          (conn) => conn.id === 'injected'
        )
        if (injectedConnector) {
          await connect({ connector: injectedConnector, chainId: 1 })
        }
      } else if (result === 'walletconnect') {
        const walletConnectConnector = connectors.find(
          (conn) => conn.id === 'walletConnect'
        )
        if (walletConnectConnector) {
          await connect({ connector: walletConnectConnector, chainId: 1 })
        }
      }
    } catch (err) {
      console.error('Login selector error:', err)
      const error = err instanceof Error ? err : new Error(String(err))
      set({ error })
      showToast('error', `Failed to connect wallet: ${error.message}`)
      throw err
    }
  },

  logout: async (
    disconnect: ReturnType<typeof useDisconnect>['disconnect']
  ) => {
    const { provider } = get()
    if (!provider) return

    try {
      // Disconnect from Silk wallet
      await provider.logout()

      // Disconnect from wagmi
      if (disconnect) {
        await disconnect()
      }

      // Reset the store state
      set({
        address: '',
        isConnected: false,
        chainId: null,
        walletName: null,
        provider: null,
      })
    } catch (err) {
      console.error('Failed to logout:', err)
      const error = err instanceof Error ? err : new Error(String(err))
      set({ error })
      showToast('error', `Failed to logout wallet: ${error.message}`)
      throw err
    }
  },

  setAddress: (address: string) => set({ address, isConnected: !!address }),
  setChainId: (chainId: number) => set({ chainId }),
  syncWagmiState: (
    address: string,
    isConnected: boolean,
    chainId: number,
    walletName: string | null
  ) => set({ address, isConnected, chainId, walletName }),
  reset: () => set(initialState),
}))

// Export the hook for use in components
export const useHumanWalletStore = () =>
  humanWalletStore(
    useShallow((state) => ({
      // Provider State
      provider: state.provider,
      address: state.address,
      chainId: state.chainId,
      isConnected: state.isConnected,
      error: state.error,
      walletName: state.walletName,

      // Provider Actions
      initializeProvider: state.initializeProvider,
      login: state.login,
      loginSelector: state.loginSelector,
      logout: state.logout,
      setAddress: state.setAddress,
      setChainId: state.setChainId,
      syncWagmiState: state.syncWagmiState,

      // Reset the store
      reset: state.reset,
    }))
  )
