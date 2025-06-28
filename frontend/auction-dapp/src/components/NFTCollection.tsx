import React from "react";
import { useNFTCollection, NFTMetadata } from "../hooks/use-nft-collection";
import { RefreshCw, Image as ImageIcon, Package, CheckCircle2 } from "lucide-react";

interface NFTCardProps {
  nft: NFTMetadata;
  isSelected: boolean;
  onSelect: (nft: NFTMetadata) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, isSelected, onSelect }) => {
  // Get the best available name
  const getName = () => {
    return nft.display?.name || nft.name || `NFT ${nft.objectId.slice(0, 8)}...`;
  };

  // Get the best available description
  const getDescription = () => {
    return nft.display?.description || nft.description || "No description available";
  };

  // Get the best available image URL
  const getImageUrl = () => {
    return nft.display?.image_url || nft.image_url || nft.url || "";
  };

  const imageUrl = getImageUrl();
  const hasImage = !!imageUrl;

  return (
    <div
      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onSelect(nft)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      )}

      {/* NFT Image */}
      <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        {hasImage ? (
          <img
            src={imageUrl}
            alt={getName()}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`flex flex-col items-center justify-center text-gray-400 ${hasImage ? 'hidden' : ''}`}>
          <ImageIcon className="h-8 w-8 mb-2" />
          <span className="text-xs">No Image</span>
        </div>
      </div>

      {/* NFT Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm truncate" title={getName()}>
          {getName()}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-2" title={getDescription()}>
          {getDescription()}
        </p>
        <div className="text-xs text-gray-500">
          <p className="truncate" title={nft.objectId}>
            ID: {nft.objectId.slice(0, 8)}...{nft.objectId.slice(-4)}
          </p>
          <p className="truncate" title={nft.type}>
            Type: {nft.type.split('::').pop() || nft.type}
          </p>
        </div>
      </div>
    </div>
  );
};

interface NFTCollectionProps {
  onNFTSelect?: (nft: NFTMetadata | null) => void;
  selectedNFTId?: string;
  className?: string;
}

export const NFTCollection: React.FC<NFTCollectionProps> = ({
  onNFTSelect,
  selectedNFTId,
  className = "",
}) => {
  const {
    nfts,
    loading,
    error,
    selectedNFT,
    selectNFT,
    refreshCollection,
    hasNFTs,
  } = useNFTCollection();

  // Handle NFT selection
  const handleNFTSelect = (nft: NFTMetadata) => {
    const newSelection = selectedNFT?.objectId === nft.objectId ? null : nft;
    selectNFT(newSelection);
    onNFTSelect?.(newSelection);
  };

  // Determine which NFT is selected (either from internal state or external prop)
  const getSelectedNFTId = () => {
    return selectedNFTId || selectedNFT?.objectId;
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your NFT collection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-800">Error Loading NFTs</h3>
            <button
              onClick={refreshCollection}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={refreshCollection}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hasNFTs) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <div className="flex flex-col items-center">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No NFTs Found</h3>
            <p className="text-gray-500 mb-4 max-w-md">
              You don't have any NFTs in your wallet yet. Create or acquire some NFTs to start auctioning them!
            </p>
            <button
              onClick={refreshCollection}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Your NFT Collection</h2>
          <p className="text-gray-600">Select an NFT to auction ({nfts.length} found)</p>
        </div>
        <button
          onClick={refreshCollection}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          title="Refresh Collection"
        >
          <RefreshCw className="h-5 w-5" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Selected NFT Info */}
      {selectedNFT && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Selected NFT</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {selectedNFT.display?.image_url || selectedNFT.image_url ? (
                <img
                  src={selectedNFT.display?.image_url || selectedNFT.image_url}
                  alt={selectedNFT.display?.name || selectedNFT.name || "NFT"}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-800">
                {selectedNFT.display?.name || selectedNFT.name || `NFT ${selectedNFT.objectId.slice(0, 8)}...`}
              </p>
              <p className="text-sm text-blue-600">
                {selectedNFT.objectId.slice(0, 8)}...{selectedNFT.objectId.slice(-4)}
              </p>
            </div>
            <button
              onClick={() => handleNFTSelect(selectedNFT)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* NFT Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {nfts.map((nft) => (
          <NFTCard
            key={nft.objectId}
            nft={nft}
            isSelected={getSelectedNFTId() === nft.objectId}
            onSelect={handleNFTSelect}
          />
        ))}
      </div>

      {/* Debug Info (only in development) */}
      {import.meta.env.DEV && selectedNFT && (
        <details className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <summary className="cursor-pointer font-medium text-gray-700">
            Debug: Selected NFT Details
          </summary>
          <pre className="mt-2 text-xs text-gray-600 overflow-auto">
            {JSON.stringify(selectedNFT, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}; 