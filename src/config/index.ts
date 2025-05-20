import { InitSilkOptions } from '@silk-wallet/silk-wallet-sdk'

export const passportApiKey = process.env.NEXT_PUBLIC_API_KEY
export const passportScorerId = process.env.NEXT_PUBLIC_SCORER_ID

export const useStagingSilk = true

export const silkUrl = useStagingSilk
  ? 'https://staging-silkysignon.com/'
  : 'https://humansignon.com/'

export const silkConfig: InitSilkOptions = {
  useStaging: true,
  config: {
    // darkMode: false,
    allowedSocials: ['google', 'twitter', 'discord', 'github'],
    authenticationMethods: ['email', 'phone', 'wallet', 'social'],
    styles: {
      darkMode: false,
    },
  },
  project: {
    name: 'Welcome Human',
  },
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
}
