import { useState } from 'react';
import { toast } from 'react-toastify';
import { Shield, Key } from 'lucide-react';
import { usePasskeyAuth } from '../hooks/usePasskeyAuth';

interface PasskeyConnectButtonProps {
  onConnect?: (address: string) => void;
  className?: string;
}

export const PasskeyConnectButton = ({ onConnect, className = '' }: PasskeyConnectButtonProps) => {
  const { isAuthenticated, address, connect, disconnect, loading } = usePasskeyAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleCreatePasskey = async () => {
    setIsConnecting(true);
    try {
      const walletAddress = await connect('create');
      onConnect?.(walletAddress);
      toast.success('Passkey wallet created and connected successfully!');
    } catch (err) {
      console.error('Passkey creation error:', err);
      
      // Handle specific error cases
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          toast.error('Permission denied. Please ensure Bluetooth is enabled and try again.');
        } else if (err.name === 'SecurityError') {
          toast.error('Security error. Please ensure you\'re using HTTPS and try again.');
        } else if (err.name === 'AbortError') {
          toast.error('Connection timed out. Please try again.');
        } else if (err.name === 'NotSupportedError') {
          toast.error('Your device or browser doesn\'t support passkeys. Please try a different browser.');
        } else {
          toast.error(err.message || 'Failed to create passkey');
        }
      } else {
        toast.error('Failed to create passkey. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRecoverPasskey = async () => {
    setIsConnecting(true);
    try {
      const walletAddress = await connect('recover');
      onConnect?.(walletAddress);
      toast.success('Passkey wallet recovered and connected successfully!');
    } catch (err) {
      console.error('Passkey recovery error:', err);
      
      // Handle specific error cases
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          toast.error('Permission denied. Please ensure Bluetooth is enabled and try again.');
        } else if (err.name === 'SecurityError') {
          toast.error('Security error. Please ensure you\'re using HTTPS and try again.');
        } else if (err.name === 'AbortError') {
          toast.error('Connection timed out. Please try again.');
        } else if (err.name === 'NotSupportedError') {
          toast.error('Your device or browser doesn\'t support passkeys. Please try a different browser.');
        } else {
          toast.error(err.message || 'Failed to recover passkey');
        }
      } else {
        toast.error('Failed to recover passkey. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  if (isAuthenticated && address) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleCreatePasskey}
        disabled={loading || isConnecting}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        <Key className="h-4 w-4" />
        {isConnecting ? 'Creating...' : 'Create Passkey'}
      </button>
      
      <button
        onClick={handleRecoverPasskey}
        disabled={loading || isConnecting}
        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        <Shield className="h-4 w-4" />
        {isConnecting ? 'Recovering...' : 'Recover Passkey'}
      </button>
    </div>
  );
};

export default PasskeyConnectButton; 