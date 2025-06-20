import { useQuery } from '@tanstack/react-query'
import { useHumanWalletStore } from '@/store/useHumanWalletStore'
import { passportApiKey, passportScorerId } from '@/config'

interface Stamp {
  score: string
  dedup: boolean
  expiration_date: string
}

interface PassportScore {
  address: string
  score: string
  passing_score: boolean
  last_score_timestamp: string
  expiration_timestamp: string
  threshold: string
  error: string | null
  stamps: {
    [key: string]: Stamp
  }
}

const fetchPassportScore = async (address: string): Promise<PassportScore> => {
  if (!passportApiKey || !passportScorerId) {
    throw new Error('Missing Passport API configuration')
  }

  const response = await fetch(
    `https://api.passport.xyz/v2/stamps/${passportScorerId}/score/${address}`,
    {
      headers: {
        'X-API-KEY': passportApiKey,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch Passport score')
  }

  return response.json()
}

export const usePassportScore = () => {
  const { address, isConnected } = useHumanWalletStore()
  const addr = address

  return useQuery({
    queryKey: ['passportScore', addr],
    queryFn: () => fetchPassportScore(addr!),
    enabled: !!addr && isConnected,
    retry: 3,
  })
}
