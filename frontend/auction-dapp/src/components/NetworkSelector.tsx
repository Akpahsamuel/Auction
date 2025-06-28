import React, { useState, useRef, useEffect } from 'react';
import { useNetworkSelection, SuiNetwork } from '../hooks/use-network-selection';
import { ChevronDown, Globe, Wifi, WifiOff, Loader2, ExternalLink, Check } from 'lucide-react';

interface NetworkSelectorProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({ 
  className = '', 
  showLabel = true,
  compact = false
}) => {
  const {
    selectedNetwork,
    switchNetwork,
    getAvailableNetworks,
    hasFaucet,
    isLoading,
    networkConfig,
  } = useNetworkSelection();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const availableNetworks = getAvailableNetworks();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNetworkIcon = (network: SuiNetwork) => {
    switch (network) {
      case 'mainnet':
        return <Globe className="h-4 w-4 text-emerald-500" />;
      case 'testnet':
        return <Wifi className="h-4 w-4 text-blue-500" />;
      case 'devnet':
        return <Wifi className="h-4 w-4 text-amber-500" />;
      case 'localnet':
        return <WifiOff className="h-4 w-4 text-slate-500" />;
      default:
        return <Globe className="h-4 w-4 text-slate-500" />;
    }
  };

  const getNetworkColors = (network: SuiNetwork) => {
    switch (network) {
      case 'mainnet':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500',
          hover: 'hover:bg-emerald-100'
        };
      case 'testnet':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          dot: 'bg-blue-500',
          hover: 'hover:bg-blue-100'
        };
      case 'devnet':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          dot: 'bg-amber-500',
          hover: 'hover:bg-amber-100'
        };
      case 'localnet':
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-500',
          hover: 'hover:bg-slate-100'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-500',
          hover: 'hover:bg-slate-100'
        };
    }
  };

  const handleNetworkSwitch = async (network: SuiNetwork) => {
    setIsOpen(false);
    if (network !== selectedNetwork) {
      await switchNetwork(network);
    }
  };

  const selectedColors = getNetworkColors(selectedNetwork);

  if (compact) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        {/* Compact Network Selector Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className={`
            relative flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm
            bg-white/80 backdrop-blur-sm border border-gray-200/50
            hover:bg-white hover:border-gray-300 hover:shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
            transition-all duration-200 ease-out
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
          ) : (
            <>
              <div className={`w-2 h-2 rounded-full ${selectedColors.dot}`} />
              {getNetworkIcon(selectedNetwork)}
            </>
          )}
          <span className="text-slate-700 hidden sm:inline">
            {networkConfig.displayName}
          </span>
          <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Compact Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200/50 backdrop-blur-sm z-50">
            <div className="p-2">
              {availableNetworks.map((network) => {
                const isSelected = network === selectedNetwork;
                const networkHasFaucet = hasFaucet(network);
                const colors = getNetworkColors(network);
                
                return (
                  <button
                    key={network}
                    type="button"
                    onClick={() => handleNetworkSwitch(network)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg text-left
                      transition-all duration-150 ease-out
                      ${isSelected 
                        ? `${colors.bg} ${colors.text} ${colors.border} border` 
                        : `hover:bg-slate-50 text-slate-700 border border-transparent ${colors.hover}`
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                      {getNetworkIcon(network)}
                      <div>
                        <div className="font-medium">
                          {network.charAt(0).toUpperCase() + network.slice(1)}
                        </div>
                        <div className="text-xs opacity-70 mt-0.5">
                          {network === 'mainnet' && 'Production network'}
                          {network === 'testnet' && 'Test environment'}
                          {network === 'devnet' && 'Development network'}
                          {network === 'localnet' && 'Local environment'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {networkHasFaucet && (
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">
                          Faucet
                        </span>
                      )}
                      {isSelected && (
                        <Check className="h-4 w-4 text-current" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Faucet Link */}
            {hasFaucet(selectedNetwork) && networkConfig.faucetUrl && (
              <div className="border-t border-gray-100 p-3">
                <a
                  href={networkConfig.faucetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Get test SUI from faucet
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {showLabel && (
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Network
        </label>
      )}
      
      {/* Full Network Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`
          relative w-full flex items-center justify-between p-4 rounded-xl
          bg-white border-2 border-gray-200/50 text-left
          hover:border-gray-300 hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
          transition-all duration-200 ease-out
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          ) : (
            <>
              <div className={`w-3 h-3 rounded-full ${selectedColors.dot}`} />
              {getNetworkIcon(selectedNetwork)}
            </>
          )}
          <div>
            <div className="font-semibold text-slate-900">
              {networkConfig.displayName}
            </div>
            <div className="text-sm text-slate-500 mt-0.5">
              {selectedNetwork === 'mainnet' && 'Production network with real assets'}
              {selectedNetwork === 'testnet' && 'Test network for development and testing'}
              {selectedNetwork === 'devnet' && 'Development network with latest features'}
              {selectedNetwork === 'localnet' && 'Local development environment'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasFaucet(selectedNetwork) && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              Faucet Available
            </span>
          )}
          <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Full Network Options Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200/50 backdrop-blur-sm">
          <div className="p-2">
            {availableNetworks.map((network) => {
              const isSelected = network === selectedNetwork;
              const networkHasFaucet = hasFaucet(network);
              const colors = getNetworkColors(network);
              
              return (
                <button
                  key={network}
                  type="button"
                  onClick={() => handleNetworkSwitch(network)}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-lg text-left
                    transition-all duration-150 ease-out
                    ${isSelected 
                      ? `${colors.bg} ${colors.text} ${colors.border} border-2` 
                      : `hover:bg-slate-50 text-slate-700 border-2 border-transparent ${colors.hover}`
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                    {getNetworkIcon(network)}
                    <div>
                      <div className="font-semibold">
                        {network.charAt(0).toUpperCase() + network.slice(1)}
                      </div>
                      <div className="text-sm opacity-70 mt-0.5">
                        {network === 'mainnet' && 'Production network with real assets'}
                        {network === 'testnet' && 'Test network for development and testing'}
                        {network === 'devnet' && 'Development network with latest features'}
                        {network === 'localnet' && 'Local development environment'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {networkHasFaucet && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        Faucet
                      </span>
                    )}
                    {isSelected && (
                      <Check className="h-5 w-5 text-current" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Faucet Link */}
          {hasFaucet(selectedNetwork) && networkConfig.faucetUrl && (
            <div className="border-t border-gray-100 p-4">
              <a
                href={networkConfig.faucetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Get test SUI from faucet
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 