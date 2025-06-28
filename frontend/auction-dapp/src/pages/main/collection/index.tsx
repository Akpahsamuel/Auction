import React from "react";
import { NFTCollection } from "../../../components/NFTCollection";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Package, Wallet } from "lucide-react";

const CollectionPage: React.FC = () => {
  const currentAccount = useCurrentAccount();

  if (!currentAccount) {
    return (
      <div className="container py-10 flex flex-col gap-10 md:gap-20">
        <div className="w-full flex flex-col items-center justify-center gap-8 py-20">
          <Wallet className="h-20 w-20 text-gray-300" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Wallet Not Connected</h2>
            <p className="text-gray-600">Please connect your wallet to view your NFT collection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="w-full flex flex-col items-start justify-start gap-4">
        <div className="w-full flex flex-col justify-between md:flex-row gap-6 md:items-center">
          <div>
            <h1 className="font-semibold text-3xl">
              <span className="gradient-text">My NFT</span> Collection
            </h1>
            <p className="text-gray-500 mt-2">
              Browse your NFT collection and manage your digital assets
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>Wallet: {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-4)}</span>
          </div>
        </div>
      </div>

      {/* NFT Collection */}
      <div className="w-full">
        <NFTCollection 
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
        />
      </div>

      {/* Information Section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Quick Tip</h3>
          <p className="text-blue-700 text-sm">
            Want to auction one of your NFTs? Head over to the 
            <span className="font-medium"> Create Auction </span>
            page and select from your collection instead of manually entering the NFT ID!
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-2">🔍 What you see</h3>
          <p className="text-green-700 text-sm">
            This collection shows all NFT-like objects in your wallet, excluding system objects and coins. 
            If an NFT doesn't appear, it might be in a different format or kiosk.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage; 