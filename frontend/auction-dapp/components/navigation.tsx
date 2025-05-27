"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ConnectButton } from '@mysten/dapp-kit'
import { Search, Wallet, Menu, X } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold gradient-text">
              Preditor
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-white hover:text-purple-300 transition-colors">
                Home
              </Link>
              <Link href="/auctions" className="text-white hover:text-purple-300 transition-colors">
                Auctions
              </Link>
              <Link href="/create" className="text-white hover:text-purple-300 transition-colors">
                Create
              </Link>
              <Link href="/my-auctions" className="text-white hover:text-purple-300 transition-colors">
                My Auctions
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/40 backdrop-blur-md rounded-lg mt-2">
              <Link href="/" className="block px-3 py-2 text-white hover:text-purple-300">
                Home
              </Link>
              <Link href="/auctions" className="block px-3 py-2 text-white hover:text-purple-300">
                Auctions
              </Link>
              <Link href="/create" className="block px-3 py-2 text-white hover:text-purple-300">
                Create
              </Link>
              <Link href="/my-auctions" className="block px-3 py-2 text-white hover:text-purple-300">
                My Auctions
              </Link>
              <div className="px-3 py-2">
                <ConnectButton onClick={() => (console.log('Button Clicked'))}className="w-full bg-gradient-to-r from-purple-600 to-pink-600" />
                  
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
