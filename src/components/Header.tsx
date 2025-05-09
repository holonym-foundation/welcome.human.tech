'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { useHumanWalletStore } from '@/store/useHumanWalletStore'
type WalletDisplayProps = {
  address?: string
  isConnected: boolean
  walletIcon: string
  networkIcon?: string
  onClick?: () => void
  onDisconnect?: () => void
  walletType: 'human'
}

const WalletDisplay: React.FC<WalletDisplayProps> = ({
  address,
  isConnected,
  walletIcon,
  networkIcon,
  onClick,
  onDisconnect,
  walletType,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleClick = () => {
    setShowDropdown(!showDropdown)
  }

  const handleCopyAddress = () => {
    if (address) {
      // Copy the address to clipboard
      navigator.clipboard.writeText(address)

      // Show the "Copied!" tooltip
      setCopied(true)

      // Hide the tooltip after 2 seconds
      setTimeout(() => {
        setCopied(false)
        // Only close dropdown after tooltip is hidden
        setShowDropdown(false)
      }, 2000)
    }
  }

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect()
    }
    setShowDropdown(false)
  }

  if (!isConnected) return null

  return (
    <div className='relative' ref={dropdownRef}>
      <div
        className='flex pr-[8px] justify-center items-center gap-[12px] rounded-[8px] border border-[#D4D4D4] bg-white cursor-pointer hover:shadow-md transition-shadow duration-200'
        onClick={handleClick}
        data-tooltip-id={`tooltip-${walletType}`}>
        <Image src={walletIcon} alt='Wallet' width={32} height={32} />
        {networkIcon && (
          <Image src={networkIcon} alt='Network' width={20} height={20} />
        )}
        <span className='text-sm font-medium'>
          {address
            ? `${address.substring(0, 6)}...${address.substring(
                address.length - 4
              )}`
            : ''}
        </span>
        <Image
          src='/assets/svg/drop-down-logo.svg'
          alt='Dropdown'
          width={24}
          height={24}
        />
      </div>

      {showDropdown && (
        <div className='absolute right-0 mt-2 shadow-lg z-10 min-w-[180px] py-2  rounded-[12px] border border-[#D4D4D4] bg-white '>
          <div
            className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer relative transition-colors duration-150 hover:bg-latest-grey-300'
            onClick={handleCopyAddress}>
            <div></div>
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M8 9H6C4.89543 9 4 9.89543 4 11V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeDasharray='0.2 4'
                strokeDashoffset='2'
              />
              <rect
                x='8'
                y='3'
                width='12'
                height='12'
                rx='2'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
          </div>
          <div
            className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500 transition-colors duration-150 hover:bg-latest-grey-300'
            onClick={handleDisconnect}>
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M16 17L21 12M21 12L16 7M21 12H9'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M9 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21H9'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>Disconnect</span>
          </div>
        </div>
      )}
    </div>
  )
}

const Header = () => {
  const {
    address: humanWalletAddress,
    isConnected: isHumanWalletConnected,
    chainId: humanWalletChainId,
    login,
    logout,
    loginSelector,
    initializeProvider,
  } = useHumanWalletStore()

  return (
    <header className='w-full px-4 pt-3 flex justify-end items-center relative bg-gray-100'>
      {/* <div className='flex-shrink-0'>
        <Link
          href='/'
          className='hover:opacity-80 transition-opacity duration-200'>
          <Image
            src='/assets/svg/human.tech.logo.svg'
            alt='human.tech'
            width={120}
            height={30}
          />
        </Link>
      </div> */}

      {/* Desktop Navigation */}
      <div className='flex gap-6 items-center'>
        <div className='flex items-center gap-3'>
          <WalletDisplay
            address={humanWalletAddress}
            isConnected={isHumanWalletConnected}
            // walletIcon='/assets/svg/humantechsymbollogo.svg'
            walletIcon='/assets/svg/silk-logo.svg'
            networkIcon='/assets/svg/network-logo.svg'
            onDisconnect={logout}
            walletType='human'
          />
        </div>
      </div>
    </header>
  )
}

export default Header
