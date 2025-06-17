# NFT Claiming Solution

## Problem
You were getting a Move abort error (error code 4 = `EAuctionStillActive`) when trying to claim NFTs after the creator had already claimed the proceeds.

## Root Cause
The Move contract has **two different functions** for claiming NFTs, but the frontend was only using one:

1. **`claim_nft`** - Claims NFT immediately after auction ends (one-step process)
2. **`claim_nft_after_creator_claim`** - Claims NFT after creator has already claimed proceeds

## Solution Implemented

### 1. Added New Hook Function
- Added `claimNftAfterCreatorClaim` function to `use-bid.ts`
- This calls the correct Move function when creator has already claimed proceeds

### 2. Smart Claim Logic in Frontend
- Updated `handleClaimNft` in the auction view to automatically detect auction status
- Uses `auction.status === "Claimed"` to determine which function to call
- Automatically chooses the correct claiming method

### 3. Improved User Interface
- Added claim status indicator showing "Creator Paid" vs "Pending Payment"
- Dynamic button text: "Claim NFT" vs "Claim NFT & Pay Creator"
- Clear explanations of what each action does

### 4. Enhanced Debug Information
- Added auction status logging
- Shows which claiming method will be used
- Helps troubleshoot claiming issues

## How It Works Now

### Scenario 1: Winner Claims First (Normal Flow)
1. Auction ends
2. Winner clicks "Claim NFT & Pay Creator"
3. Uses `claim_nft` function
4. NFT transfers to winner, payment goes to creator (minus 1% fee)

### Scenario 2: Creator Claims First (After Grace Period)
1. Auction ends
2. Creator waits for grace period (30 minutes)
3. Creator clicks "Claim Proceeds" 
4. Auction status becomes "Claimed"
5. Winner clicks "Claim NFT"
6. Uses `claim_nft_after_creator_claim` function
7. NFT transfers to winner (payment already handled)

## Files Modified
- `frontend/auction-dapp/src/hooks/use-bid.ts` - Added new claim function
- `frontend/auction-dapp/src/pages/main/auctions/view/index.tsx` - Smart claim logic and UI improvements

## Testing
- Build successful ✅
- Both claiming methods now available ✅
- Dynamic UI based on auction status ✅
- Enhanced debugging information ✅

The claiming functionality should now work correctly in both scenarios! 