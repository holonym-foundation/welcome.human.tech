'use client'
import RootStyle from '@/components/RootStyle'
import {
  passportApiKey,
  passportScorerId,
  passportScoreThreshold,
} from '@/config'
import { useToast } from '@/hooks/useToast'
import { useHumanWalletStore } from '@/store/useHumanWalletStore'
import { LightTheme, PassportScoreWidget } from '@passportxyz/passport-embed'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { usePassportScore } from '@/hooks/usePassportScore'

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

  const { data: passportData, isLoading, error } = usePassportScore()

  const showCheckMark = passportData?.score
    ? Number(passportData.score) >= passportScoreThreshold
    : false

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

            {showCheckMark ? (
              <>
                <div className='flex flex-col items-center justify-center gap-4 p-4'>
                  <img
                    src='/assets/svg/VerifiedCheck.svg'
                    alt='Verified Human'
                    width={78}
                    height={78}
                  />
                  <h1 className='text-black font-pp-hatton text-[48px] font-semibold leading-[60px] tracking-[-0.96px] text-center'>
                    Humanity
                    <br />
                    Verified
                  </h1>

                  <motion.button
                    className='flex h-[44px] px-[20px] py-[10px] justify-center items-center gap-[8px] self-stretch rounded-[8px] bg-[#F5F5F5] text-[#0A0A0A] font-[Suisse Intl] text-[16px] font-medium leading-[24px] w-full cursor-pointer'
                    onClick={() => {
                      window.open(
                        'https://human.tech',
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }}
                    whileHover={{
                      backgroundColor: '#E5E5E5',
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{
                      scale: 0.98,
                      backgroundColor: '#E5E5E5',
                      transition: { duration: 0.1 },
                    }}>
                    Check out benefits
                    <Image
                      src='/assets/svg/link-arrow.svg'
                      alt='link arrow'
                      width={24}
                      height={24}
                      className='mr-3'
                    />
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                {/* Main content section */}
                <div className='p-8 text-left'>
                  <div className='flex items-center justify-between mb-2'>
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
                    <Image
                      src='/assets/svg/arrow.svg'
                      alt='Arrow down'
                      width={20}
                      height={20}
                    />
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
          </>
        )}
      </RootStyle>
    </>
  )
}
