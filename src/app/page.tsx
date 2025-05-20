'use client'
import RootStyle from '@/components/RootStyle'
import { passportApiKey, passportScorerId } from '@/config'
import { useToast } from '@/hooks/useToast'
import { useHumanWalletStore } from '@/store/useHumanWalletStore'
import { LightTheme, PassportScoreWidget } from '@passportxyz/passport-embed'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

if (!passportApiKey || !passportScorerId) {
  throw new Error('Passport API key or scorer ID is not set')
}

export default function Home() {
  const [showPassport, setShowPassport] = useState(false)

  const notify = useToast()

  const {
    address,
    isConnected,
    chainId,
    walletName,
    login,
    switchChain,
    signMessage,
  } = useHumanWalletStore()

  // // Listen for chain changes
  // useEffect(() => {
  //   if (window.silk) {
  //     const handleChainChanged = (chainId: string) => {
  //       console.log('Chain changed in page (RPC):', chainId)
  //       const chainIdNumber = parseInt(chainId, 16)
  //       console.log('Parsed chain ID in page (RPC):', chainIdNumber)
  //     }

  //     window.silk.on('chainChanged', handleChainChanged)

  //     window.silk
  //       .request({
  //         method: 'wallet_switchEthereumChain',
  //         params: [{ chainId: '0x1' }],
  //       })
  //       .then((res: unknown) => {
  //         console.log('wallet_switchEthereumChain', res)
  //       })

  //     return () => {
  //       window.silk.removeListener('chainChanged', handleChainChanged)
  //     }
  //   }
  // }, [])

  // ? Silk Wallet test
  // useEffect(() => {
  //   try {
  //     const provider = initSilk({
  //       useStaging: true,
  //       config: {
  //         allowedSocials: ['google', 'twitter', 'discord', 'github'],
  //         authenticationMethods: ['email', 'phone', 'wallet', 'social'],
  //       },
  //     })
  //     // // @ts-ignore
  //     // const provider = window.ethereum
  //     window.silk = provider
  //     window.silk
  //       .request({
  //         method: 'eth_requestAccounts',
  //       })
  //       .then((accounts: any) => {
  //         console.log('accounts --------------', accounts)
  //       })
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }, [])

  console.log({
    address,
    isConnected,
    chainId,
    walletName,
  })

  // // Add effect to handle chain switching
  // useEffect(() => {
  //   const switchToMainnet = async () => {
  //     if (isHumanWalletConnected && chainId !== mainnet.id) {
  //       try {
  //         console.log(
  //           'Current chain:',
  //           chainId,
  //           'Switching to mainnet:',
  //           mainnet.id
  //         )
  //         await switchChain({ chainId: mainnet.id })
  //         console.log('Successfully switched to mainnet')
  //       } catch (error) {
  //         const errorMessage =
  //           error instanceof Error ? error.message : 'An unknown error occurred'
  //         notify('error', errorMessage)
  //       }
  //     }
  //   }

  //   switchToMainnet()
  // }, [isHumanWalletConnected, chainId, switchChain, notify])

  const generateSignature = async (message: string) => {
    try {
      if (!address) {
        notify('error', 'No wallet connected')
        throw new Error('No wallet connected')
      }

      // Check if we're on a supported chain 
      if (Number(chainId) !== 1) {
        notify('info', 'Switching to Ethereum Mainnet...')
        try {
          await switchChain(1)
          // Wait for chain switch to complete
          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error) {
          notify(
            'error',
            'Please switch to Ethereum Mainnet in your wallet to continue. You can do this manually in your wallet settings.'
          )
          throw new Error('Unsupported network')
        }
      }

      const signature = await signMessage(message)
      return signature
    } catch (error) {
      console.error('Error signing message:', error)
      if (error instanceof Error) {
        notify('error', 'Failed to sign message. Please try again.')
      }
      throw error
    }
  }

  const handleClickHumanTech = () => {
    window.open('https://human.tech/', '_blank', 'noopener,noreferrer')
  }

  const handleLogin = async () => {
    try {
      await login()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred'
      notify('error', errorMessage)
    }
  }

  return (
    <>
      {/* <ChainSwitcher /> */}

      <RootStyle>
        {showPassport ? (
          <>
            <div className='grid grid-rows-3 h-full'>
              <div className=''></div>
              <div className='flex justify-center items-center'>
                <PassportScoreWidget
                  apiKey={passportApiKey || ''}
                  scorerId={passportScorerId || ''}
                  address={address}
                  // connectWalletCallback={handleLogin}
                  generateSignatureCallback={generateSignature}
                  theme={LightTheme}
                />
              </div>
              <div className='self-end px-[20px] py-[10px]'>
                <motion.button
                  className='flex h-[44px] px-[20px] py-[10px] justify-center items-center gap-[8px] self-stretch rounded-[8px] bg-[#0A0A0A] text-white font-[Suisse Intl] text-[16px] font-medium leading-[24px] w-full mt-6 mb-2 cursor-pointer'
                  onClick={() => setShowPassport(false)}
                  whileHover={{
                    backgroundColor: '#422A05',
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{
                    scale: 0.98,
                    backgroundColor: '#422A05',
                    transition: { duration: 0.1 },
                  }}>
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-2'>
                    <path
                      d='M19 12H5'
                      stroke='#fff'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M12 19L5 12L12 5'
                      stroke='#fff'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  Back
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Top hero image section */}
            <div className='relative w-full h-[298px]'>
              <Image
                src='/assets/svg/hero.svg'
                alt='Human Tech Hero'
                fill
                className='object-cover rounded-3xl'
                priority
              />

              <motion.div
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-[72px] bg-[rgba(2,0,0,0.2)] backdrop-blur-[25px] py-3 px-7 text-white flex items-center cursor-pointer'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                  backgroundColor: 'rgba(5,5,5,0.3)',
                }}
                whileTap={{
                  scale: 0.95,
                  backgroundColor: 'rgba(10,10,10,0.4)',
                  transition: { duration: 0.1 },
                }}
                onClick={handleClickHumanTech}>
                <motion.img
                  src='/assets/svg/logo.svg'
                  alt='human.tech logo'
                  className='mr-2'
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </div>

            {/* Main content section */}
            <div className='p-8 text-left'>
              <div className='flex items-start justify-between mb-2'>
                <h1 className='text-black font-pp-hatton text-[48px] font-semibold leading-[60px] tracking-[-0.96px] text-left'>
                  Welcome,
                  <br />
                  Human
                </h1>
                {/* <Image
                  src='/assets/svg/verified-human.svg'
                  alt='Verified Human'
                  width={100}
                  height={100}
                /> */}
              </div>

              <div className='flex items-center justify-between gap-2'>
                <p className='text-[#0A0A0A] font-suisse text-[16px] font-medium leading-[24px]'>
                  Begin by verifying your humanity
                </p>
                {/* <Image
                  src='/assets/svg/arrow.svg'
                  alt='Arrow down'
                  width={20}
                  height={20}
                /> */}
              </div>

              <motion.button
                className='flex h-[44px] px-[20px] py-[10px] justify-center items-center gap-[8px] self-stretch rounded-[8px] bg-[#0A0A0A] text-white font-[Suisse Intl] text-[16px] font-medium leading-[24px] w-full mt-10 cursor-pointer'
                onClick={() => {
                  // handleLogin()
                  // return
                  if (isConnected) {
                    setShowPassport(true)
                  } else {
                    handleLogin()
                  }
                }}
                whileHover={{
                  backgroundColor: '#422A05',
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                whileTap={{
                  scale: 0.98,
                  backgroundColor: '#422A05',
                  transition: { duration: 0.1 },
                }}>
                <Image
                  src='/assets/svg/user.svg'
                  alt='User icon'
                  width={24}
                  height={24}
                  className='mr-3'
                />
                {isConnected ? 'Verify Humanity' : 'Connect Wallet'}
              </motion.button>
            </div>
          </>
        )}
      </RootStyle>
    </>
  )
}
