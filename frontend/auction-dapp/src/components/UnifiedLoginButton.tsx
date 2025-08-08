import { useState, useRef, useEffect } from 'react';
import { ConnectModal, useCurrentAccount, useCurrentWallet, useDisconnectWallet } from "@mysten/dapp-kit";
import { Shield, Wallet, ChevronDown, LogOut, Smartphone, Key } from 'lucide-react';
import { usePasskeyAuth } from '../hooks/usePasskeyAuth';
import { toast } from 'react-toastify';

export const UnifiedLoginButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>('0.00');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isConnectingPasskey, setIsConnectingPasskey] = useState(false);
  
  // Get connection states
  const { connectionStatus } = useCurrentWallet();
  const walletAccount = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const { isAuthenticated: isPasskeyAuthenticated, address: passkeyAddress, disconnect: disconnectPasskey, connect: connectPasskey } = usePasskeyAuth();

  const isWalletConnected = connectionStatus === 'connected' && !!walletAccount;
  const isConnected = isWalletConnected || isPasskeyAuthenticated;
  const connectedAddress = walletAccount?.address || passkeyAddress;
  const connectionType = isWalletConnected ? 'wallet' : isPasskeyAuthenticated ? 'passkey' : null;

  // Fetch wallet balance for passkey users
  const fetchWalletBalance = async (address: string) => {
    if (!address) return;
    
    setIsLoadingBalance(true);
    try {
      // Use testnet for passkey users
      const rpcUrl = 'https://fullnode.testnet.sui.io:443';
      
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'suix_getBalance',
          params: [address]
        })
      });
      
      const data = await response.json();
      if (data.result && data.result.totalBalance) {
        const balanceInMist = parseInt(data.result.totalBalance);
        const balanceInSui = (balanceInMist / 1000000000).toFixed(4);
        setWalletBalance(balanceInSui);
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      // Keep default balance of 0.00
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Helper function to get current network - hardcoded to testnet for now
  const getCurrentNetwork = () => {
    return 'testnet';
  };

  // Fetch balance when passkey user connects
  useEffect(() => {
    if (isPasskeyAuthenticated && passkeyAddress) {
      fetchWalletBalance(passkeyAddress);
    }
  }, [isPasskeyAuthenticated, passkeyAddress]);

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
    // Add delay before actually closing to ensure state updates are processed
    setTimeout(() => {
      setShowOptions(false);
      setIsClosing(false);
    }, 300); // Increased delay to ensure state updates
  };

  const handleDisconnect = () => {
    if (connectionType === 'passkey') {
      disconnectPasskey();
    } else if (connectionType === 'wallet' && disconnectWallet) {
      disconnectWallet();
    }
    handleClose();
  };

  const handleCreatePasskey = async (authenticatorType: 'platform' | 'cross-platform') => {
    setIsConnectingPasskey(true);
    try {
      const config = authenticatorType === 'platform' 
        ? { authenticatorSelection: { authenticatorAttachment: 'platform' as const } }
        : { authenticatorSelection: { authenticatorAttachment: 'cross-platform' as const } };
      
      await connectPasskey('create', config);
      toast.success(`Passkey wallet created and connected successfully using ${authenticatorType} authenticator!`);
      handleClose();
    } catch (err) {
      console.error('Passkey creation error:', err);
      if (err instanceof Error) {
        toast.error(err.message || 'Failed to create passkey');
      } else {
        toast.error('Failed to create passkey. Please try again.');
      }
    } finally {
      setIsConnectingPasskey(false);
    }
  };

  const handleRecoverPasskey = async (authenticatorType: 'platform' | 'cross-platform') => {
    setIsConnectingPasskey(true);
    try {
      const config = authenticatorType === 'platform' 
        ? { authenticatorSelection: { authenticatorAttachment: 'platform' as const } }
        : { authenticatorSelection: { authenticatorAttachment: 'cross-platform' as const } };
      
      await connectPasskey('recover', config);
      toast.success(`Passkey wallet recovered and connected successfully using ${authenticatorType} authenticator!`);
      handleClose();
    } catch (err) {
      console.error('Passkey recovery error:', err);
      if (err instanceof Error) {
        toast.error(err.message || 'Failed to recover passkey');
      } else {
        toast.error('Failed to recover passkey. Please try again.');
      }
    } finally {
      setIsConnectingPasskey(false);
    }
  };

  // Show connected state
  if (isConnected && connectedAddress) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500/90 to-emerald-600/90 backdrop-blur-md text-white px-4 py-2.5 rounded-xl hover:from-green-600/95 hover:to-emerald-700/95 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 group border border-green-400/30 backdrop-blur-sm"
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
            className="cursor-pointer hover:text-green-100 transition-colors"
            title="Click to copy address"
          >
            {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`} />
          {isCopied && (
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-lg opacity-90 shadow-lg">
              Copied!
            </span>
          )}
        </button>

        {showOptions && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-1 w-64 z-50 border border-gray-200/30 backdrop-blur-sm"
          >
            {/* Wallet Balance Section - Only for Passkey */}
            {connectionType === 'passkey' && (
              <div className="p-4 border-b border-gray-200/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Wallet Balance</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Connected</span>
                    </div>
                    <div className="px-2 py-1 bg-blue-100/80 backdrop-blur-sm rounded-full text-xs font-medium text-blue-700">
                      {getCurrentNetwork().toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">SUI Balance</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {isLoadingBalance ? (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 border border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </div>
                      ) : (
                        `${walletBalance} SUI`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">Address</span>
                    <span className="text-xs text-gray-500 font-mono">
                      {connectedAddress.slice(0, 8)}...{connectedAddress.slice(-6)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open('https://suiexplorer.com/faucet', '_blank')}
                    className="flex-1 flex justify-center gap-2 items-center text-white px-3 py-2 text-xs bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm rounded-lg font-medium hover:from-blue-700/95 hover:to-indigo-700/95 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Wallet className="h-3 w-3" />
                    Get Test SUI
                  </button>
                  <button
                    onClick={() => window.open(`https://suiscan.xyz/testnet/address/${connectedAddress}`, '_blank')}
                    className="flex-1 flex justify-center gap-2 items-center text-gray-700 px-3 py-2 text-xs bg-gray-100/80 backdrop-blur-sm rounded-lg font-medium hover:bg-gray-200/80 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Shield className="h-3 w-3" />
                    View on Explorer
                  </button>
                </div>
              </div>
            )}

            {/* Disconnect Button */}
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50/80 backdrop-blur-sm rounded-xl transition-all duration-200 text-sm font-medium"
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
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md text-white px-5 py-2.5 rounded-xl hover:from-blue-700/95 hover:to-purple-700/95 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 group border border-blue-400/30 backdrop-blur-sm"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`} />
      </button>

      {(showOptions || isClosing) && (
        <div
          ref={dropdownRef}
          className={`fixed md:absolute right-0 md:right-0 left-0 md:left-auto top-20 md:top-full mt-3 bg-white/85 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 w-full md:w-96 z-[9999] border border-gray-200/40 backdrop-blur-sm transition-all duration-300 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300/50 scrollbar-track-gray-100/50 ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          style={{
            maxHeight: 'calc(100vh - 200px)',
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db80 #f3f4f680'
          }}
        >
          {/* Learning Header - Desktop Only */}
          <div className="hidden md:block mb-6 p-4 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl border border-blue-200/40">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Choose Your Connection Method
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Passkey:</strong> Use your device's biometrics or security key for seamless, secure access.
              <br />
              <strong>Web3 Wallet:</strong> Connect your existing Sui wallet for full blockchain functionality.
            </p>
          </div>

          {/* Mobile Header - Simple */}
          <div className="md:hidden mb-4 p-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl border border-blue-200/40">
            <p className="text-xs text-gray-600 text-center mb-2 font-medium">
              Choose your preferred connection method
            </p>
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-1.5 text-blue-600 bg-blue-100/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                <Shield className="h-3 w-3" />
                <span>Passkey</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-600 bg-purple-100/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                <Wallet className="h-3 w-3" />
                <span>Wallet</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Passkey Option */}
            <div className="p-4 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-indigo-50/60 backdrop-blur-sm rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200/40 group">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gradient-to-br from-blue-500/90 to-indigo-600/90 backdrop-blur-sm rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Passkey</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Use biometrics or security key
                  </p>
                  
                  {/* Desktop: Full options */}
                  <div className="hidden md:block space-y-3">
                    <div>
                      <p className="text-sm text-gray-700 mb-3 font-semibold">Create New Passkey:</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCreatePasskey('platform')}
                          disabled={isConnectingPasskey}
                          className="flex-1 flex justify-center gap-2 items-center text-white px-4 py-2 text-sm bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm rounded-lg font-medium hover:from-blue-700/95 hover:to-indigo-700/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                          title="Use device's native passkey storage (recommended for mobile)"
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                          {isConnectingPasskey ? 'Creating...' : 'Native Device'}
                        </button>
                        <button
                          onClick={() => handleCreatePasskey('cross-platform')}
                          disabled={isConnectingPasskey}
                          className="flex-1 flex justify-center gap-2 items-center text-white px-4 py-2 text-sm bg-gradient-to-r from-gray-600/90 to-gray-700/90 backdrop-blur-sm rounded-lg font-medium hover:from-gray-700/95 hover:to-gray-800/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                          title="Use external hardware security key (YubiKey, etc.)"
                        >
                          <Key className="h-3.5 w-3.5" />
                          {isConnectingPasskey ? 'Creating...' : 'External Hardware'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 mb-3 font-semibold">Recover Existing Passkey:</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRecoverPasskey('platform')}
                          disabled={isConnectingPasskey}
                          className="flex-1 flex justify-center gap-2 items-center text-white px-4 py-2 text-sm bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm rounded-lg font-medium hover:from-blue-700/95 hover:to-indigo-700/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                          title="Recover from device's native storage"
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                          {isConnectingPasskey ? 'Recovering...' : 'Native Device'}
                        </button>
                        <button
                          onClick={() => handleRecoverPasskey('cross-platform')}
                          disabled={isConnectingPasskey}
                          className="flex-1 flex justify-center gap-2 items-center text-white px-4 py-2 text-sm bg-gradient-to-r from-gray-600/90 to-gray-700/90 backdrop-blur-sm rounded-lg font-medium hover:from-gray-700/95 hover:to-gray-800/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                          title="Recover from external hardware key"
                        >
                          <Key className="h-3.5 w-3.5" />
                          {isConnectingPasskey ? 'Recovering...' : 'External Hardware'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile: Compact options */}
                  <div className="md:hidden space-y-3">
                    <div>
                      <p className="text-sm text-gray-700 mb-2 font-semibold">Create New Passkey:</p>
                      <button
                        onClick={() => handleCreatePasskey('platform')}
                        disabled={isConnectingPasskey}
                        className="w-full flex justify-center gap-2 items-center text-white px-4 py-3 text-sm bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm rounded-xl font-medium hover:from-blue-700/95 hover:to-indigo-700/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        title="Use device's native passkey storage (recommended for mobile)"
                      >
                        <Smartphone className="h-4 w-4" />
                        {isConnectingPasskey ? 'Creating...' : 'Create with Device'}
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 mb-2 font-semibold">Recover Existing Passkey:</p>
                      <button
                        onClick={() => handleRecoverPasskey('platform')}
                        disabled={isConnectingPasskey}
                        className="w-full flex justify-center gap-2 items-center text-white px-4 py-3 text-sm bg-gradient-to-r from-gray-600/90 to-gray-700/90 backdrop-blur-sm rounded-xl font-medium hover:from-gray-700/95 hover:to-gray-800/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        title="Recover from device's native storage"
                      >
                        <Smartphone className="h-4 w-4" />
                        {isConnectingPasskey ? 'Recovering...' : 'Recover from Device'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent" />

            {/* Wallet Option */}
            <div className="p-4 hover:bg-gradient-to-r hover:from-purple-50/60 hover:to-pink-50/60 backdrop-blur-sm rounded-xl transition-all duration-200 border border-transparent hover:border-purple-200/40 group">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gradient-to-br from-purple-500/90 to-pink-600/90 backdrop-blur-sm rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Web3 Wallet</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Connect with Sui Wallet
                  </p>
                  <ConnectModal
                    trigger={
                      <button 
                        className="w-full flex justify-center gap-2 items-center text-white px-4 py-2 md:py-2 py-3 text-sm bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-xl font-medium hover:from-purple-700/95 hover:to-pink-700/95 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation(); 
                        }}
                      >
                        <Wallet className="h-3.5 md:h-3.5 h-4 w-3.5 md:w-3.5 w-4" />
                        Connect Wallet
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Help Section - Desktop Only */}
          <div className="hidden md:block mt-6 p-4 bg-gradient-to-br from-gray-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl border border-gray-200/40">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-blue-100/80 backdrop-blur-sm rounded-full">
                <Shield className="h-3 w-3 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-900 mb-2">Need Help Choosing?</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>New to Web3?</strong> Start with Passkey for a familiar experience.
                  <br />
                  <strong>Experienced user?</strong> Use Web3 Wallet for full blockchain features.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Help Section - Compact */}
          <div className="md:hidden mt-4 p-3 bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl border border-gray-200/40">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-gray-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                <Shield className="h-3 w-3" />
                <span>New to Web3?</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                <Wallet className="h-3 w-3" />
                <span>Experienced?</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
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