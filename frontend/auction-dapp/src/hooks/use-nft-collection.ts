import { useState, useCallback, useEffect } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui/client";

export interface NFTMetadata {
  objectId: string;
  type: string;
  name?: string;
  description?: string;
  image_url?: string;
  url?: string;
  display?: {
    name?: string;
    description?: string;
    image_url?: string;
    link?: string;
  };
  // Raw object data for debugging
  raw?: any;
}

export interface NFTCollectionState {
  nfts: NFTMetadata[];
  loading: boolean;
  error: string | null;
  selectedNFT: NFTMetadata | null;
}

export const useNFTCollection = () => {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  
  const [state, setState] = useState<NFTCollectionState>({
    nfts: [],
    loading: false,
    error: null,
    selectedNFT: null,
  });

  // Helper function to extract NFT metadata from object
  const extractNFTMetadata = (obj: SuiObjectData): NFTMetadata | null => {
    if (!obj.objectId || !obj.type) return null;

    const metadata: NFTMetadata = {
      objectId: obj.objectId,
      type: obj.type,
    };

    // Try to extract metadata from content fields
    if (obj.content && obj.content.dataType === 'moveObject' && 'fields' in obj.content) {
      const fields = obj.content.fields as any;
      
      // Common NFT field patterns
      if (fields.name) metadata.name = fields.name;
      if (fields.description) metadata.description = fields.description;
      if (fields.image_url) metadata.image_url = fields.image_url;
      if (fields.url) metadata.url = fields.url;
      
      // Handle display fields (common in Sui NFTs)
      if (fields.display) {
        metadata.display = {
          name: fields.display.fields?.name || fields.display.name,
          description: fields.display.fields?.description || fields.display.description,
          image_url: fields.display.fields?.image_url || fields.display.image_url,
          link: fields.display.fields?.link || fields.display.link,
        };
      }

      // Handle nested metadata structures
      if (fields.metadata) {
        const metadataFields = fields.metadata.fields || fields.metadata;
        if (metadataFields.name) metadata.name = metadataFields.name;
        if (metadataFields.description) metadata.description = metadataFields.description;
        if (metadataFields.image_url) metadata.image_url = metadataFields.image_url;
      }
    }

    // Fallback to display data if available
    if (obj.display && typeof obj.display === 'object') {
      const display = obj.display as any;
      if (display.name) metadata.name = display.name;
      if (display.description) metadata.description = display.description;
      if (display.image_url) metadata.image_url = display.image_url;
    }

    return metadata;
  };

  // Filter function to identify NFT-like objects
  const isLikelyNFT = (obj: SuiObjectData): boolean => {
    if (!obj.type) return false;
    
    // Skip system objects and coins
    const systemTypes = [
      '0x2::coin::Coin',
      '0x2::coin::TreasuryCap',
      '0x2::package::UpgradeCap',
      '0x2::kiosk::Kiosk',
      '0x2::kiosk::KioskOwnerCap',
      '0x2::transfer_policy::TransferPolicy',
      '0x2::transfer_policy::TransferPolicyCap',
      '0x2::display::Display',
      '0x2::sui::SUI',
    ];

    // Check if it's a system type
    for (const systemType of systemTypes) {
      if (obj.type.includes(systemType)) {
        return false;
      }
    }

    // Skip auction house objects
    if (obj.type.includes('auction_house::')) {
      return false;
    }

    // Skip admin capabilities
    if (obj.type.includes('::admin::')) {
      return false;
    }

    // If it has display data, it's likely an NFT
    if (obj.display) {
      return true;
    }

    // Check if it has common NFT fields in content
    if (obj.content && obj.content.dataType === 'moveObject' && 'fields' in obj.content) {
      const fields = obj.content.fields as any;
      if (fields.name || fields.image_url || fields.display) {
        return true;
      }
    }

    // If the type suggests it's a custom NFT (not a system object), include it
    return !obj.type.startsWith('0x2::');
  };

  // Fetch user's NFT collection
  const fetchNFTCollection = useCallback(async () => {
    if (!currentAccount?.address) {
      setState(prev => ({ ...prev, nfts: [], loading: false, error: null }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log("🎨 === FETCHING USER NFT COLLECTION ===");
      console.log("User address:", currentAccount.address);

      // Get all objects owned by the user with pagination
      let allObjects: any[] = [];
      let cursor: string | null = null;
      let hasNextPage = true;

      while (hasNextPage) {
        const ownedObjectsResponse = await client.getOwnedObjects({
          owner: currentAccount.address,
          options: {
            showContent: true,
            showType: true,
            showDisplay: true,
            showOwner: true,
          },
          cursor: cursor,
        });

        allObjects.push(...ownedObjectsResponse.data);
        cursor = ownedObjectsResponse.nextCursor || null;
        hasNextPage = ownedObjectsResponse.hasNextPage;
      }

      console.log("📦 Total owned objects:", allObjects.length);

      // Filter and process NFT-like objects
      const nftObjects = allObjects
        .filter(obj => obj.data && isLikelyNFT(obj.data))
        .map(obj => obj.data!)
        .map(extractNFTMetadata)
        .filter((nft): nft is NFTMetadata => nft !== null);

      console.log("🎨 Filtered NFTs:", nftObjects.length);

      setState(prev => ({ 
        ...prev, 
        nfts: nftObjects, 
        loading: false, 
        error: null 
      }));

    } catch (error) {
      console.error("❌ Error fetching NFT collection:", error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch NFTs" 
      }));
    }
  }, [currentAccount?.address, client]);

  // Select an NFT for auction creation
  const selectNFT = useCallback((nft: NFTMetadata | null) => {
    setState(prev => ({ ...prev, selectedNFT: nft }));
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedNFT: null }));
  }, []);

  // Refresh collection
  const refreshCollection = useCallback(() => {
    fetchNFTCollection();
  }, [fetchNFTCollection]);

  // Auto-fetch on account change
  useEffect(() => {
    fetchNFTCollection();
  }, [fetchNFTCollection]);

  return {
    nfts: state.nfts,
    loading: state.loading,
    error: state.error,
    selectedNFT: state.selectedNFT,
    selectNFT,
    clearSelection,
    refreshCollection,
    hasNFTs: state.nfts.length > 0,
  };
}; 