"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit";
import { Search, Wallet, Menu, X } from "lucide-react";
import { Button } from "@radix-ui/themes";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/20 backdrop-blur-md border-b border-[#006fee]/20">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold gradient-text">
              Preditor
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline  gap-3">
              <Link
                to="/"
                className="text-black hover:text-purple-300 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/auctions"
                className="text-black hover:text-purple-300 transition-colors"
              >
                Auctions
              </Link>
              <Link
                to="/create"
                className="text-black hover:text-purple-300 transition-colors"
              >
                Create
              </Link>
              <Link
                to="/my-auctions"
                className="text-black hover:text-purple-300 transition-colors"
              >
                My Auctions
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="1"
              className="!p-3 hover:bg-gray-200 !rounded-full !cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </Button>
            <button className="bg-[#006fee] !px-4 !py-2 rounded-2xl text-white font-semibold cursor-pointer hover:opacity-80 transition-all duration-300 flex justify-center gap-2 items-center">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/40 backdrop-blur-md rounded-lg mt-2">
              <Link
                to="/"
                className="block px-3 py-2 text-white hover:text-purple-300"
              >
                Home
              </Link>
              <Link
                to="/auctions"
                className="block px-3 py-2 text-white hover:text-purple-300"
              >
                Auctions
              </Link>
              <Link
                to="/create"
                className="block px-3 py-2 text-white hover:text-purple-300"
              >
                Create
              </Link>
              <Link
                to="/my-auctions"
                className="block px-3 py-2 text-white hover:text-purple-300"
              >
                My Auctions
              </Link>
              <div className="px-3 py-2">
                <ConnectButton
                  onClick={() => console.log("Button Clicked")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
