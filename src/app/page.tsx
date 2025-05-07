'use client'
import Image from 'next/image'
import { useState } from 'react'
import RootStyle from '@/components/RootStyle'
import {
  DarkTheme,
  LightTheme,
  PassportScoreWidget,
} from '@passportxyz/passport-embed'
import { motion } from 'framer-motion'
import { passportApiKey, passportScorerId } from '@/config'
import { useAccount, useConnect, useSignMessage } from 'wagmi'

if (!passportApiKey || !passportScorerId) {
  throw new Error('Passport API key or scorer ID is not set')
}

export default function Home() {
  const [showPassport, setShowPassport] = useState(false)
  const { address } = useAccount()
  const { connect, connectors } = useConnect()
  const { signMessageAsync } = useSignMessage()

  const connectWallet = async () => {
    try {
      const walletConnectConnector = connectors.find(
        (connector) => connector.name === 'WalletConnect'
      )
      if (!walletConnectConnector) {
        throw new Error('WalletConnect not available')
      }
      await connect({ connector: walletConnectConnector })
      return address
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet')
      throw error
    }
  }

  const generateSignature = async (message: string) => {
    try {
      if (!address) {
        throw new Error('No wallet connected')
      }
      const signature = await signMessageAsync({ message: message })
      return signature
    } catch (error) {
      console.error('Error signing message:', error)
      alert('Failed to sign message')
      throw error
    }
  }

  const handleClickHumanTech = () => {
    window.open('https://human.tech/', '_blank', 'noopener,noreferrer')
  }

  const handleVerifyClick = () => {
    setShowPassport(true)
  }

  return (
    <>
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
                  // collapseMode="shift"
                  connectWalletCallback={async () => {
                    const addr = await connectWallet()
                    // setAddress(addr)
                  }}
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
                <Image
                  src='/assets/svg/verified-human.svg'
                  alt='Verified Human'
                  width={100}
                  height={100}
                />
              </div>

              <div className='flex items-center justify-between  gap-2'>
                <p className='text-[#0A0A0A] font-suisse text-[16px] font-medium leading-[24px]'>
                  Begin by verifying your humanity to get a cool badge
                </p>
                <Image
                  src='/assets/svg/arrow.svg'
                  alt='Arrow down'
                  width={20}
                  height={20}
                />
              </div>

              <motion.button
                className='flex h-[44px] px-[20px] py-[10px] justify-center items-center gap-[8px] self-stretch rounded-[8px] bg-[#0A0A0A] text-white font-[Suisse Intl] text-[16px] font-medium leading-[24px] w-full mt-4 cursor-pointer'
                onClick={handleVerifyClick}
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
                Verify Humanity
              </motion.button>
            </div>
          </>
        )}
      </RootStyle>
    </>
  )
}
