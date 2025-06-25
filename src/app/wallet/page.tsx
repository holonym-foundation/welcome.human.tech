'use client'
import RootStyle from '@/components/RootStyle'
import { useToast } from '@/hooks/useToast'
import { useHumanWalletStore } from '@/store/useHumanWalletStore'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

export default function WalletPage() {
  const [message, setMessage] = useState('Hello from Human Wallet!')
  const [signature, setSignature] = useState('')
  const [isSigningMessage, setIsSigningMessage] = useState(false)

  const notify = useToast()

  const {
    address,
    isConnected,
    chainId,
    walletName,
    login,
    logout,
    switchChain,
    signMessage,
  } = useHumanWalletStore()

  const handleLogin = async () => {
    try {
      await login()
      notify('success', 'Wallet connected successfully!')
    } catch (error) {
      console.log('Login error:', error)
      notify('error', 'Failed to connect wallet')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setSignature('')
      notify('success', 'Wallet disconnected')
    } catch (error) {
      console.log('Logout error:', error)
      notify('error', 'Failed to disconnect wallet')
    }
  }

  const handleSignMessage = async () => {
    if (!message.trim()) {
      notify('error', 'Please enter a message to sign')
      return
    }

    setIsSigningMessage(true)
    try {
      const sig = await signMessage(message)
      setSignature(sig)
      notify('success', 'Message signed successfully!')
    } catch (error) {
      console.log('Sign message error:', error)
      notify('error', 'Failed to sign message')
    } finally {
      setIsSigningMessage(false)
    }
  }

  const handleSwitchChain = async (targetChainId: number) => {
    try {
      await switchChain(targetChainId)
      notify('success', `Switched to chain ${targetChainId}`)
    } catch (error) {
      console.log('Switch chain error:', error)
      notify('error', `Failed to switch to chain ${targetChainId}`)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    notify('success', `${label} copied to clipboard`)
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <RootStyle>
      <div className='flex flex-col h-full p-6 space-y-6 overflow-auto scrollbar-hide'>
        {/* Header Section */}
        <motion.div
          className='text-center space-y-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <div className='flex justify-center'>
            <Image
              src='/assets/svg/logo.svg'
              alt='Human.tech logo'
              width={120}
              height={40}
              className='mb-4'
            />
          </div>
          <h1 className='text-black font-pp-hatton text-[32px] font-semibold leading-[40px] tracking-[-0.64px]'>
            Human Wallet Showcase
          </h1>
          <p className='text-gray-600 text-[16px] leading-[24px] max-w-md mx-auto'>
            Experience seamless Web3 interactions with Human Wallet&apos;s
            powerful SDK
          </p>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}>
          <h2 className='text-[20px] font-semibold mb-4'>Wallet Status</h2>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isConnected
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {isConnected && (
              <>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Address:</span>
                  <button
                    onClick={() => copyToClipboard(address, 'Address')}
                    className='text-blue-600 hover:text-blue-800 font-mono text-sm cursor-pointer'>
                    {truncateAddress(address)}
                  </button>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Chain ID:</span>
                  <span className='font-mono text-sm'>{chainId}</span>
                </div>

                {walletName && (
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>Wallet:</span>
                    <span className='text-sm'>{walletName}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* Wallet Actions */}
        <motion.div
          className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          <h2 className='text-[20px] font-semibold mb-4'>Wallet Actions</h2>

          {!isConnected ? (
            <motion.button
              className='w-full h-[44px] px-[20px] py-[10px] bg-black text-white rounded-[8px] font-medium cursor-pointer'
              onClick={handleLogin}
              whileHover={{ backgroundColor: '#333', scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              Connect Human Wallet
            </motion.button>
          ) : (
            <div className='space-y-4'>
              {/* Chain Switching */}
              <div>
                <h3 className='text-[16px] font-medium mb-2'>Switch Network</h3>
                <div className='grid grid-cols-2 gap-2'>
                  <motion.button
                    className={`px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer ${
                      chainId === 1
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSwitchChain(1)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    Ethereum (1)
                  </motion.button>
                  <motion.button
                    className={`px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer ${
                      chainId === 137
                        ? 'bg-purple-50 border-purple-200 text-purple-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSwitchChain(137)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    Polygon (137)
                  </motion.button>
                </div>
              </div>

              {/* Message Signing */}
              <div>
                <h3 className='text-[16px] font-medium mb-2'>Sign Message</h3>
                <div className='space-y-3'>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Enter message to sign...'
                    className='w-full p-3 border border-gray-200 rounded-lg resize-none h-20 text-sm'
                  />
                  <motion.button
                    className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                    onClick={handleSignMessage}
                    disabled={isSigningMessage || !message.trim()}
                    whileHover={
                      !isSigningMessage
                        ? { backgroundColor: '#2563eb', scale: 1.02 }
                        : {}
                    }
                    whileTap={!isSigningMessage ? { scale: 0.98 } : {}}>
                    {isSigningMessage ? 'Signing...' : 'Sign Message'}
                  </motion.button>
                </div>

                {signature && (
                  <div className='mt-3 p-3 bg-gray-50 rounded-lg'>
                    <p className='text-sm font-medium text-gray-700 mb-1'>
                      Signature:
                    </p>
                    <button
                      onClick={() => copyToClipboard(signature, 'Signature')}
                      className='text-xs font-mono text-gray-600 hover:text-gray-800 break-all cursor-pointer'>
                      {signature}
                    </button>
                  </div>
                )}
              </div>

              {/* Disconnect */}
              <motion.button
                className='w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium cursor-pointer'
                onClick={handleLogout}
                whileHover={{ backgroundColor: '#dc2626', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                Disconnect Wallet
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </RootStyle>
  )
}
