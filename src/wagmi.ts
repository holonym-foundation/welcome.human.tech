import { http, createConfig } from "wagmi";
import { sepolia, mainnet, optimism, zksync, polygon } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia, mainnet, optimism, zksync, polygon],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    }),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [zksync.id]: http(),
    [polygon.id]: http(),
  },
});

export function getConfig() {
  return config;
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
