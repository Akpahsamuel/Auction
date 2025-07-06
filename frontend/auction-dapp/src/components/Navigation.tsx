"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit";
import { Search, Menu, X, Wallet } from "lucide-react";
import { Button } from "@radix-ui/themes";
import { NetworkSelector } from "./NetworkSelector";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = useLocation();

  const navigationItems = [
    {
      title: "Home",
      route: "/",
    },
    {
      title: "Auctions",
      route: "/auctions",
    },
    {
      title: "History",
      route: "/auction-history",
    },
    {
      title: "Create",
      route: "/create",
    },
    {
      title: "Collection",
      route: "/collection",
    },
    {
      title: "Admin",
      route: "/admin",
    },
  ];

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkg46-HkEO2ygjNfEJTA11Vdx-HLoVDiVk_Q&s"
              alt=""
              className="w-8 h-8 rounded-full border border-blue-400 p-1"
            />
            <Link
              to="/"
              className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity"
            >
              Predator
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center gap-3">
              {navigationItems.map((nav) => {
                const isActive = nav.route === pathname.pathname;
                return (
                  <Link
                    to={nav.route}
                    key={nav.route}
                    className={`
                      relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ease-out
                      ${
                        isActive
                          ? "text-[#006fee] bg-blue-50/80 shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"
                      }
                    `}
                  >
                    {nav.title}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-[#006fee] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Network Selector */}
            <div className="min-w-[180px]">
              <NetworkSelector
                showLabel={false}
                compact={true}
                className="text-sm"
              />
            </div>

            <Button
              variant="ghost"
              size="1"
              className="!p-3 hover:bg-slate-100 !rounded-full !cursor-pointer transition-colors"
            >
              <Search className="h-4 w-4 text-slate-600" />
            </Button>

            <ConnectButton
              connectText={
                <span className="flex justify-center gap-2 items-center !text-white !px-4 !py-2">
                  <Wallet className="h-4 w-4" color="#ffffff" />
                  Connect Wallet
                </span>
              }
              className="!bg-[#006fee] !rounded-xl !font-semibold cursor-pointer hover:!bg-[#0056cc] transition-all duration-200 shadow-sm"
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="!p-2 hover:bg-slate-100 !rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-slate-700" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navigationItems.map((nav) => {
                  const isActive = nav.route === pathname.pathname;
                  return (
                    <Link
                      to={nav.route}
                      key={nav.route}
                      onClick={() => setIsMenuOpen(false)}
                      className={`
                        block px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                        ${
                          isActive
                            ? "text-[#006fee] bg-blue-50 border border-blue-100"
                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{nav.title}</span>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-[#006fee]" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Network Selector */}
              <div className="pt-4 border-t border-gray-200/50">
                <NetworkSelector
                  showLabel={true}
                  compact={false}
                  className="text-sm"
                />
              </div>

              {/* Mobile Connect Button */}
              <div className="pt-4">
                <ConnectButton
                  connectText={
                    <span className="flex justify-center gap-2 items-center !text-white !px-4 !py-3 w-full">
                      <Wallet className="h-4 w-4" color="#ffffff" />
                      Connect Wallet
                    </span>
                  }
                  className="!bg-[#006fee] !rounded-xl !font-semibold cursor-pointer hover:!bg-[#0056cc] transition-all duration-200 shadow-sm w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
