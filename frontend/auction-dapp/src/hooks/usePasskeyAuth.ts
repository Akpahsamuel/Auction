import { useState } from 'react';
import {
  BrowserPasskeyProvider,
  BrowserPasswordProviderOptions,
  PasskeyKeypair,
} from '@mysten/sui/keypairs/passkey';

interface PasskeyConfig {
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    requireResidentKey?: boolean;
    residentKey?: 'required' | 'preferred' | 'discouraged';
    userVerification?: 'required' | 'preferred' | 'discouraged';
  };
  timeout?: number;
}

const DEFAULT_CONFIG: PasskeyConfig = {
  authenticatorSelection: {
    authenticatorAttachment: 'platform', // Prefer native device storage
    requireResidentKey: true,
    residentKey: 'required',
    userVerification: 'preferred'
  },
  timeout: 60000
};

export const usePasskeyAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAddress = localStorage.getItem('passkeyAddress');
    return !!storedAddress;
  });
  const [keypair, setKeypair] = useState<PasskeyKeypair | null>(null);
  const [address, setAddress] = useState<string | null>(() => {
    return localStorage.getItem('passkeyAddress');
  });
  const [loading, setLoading] = useState(false);

  const connect = async (type: 'create' | 'recover' = 'recover', config: PasskeyConfig = {}) => {
    setLoading(true);
    try {
      let keypairInstance: PasskeyKeypair;
      const mergedConfig = { ...DEFAULT_CONFIG, ...config };

      const provider = new BrowserPasskeyProvider('Sui Auction Passkey', {
        rpName: 'Sui Auction Passkey',
        rpId: window.location.hostname,
        authenticatorSelection: mergedConfig.authenticatorSelection,
        timeout: mergedConfig.timeout,
      } as BrowserPasswordProviderOptions);

      if (type === 'create') {
        keypairInstance = await PasskeyKeypair.getPasskeyInstance(provider);
      } else {
        const testMessage = new TextEncoder().encode('Hello world!');
        const possiblePks = await PasskeyKeypair.signAndRecover(provider, testMessage);

        const testMessage2 = new TextEncoder().encode('Hello world 2!');
        const possiblePks2 = await PasskeyKeypair.signAndRecover(provider, testMessage2);

        const commonPk = findCommonPublicKey(possiblePks, possiblePks2);
        if (!commonPk) {
          throw new Error('Could not recover passkey. Please try again.');
        }
        keypairInstance = new PasskeyKeypair(commonPk.toRawBytes(), provider);
      }

      const publicKey = keypairInstance.getPublicKey();
      const walletAddress = publicKey.toSuiAddress();

      setKeypair(keypairInstance);
      setAddress(walletAddress);
      setIsAuthenticated(true);
      localStorage.setItem('passkeyAddress', walletAddress);

      return walletAddress;
    } catch (error) {
      console.error('Passkey connection error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const findCommonPublicKey = (pks1: any[], pks2: any[]) => {
    return pks1.find(pk1 => 
      pks2.some(pk2 => pk1.toRawBytes().toString() === pk2.toRawBytes().toString())
    );
  };

  const signTransaction = async (txBytes: Uint8Array) => {
    if (!keypair) {
      // Recover keypair if needed
      await recoverKeypair();
    }
    if (!keypair) {
      throw new Error('No passkey keypair available');
    }
    return await keypair.signTransaction(txBytes);
  };

  const signPersonalMessage = async (message: Uint8Array) => {
    if (!keypair) {
      // Recover keypair if needed
      await recoverKeypair();
    }
    if (!keypair) {
      throw new Error('No passkey keypair available');
    }
    return await keypair.signPersonalMessage(message);
  };

  const recoverKeypair = async () => {
    if (!address) return;

    try {
      const provider = new BrowserPasskeyProvider('Sui Auction Passkey', {
        rpName: 'Sui Auction Passkey',
        rpId: window.location.hostname,
        ...DEFAULT_CONFIG
      } as BrowserPasswordProviderOptions);

      const testMessage = new TextEncoder().encode('Hello world!');
      const possiblePks = await PasskeyKeypair.signAndRecover(provider, testMessage);

      const testMessage2 = new TextEncoder().encode('Hello world 2!');
      const possiblePks2 = await PasskeyKeypair.signAndRecover(provider, testMessage2);

      const commonPk = findCommonPublicKey(possiblePks, possiblePks2);
      if (!commonPk) {
        throw new Error('Could not recover passkey');
      }

      const recoveredKeypair = new PasskeyKeypair(commonPk.toRawBytes(), provider);
      setKeypair(recoveredKeypair);
    } catch (error) {
      console.error('Failed to recover keypair:', error);
      // If we can't recover the keypair, we should disconnect
      disconnect();
    }
  };

  const disconnect = () => {
    localStorage.removeItem('passkeyAddress');
    setIsAuthenticated(false);
    setKeypair(null);
    setAddress(null);
  };

  return {
    isAuthenticated,
    loading,
    address,
    connect,
    disconnect,
    signTransaction,
    signPersonalMessage,
    keypair,
  };
};

export default usePasskeyAuth; 