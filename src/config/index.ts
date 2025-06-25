import { InitSilkOptions } from '@silk-wallet/silk-wallet-sdk'

export const passportApiKey = process.env.NEXT_PUBLIC_API_KEY
export const passportScorerId = process.env.NEXT_PUBLIC_SCORER_ID
export const passportScoreThreshold = 25

export const useStagingSilk = false

export const silkUrl = useStagingSilk
  ? 'https://staging-silkysignon.com/'
  : 'https://humansignon.com/'

export const silkConfig: InitSilkOptions = {
  // useStaging: true,
  useProd: true,
  config: {
    // darkMode: false,
    allowedSocials: ['google', 'twitter', 'discord', 'github'],
    authenticationMethods: ['email', 'phone', 'wallet', 'social'],
    styles: {
      darkMode: false,
    },
  },
  project: {
    entryTitle: 'Welcome Human',
  },
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
}
