"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit";
import { Search, Wallet, Menu, X } from "lucide-react";
import { Button } from "@radix-ui/themes";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = useLocation();
  return (
    <nav className="sticky top-0 w-full z-50 bg-white/20 backdrop-blur-md border-b border-[#006fee]/10">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold gradient-text">
              NFTVerse
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline gap-5">
              {[
                {
                  title: "Home",
                  route: "/",
                },
                {
                  title: "Auctions",
                  route: "/auctions",
                },
                {
                  title: "Create",
                  route: "/create",
                },
                {
                  title: "My Auctions",
                  route: "/my-auctions",
                },
              ].map((nav) => (
                <Link
                  to={nav.route}
                  key={nav.route}
                  className={`text-sm hover:text-purple-300 transition-all duration-300 ${nav.route === pathname.pathname ? "text-[#006fee] font-semibold" : "text-black"}`}
                >
                  {nav.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <Button
              variant="ghost"
              size="1"
              className="!p-3 hover:bg-gray-200 !rounded-full !cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </Button>
            <ConnectButton
              connectText={
                <span className="flex justify-center gap-2 items-center !text-white !px-2 !py-1">
                  <Wallet className="h-4 w-4 mr-2" color="#ffffff" />
                  Connect Wallet
                </span>
              }
              className="!bg-[#006fee] !rounded-2xl !font-semibold cursor-pointer hover:opacity-80 transition-all duration-300"
            />
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
              {[
                {
                  title: "Home",
                  route: "/",
                },
                {
                  title: "Auctions",
                  route: "/auctions",
                },
                {
                  title: "Create",
                  route: "/create",
                },
                {
                  title: "My Auctions",
                  route: "/my-auctions",
                },
              ].map((nav) => (
                <Link
                  to={nav.route}
                  key={nav.route}
                  className={`text-sm hover:text-purple-300 transition-all duration-300 ${nav.route === pathname.pathname ? "text-[#006fee] font-semibold" : "text-black"}`}
                >
                  {nav.title}
                </Link>
              ))}
              <div className="px-3 py-2">
                <ConnectButton
                  connectText={
                    <span className="flex justify-center gap-2 items-center !text-white !px-2 !py-1">
                      <Wallet className="h-4 w-4 mr-2" color="#ffffff" />
                      Connect Wallet
                    </span>
                  }
                  className="!bg-[#006fee] !rounded-2xl !font-semibold cursor-pointer hover:opacity-80 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
