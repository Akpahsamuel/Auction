import { useState, useCallback } from "react";
import { SuiClient, getFullnodeUrl, SuiObjectData } from "@mysten/sui/client";
import { useSuiClient } from "@mysten/dapp-kit";
import { getCurrentPackageId, getCurrentAuctionRegistry } from "../contants";
import { Transaction } from "@mysten/sui/transactions";

export interface AuctionHistoryData {
  id: string;
  originalAuctionId: string;
  creator: string;
  title: string;
  description: string;
  startingBid: number;
  finalBid: number;
  winner: string;
  startTime: number;
  endTime: number;
  completionTime: number;
  totalBids: number;
  uniqueBidders: number;
  nftId: string;
  nftType: string;
  nftName: string;
  nftDescription: string;
  nftImageUrl: string;
}

export interface BidEntry {
  bidder: string;
  amount: number;
  timestamp: number;
}

export interface BidderInfo {
  totalBidAmount: number;
  bidCount: number;
  highestBid: number;
  latestBidTime: number;
}

export const useAuctionHistory = () => {
  const client = useSuiClient(); // Use the same client as the dApp configuration
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all auction history objects
  const getAllAuctionHistory = useCallback(async (): Promise<SuiObjectData[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // First, get the registry object to extract the auction_histories table ID
      const registryObjectResponse = await client.getObject({
        id: getCurrentAuctionRegistry(),
        options: { showContent: true },
      });

      if (
        !registryObjectResponse.data ||
        registryObjectResponse.data.content?.dataType !== "moveObject" ||
        !registryObjectResponse.data.content.fields
      ) {
        console.error("AuctionRegistry object not found or content not accessible.");
        return [];
      }

      // Extract the ID of the auction_histories table from the registry object's fields
      const historyTableId = (registryObjectResponse.data.content.fields as any)
        .auction_histories?.fields?.id?.id;

      if (!historyTableId) {
        console.log("No auction histories table found in registry.");
        return [];
      }

      console.log("Found auction histories table ID:", historyTableId);

      // Get dynamic fields from the auction_histories table
      const fieldsResponse = await client.getDynamicFields({
        parentId: historyTableId,
      });

      console.log("Dynamic fields found:", fieldsResponse);

      if (!fieldsResponse.data || fieldsResponse.data.length === 0) {
        console.log("No auction histories found in the registry.");
        return [];
      }

      // Get the auction history object IDs from the dynamic field values
      const historyObjectIds: string[] = [];
      
      for (const field of fieldsResponse.data) {
        try {
          // Get the dynamic field object to extract the value (auction history object ID)
          const fieldObject = await client.getObject({
            id: field.objectId,
            options: {
              showContent: true,
            }
          });

          if (fieldObject.data?.content && "fields" in fieldObject.data.content) {
            const fieldFields = fieldObject.data.content.fields as any;
            if (fieldFields.value) {
              historyObjectIds.push(fieldFields.value);
            }
          }
        } catch (error) {
          console.error(`Error fetching dynamic field ${field.objectId}:`, error);
        }
      }

      console.log("History object IDs found:", historyObjectIds);

      if (historyObjectIds.length === 0) {
        console.log("No history object IDs found");
        return [];
      }

      // Get all auction history objects
      const historyObjects = await Promise.all(
        historyObjectIds.map(async (id: string) => {
          try {
            const response = await client.getObject({
              id,
              options: {
                showContent: true,
                showType: true,
              }
            });
            return response.data;
          } catch (error) {
            console.error(`Error fetching history object ${id}:`, error);
            return null;
          }
        })
      );

      const validHistoryObjects = historyObjects.filter((obj): obj is SuiObjectData => obj !== null);
      console.log("Valid auction history objects:", validHistoryObjects);
      return validHistoryObjects;
    } catch (err) {
      console.error("Error fetching auction history:", err);
      setError("Failed to fetch auction history");
      return [];
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Get auction history by object ID
  const getAuctionHistoryById = useCallback(async (historyId: string): Promise<AuctionHistoryData | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await client.getObject({
        id: historyId,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (!response.data?.content || response.data.content.dataType !== "moveObject") {
        console.log("No auction history found or invalid content");
        return null;
      }

      const fields = response.data.content.fields as any;
      console.log("Auction history fields:", fields);

      return {
        id: fields.id.id,
        originalAuctionId: fields.original_auction_id,
        creator: fields.creator,
        title: fields.title,
        description: fields.description,
        startingBid: Number(fields.starting_bid) / 1_000_000_000, // Convert MIST to SUI
        finalBid: Number(fields.final_bid) / 1_000_000_000, // Convert MIST to SUI
        winner: fields.winner,
        startTime: Number(fields.start_time),
        endTime: Number(fields.end_time),
        completionTime: Number(fields.completion_time),
        totalBids: Number(fields.total_bids),
        uniqueBidders: Number(fields.unique_bidders),
        nftId: fields.nft_id,
        nftType: fields.nft_type,
        nftName: fields.nft_name,
        nftDescription: fields.nft_description,
        nftImageUrl: fields.nft_image_url,
      };
    } catch (err) {
      console.error("Error fetching auction history by ID:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Get bid history from auction history
  const getAuctionHistoryBids = useCallback(async (historyId: string): Promise<BidEntry[]> => {
    try {
      const result = await client.devInspectTransactionBlock({
        transactionBlock: (() => {
          const tx = new Transaction();
          tx.moveCall({
            target: `${getCurrentPackageId()}::auct::get_history_bid_history`,
            arguments: [tx.object(historyId)],
          });
          return tx;
        })(),
        sender: "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      // Parse the bid history result
      // Note: This would need proper parsing based on the actual return format
      console.log("Bid history result:", result);
      return [];
    } catch (err) {
      console.error("Error fetching bid history:", err);
      return [];
    }
  }, [client]);

  // Get bidder info from auction history
  const getAuctionHistoryBidderInfo = useCallback(async (historyId: string, bidderAddress: string): Promise<BidderInfo | null> => {
    try {
      const result = await client.devInspectTransactionBlock({
        transactionBlock: (() => {
          const tx = new Transaction();
          tx.moveCall({
            target: `${getCurrentPackageId()}::auct::get_auction_history_bidder_info`,
            arguments: [
              tx.object(historyId),
              tx.pure.address(bidderAddress),
            ],
          });
          return tx;
        })(),
        sender: "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      if (result.results?.[0]?.returnValues) {
        const [totalBidAmount, bidCount, highestBid, latestBidTime] = result.results[0].returnValues;
        
        return {
          totalBidAmount: Number(new DataView(new Uint8Array(totalBidAmount[0]).buffer).getBigUint64(0, true)) / 1_000_000_000,
          bidCount: Number(new DataView(new Uint8Array(bidCount[0]).buffer).getBigUint64(0, true)),
          highestBid: Number(new DataView(new Uint8Array(highestBid[0]).buffer).getBigUint64(0, true)) / 1_000_000_000,
          latestBidTime: Number(new DataView(new Uint8Array(latestBidTime[0]).buffer).getBigUint64(0, true)),
        };
      }
      return null;
    } catch (err) {
      console.error("Error fetching bidder info:", err);
      return null;
    }
  }, [client]);

  // Get registry statistics including completed auction count
  const getRegistryStats = useCallback(async (): Promise<{ totalAuctions: number; completedAuctions: number; feeBalance: number; treasuryAddress: string } | null> => {
    try {
      const result = await client.devInspectTransactionBlock({
        transactionBlock: (() => {
          const tx = new Transaction();
          tx.moveCall({
            target: `${getCurrentPackageId()}::auct::get_registry_stats`,
            arguments: [tx.object(getCurrentAuctionRegistry())],
          });
          return tx;
        })(),
        sender: "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      if (result.results?.[0]?.returnValues) {
        const [auctionCount, completedAuctionCount, feeBalance, treasuryAddress] = result.results[0].returnValues;
        
        return {
          totalAuctions: Number(new DataView(new Uint8Array(auctionCount[0]).buffer).getBigUint64(0, true)),
          completedAuctions: Number(new DataView(new Uint8Array(completedAuctionCount[0]).buffer).getBigUint64(0, true)),
          feeBalance: Number(new DataView(new Uint8Array(feeBalance[0]).buffer).getBigUint64(0, true)) / 1_000_000_000,
          treasuryAddress: "0x" + Array.from(new Uint8Array(treasuryAddress[0]))
            .map(b => b.toString(16).padStart(2, '0'))
            .join(''),
        };
      }
      return null;
    } catch (err) {
      console.error("Error fetching registry stats:", err);
      return null;
    }
  }, [client]);

  return {
    getAllAuctionHistory,
    getAuctionHistoryById,
    getAuctionHistoryBids,
    getAuctionHistoryBidderInfo,
    getRegistryStats,
    loading,
    error,
  };
}; 