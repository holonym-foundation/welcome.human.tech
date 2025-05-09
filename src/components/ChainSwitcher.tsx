import { useAccount, useSwitchChain } from 'wagmi'
import { mainnet, sepolia, polygon, gnosis, optimism, baseSepolia } from 'wagmi/chains'

export function ChainSwitcher() {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()

  const chains = [
    { name: 'Ethereum Mainnet', id: mainnet.id },
    { name: 'Sepolia', id: sepolia.id },
    { name: 'Polygon', id: polygon.id },
    { name: 'Gnosis', id: gnosis.id },
    { name: 'Optimism', id: optimism.id },
    { name: 'Base Sepolia', id: baseSepolia.id },
  ]

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-600">Connected to: {chain?.name}</p>
      <div className="grid grid-cols-2 gap-2">
        {chains.map(({ name, id }) => (
          <button
            key={id}
            onClick={() => switchChain({ chainId: id })}
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Switch to {name}
          </button>
        ))}
      </div>
    </div>
  )
} 