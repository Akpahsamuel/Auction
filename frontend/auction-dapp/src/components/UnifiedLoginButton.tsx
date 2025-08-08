import { useState, useRef, useEffect } from 'react';
import { ConnectModal, useCurrentAccount, useCurrentWallet, useDisconnectWallet } from "@mysten/dapp-kit";
import { Shield, Wallet, ChevronDown, LogOut } from 'lucide-react';
import { PasskeyConnectButton } from './PasskeyConnectButton';
import { usePasskeyAuth } from '../hooks/usePasskeyAuth';
import { toast } from 'react-toastify';

export const UnifiedLoginButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  
  // Get connection states
  const { connectionStatus } = useCurrentWallet();
  const walletAccount = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const { isAuthenticated: isPasskeyAuthenticated, address: passkeyAddress, disconnect: disconnectPasskey } = usePasskeyAuth();

  const isWalletConnected = connectionStatus === 'connected' && !!walletAccount;
  const isConnected = isWalletConnected || isPasskeyAuthenticated;
  const connectedAddress = walletAccount?.address || passkeyAddress;
  const connectionType = isWalletConnected ? 'wallet' : isPasskeyAuthenticated ? 'passkey' : null;

  const copyAddress = async () => {
    if (connectedAddress) {
      await navigator.clipboard.writeText(connectedAddress);
      setIsCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && 
          buttonRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle connection status changes
  useEffect(() => {
    if (isConnected) {
      // Add a small delay before closing to ensure UI updates
      setTimeout(() => {
        setShowOptions(false);
      }, 500);
    }
  }, [isConnected]);

  const handleClose = () => {
    // Set closing state to prevent immediate hide
    setIsClosing(true);
    // Add delay before actually closing
    setTimeout(() => {
      setShowOptions(false);
      setIsClosing(false);
    }, 200);
  };

  const handleDisconnect = () => {
    if (connectionType === 'passkey') {
      disconnectPasskey();
    } else if (connectionType === 'wallet' && disconnectWallet) {
      disconnectWallet();
    }
    handleClose();
  };

  // Show connected state
  if (isConnected && connectedAddress) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium border border-green-200 group"
        >
          {connectionType === 'passkey' ? (
            <Shield className="h-4 w-4" />
          ) : (
            <Wallet className="h-4 w-4" />
          )}
          <span 
            onClick={(e) => {
              e.stopPropagation();
              copyAddress();
            }}
            className="cursor-pointer hover:text-green-800"
            title="Click to copy address"
          >
            {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
          {isCopied && (
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-75">
              Copied!
            </span>
          )}
        </button>

        {showOptions && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-1 w-40 z-50 border border-gray-100"
          >
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  // Show connect options
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
      </button>

      {(showOptions || isClosing) && (
        <div
          ref={dropdownRef}
          className={`absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl p-4 w-80 z-50 border border-gray-100 transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="space-y-4">
            {/* Passkey Option */}
            <div className="p-3 hover:bg-blue-50 rounded-lg transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Passkey</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Use biometrics or security key
                  </p>
                  <PasskeyConnectButton 
                    onConnect={handleClose}
                    className="w-full flex-col gap-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Wallet Option */}
            <div className="p-3 hover:bg-purple-50 rounded-lg transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Wallet className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Web3 Wallet</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Connect with Sui Wallet
                  </p>
                  <ConnectModal
                    trigger={
                      <button 
                        className="w-full flex justify-center gap-2 items-center text-white px-3 py-1.5 text-sm bg-purple-600 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation(); 
                        }}
                      >
                        <Wallet className="h-3.5 w-3.5" />
                        Connect Wallet
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400">
              By connecting, you agree to our Terms of Service
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedLoginButton; 