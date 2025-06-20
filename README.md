# Human.tech Passport Verification App

A Next.js application that integrates with Human Passport and Human Wallet to verify human identity and provide a seamless Web3 authentication experience.

## Overview

This application allows users to:
- Connect with Human Wallet (Human.tech's wallet solution)
- Verify their humanity through Human Passport scores
- Access human-verified features and services
- Switch between different Ethereum networks

## Features

- **Human Passport Integration**: Verify human identity using Human Passport scores
- **Human Wallet Support**: Seamless integration with Human.tech's Human Wallet SDK
- **Multi-chain Support**: Connect to different Ethereum networks
- **Responsive Design**: Mobile-first design with beautiful animations
- **Real-time Updates**: Live passport score updates and verification status
- **Social Authentication**: Support for Google, Twitter, Discord, and GitHub login methods

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Web3**: Wagmi, Viem, Ethers.js
- **Wallet Integration**: Human Wallet SDK
- **Identity Verification**: Human Passport

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- A Human Passport API key and scorer ID from [Passport Dashboard](https://developer.passport.xyz)
- A WalletConnect project ID from [Reown Cloud](https://cloud.reown.com/sign-in)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd passport
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Copy the example environment file and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   - `NEXT_PUBLIC_API_KEY`: Your Human Passport API key (get from [Passport Dashboard](https://developer.passport.xyz))
   - `NEXT_PUBLIC_SCORER_ID`: Your Human Passport scorer ID (get from [Passport Dashboard](https://developer.passport.xyz))
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID (get from [Reown Cloud](https://cloud.reown.com/sign-in))

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_KEY` | Human Passport API key for score verification | Yes |
| `NEXT_PUBLIC_SCORER_ID` | Human Passport scorer ID for your application | Yes |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID for wallet connections | Yes |

## Configuration

The application can be configured through `src/config/index.ts`:

- **Passport Score Threshold**: Minimum score required for verification (default: 25)
- **Human Wallet Environment**: Toggle between staging and production Human Wallet environments
- **Allowed Socials**: Configure which social login methods are available
- **Authentication Methods**: Configure available authentication options

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/             # Reusable React components
├── config/                 # Application configuration
├── hooks/                  # Custom React hooks
├── store/                  # Zustand state management
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── wagmi.ts               # Wagmi configuration
```

## Key Components

- **PassportScoreWidget**: Human Passport integration for identity verification
- **HumanWalletStore**: Zustand store managing Human Wallet connections
- **ChainSwitcher**: Component for switching between Ethereum networks
- **Header**: Application navigation and user interface

## Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality

## Development

This project uses:
- **ESLint** for code linting with Prettier integration
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Turbopack** for fast development builds

## API Integration

### Human Passport API
The application integrates with Human Passport to verify user humanity scores:
- **Endpoint**: `https://api.passport.xyz/v2/stamps/{scorerId}/score/{address}`
- **Authentication**: X-API-KEY header
- **Threshold**: Configurable minimum score for verification
- **Get API Key**: [Passport Dashboard](https://developer.passport.xyz)

### Human Wallet SDK
Uses Human.tech's Human Wallet SDK for:
- User authentication
- Wallet connections
- Message signing
- Chain switching
- **Documentation**: [Human Wallet Docs](https://docs.wallet.human.tech/)

## Deployment

The application can be deployed on any platform that supports Next.js:

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
- Follow standard Next.js deployment procedures
- Ensure environment variables are properly configured
- Run `pnpm build` to generate production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checks
5. Submit a pull request


## Support

For support and questions:
- Visit [Human.tech](https://human.tech)
- Check the [Human Passport Documentation](https://docs.passport.xyz/) for comprehensive guides and tutorials
- Review the [Human Wallet Documentation](https://docs.wallet.human.tech/)
- Access the [Passport Dashboard](https://developer.passport.xyz) for API keys and scorer management
