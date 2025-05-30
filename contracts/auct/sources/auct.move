module auct::auction_house {
    use std::string::{Self, String};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::clock::{Self, Clock};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::vec_map::{Self, VecMap};

    // Error codes
    const EAuctionNotActive: u64 = 0;
    const EAuctionEnded: u64 = 1;
    const EBidTooLow: u64 = 2;
    const ENotAuctionCreator: u64 = 3;
    const EAuctionStillActive: u64 = 4;
    const EInsufficientPayment: u64 = 6;
    const EMinimumBidIncrement: u64 = 8;
    const ESelfBidding: u64 = 9;

    // Constants
    const FEE_PERCENTAGE: u64 = 1; // 1% fee
    const PERCENTAGE_BASE: u64 = 100;
    const MIN_BID_INCREMENT: u64 = 1_000_000; // 0.001 SUI minimum increment
    const MIST_PER_SUI: u64 = 1_000_000_000; // 1 SUI = 1,000,000,000 MIST

    // Auction status enum
    public enum AuctionStatus has copy, drop, store {
        Active,
        Ended,
        Claimed,
    }

    // Main auction house capability
    public struct AuctionHouseCap has key {
        id: UID,
        fee_balance: Balance<SUI>,
    }

    // Generic NFT wrapper to hold any object with key ability
    public struct NFTWrapper<T: key + store> has key, store {
        id: UID,
        nft: T,
    }

    // Individual auction struct
    public struct Auction<T: key + store> has key, store {
        id: UID,
        creator: address,
        title: String,
        description: String,
        starting_bid: u64,
        current_bid: u64,
        highest_bidder: address,
        start_time: u64,
        end_time: u64,
        status: AuctionStatus,
        bid_count: u64,
        // NFT being auctioned (wrapped)
        nft: NFTWrapper<T>,
        // Bid tracking
        bid_history: vector<BidEntry>,
        bidder_info: VecMap<address, BidderInfo>,
        unique_bidders: u64,
        // Bid storage for refunds
        stored_bids: VecMap<address, Balance<SUI>>,
        // Current highest bid balance
        highest_bid_balance: Balance<SUI>,
    }

    // Bid history entry
    public struct BidEntry has store, drop, copy {
        bidder: address,
        amount: u64,
        timestamp: u64,
    }

    // Bidder info for leaderboard
    public struct BidderInfo has store, drop, copy {
        total_bid_amount: u64,
        bid_count: u64,
        highest_bid: u64,
        latest_bid_time: u64,
    }

    // Auction registry to track all auctions
    public struct AuctionRegistry has key {
        id: UID,
        auctions: Table<object::ID, bool>, // auction_id -> is_active
        auction_count: u64,
        // Fee collection
        fee_balance: Balance<SUI>,
        treasury_address: address,
    }

    // Events
    public struct AuctionCreated has copy, drop {
        auction_id: object::ID,
        creator: address,
        title: String,
        starting_bid: u64,
        end_time: u64,
        nft_type: String,
    }

    public struct BidPlaced has copy, drop {
        auction_id: object::ID,
        bidder: address,
        bid_amount: u64,
        timestamp: u64,
    }

    public struct AuctionEnded has copy, drop {
        auction_id: object::ID,
        winner: address,
        winning_bid: u64,
        total_bids: u64,
    }

    public struct AuctionClaimed has copy, drop {
        auction_id: object::ID,
        winner: address,
        final_amount: u64,
        fee_collected: u64,
    }

    public struct BidderLeaderboard has copy, drop {
        auction_id: object::ID,
        bidder: address,
        total_bid_amount: u64,
        bid_count: u64,
        highest_bid: u64,
        latest_bid_time: u64,
    }

    // Initialize the auction house
    fun init(ctx: &mut tx_context::TxContext) {
        let auction_house_cap = AuctionHouseCap {
            id: object::new(ctx),
            fee_balance: balance::zero<SUI>(),
        };

        let registry = AuctionRegistry {
            id: object::new(ctx),
            auctions: table::new<object::ID, bool>(ctx),
            auction_count: 0,
            fee_balance: balance::zero<SUI>(),
            treasury_address: tx_context::sender(ctx), // Initial deployer as treasury
        };

        transfer::transfer(auction_house_cap, tx_context::sender(ctx));
        transfer::share_object(registry);
    }

    // Create a new NFT auction - the creator deposits their NFT
    public entry fun create_auction<T: key + store>(
        registry: &mut AuctionRegistry,
        nft: T,
        title: vector<u8>,
        description: vector<u8>,
        starting_bid: u64,
        duration_ms: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        let end_time = current_time + duration_ms;

        // Wrap the NFT
        let nft_wrapper = NFTWrapper {
            id: object::new(ctx),
            nft,
        };

        let auction = Auction {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            title: string::utf8(title),
            description: string::utf8(description),
            starting_bid,
            current_bid: starting_bid * MIST_PER_SUI, // Convert to smallest unit (MIST)
            highest_bidder: tx_context::sender(ctx),
            start_time: current_time,
            end_time,
            status: AuctionStatus::Active,
            bid_count: 0,
            nft: nft_wrapper,
            bid_history: vector::empty<BidEntry>(),
            bidder_info: vec_map::empty<address, BidderInfo>(),
            unique_bidders: 0,
            stored_bids: vec_map::empty<address, Balance<SUI>>(),
            highest_bid_balance: balance::zero<SUI>(),
        };

        let auction_id = object::id(&auction);
        
        // Add to registry
        table::add(&mut registry.auctions, auction_id, true);
        registry.auction_count = registry.auction_count + 1;

        // Emit event
        event::emit(AuctionCreated {
            auction_id,
            creator: tx_context::sender(ctx),
            title: auction.title,
            starting_bid,
            end_time,
            nft_type: string::utf8(b"Generic NFT"),
        });

        transfer::share_object(auction);
    }

    // Place a bid on an auction
    public entry fun place_bid<T: key + store>(
        auction: &mut Auction<T>,
        bid_amount: u64,
        bid_payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        let bidder = tx_context::sender(ctx);
        let bid_amount_mist = bid_amount * MIST_PER_SUI; // Convert bid amount to MIST
        let payment_amount = coin::value(&bid_payment);

        // Check if auction is still active
        assert!(matches(&auction.status, &AuctionStatus::Active), EAuctionNotActive);
        assert!(current_time < auction.end_time, EAuctionEnded);
        
        // Prevent self-bidding
        assert!(bidder != auction.creator, ESelfBidding);
        
        // Check if bid is higher than current bid with minimum increment
        assert!(bid_amount_mist > auction.current_bid, EBidTooLow);
        assert!(bid_amount_mist >= auction.current_bid + MIN_BID_INCREMENT, EMinimumBidIncrement);
        
        // Check if payment covers the bid amount
        assert!(payment_amount >= bid_amount_mist, EInsufficientPayment);

        // Handle refund of previous highest bidder (if there was a previous bid)
        if (auction.bid_count > 0) {
            let previous_bidder = auction.highest_bidder;
            
            // Refund the previous highest bid
            if (balance::value(&auction.highest_bid_balance) > 0) {
                let refund_coin = coin::from_balance(
                    balance::withdraw_all(&mut auction.highest_bid_balance),
                    ctx
                );
                transfer::public_transfer(refund_coin, previous_bidder);
            };
        };

        // Convert payment to balance and extract only the bid amount
        let mut payment_balance = coin::into_balance(bid_payment);
        let bid_balance = balance::split(&mut payment_balance, bid_amount_mist);
        
        // Store the bid amount
        balance::join(&mut auction.highest_bid_balance, bid_balance);
        
        // Return any excess payment to the bidder as change
        if (balance::value(&payment_balance) > 0) {
            let change_coin = coin::from_balance(payment_balance, ctx);
            transfer::public_transfer(change_coin, bidder);
        } else {
            balance::destroy_zero(payment_balance);
        };

        // Update auction state
        auction.current_bid = bid_amount_mist;
        auction.highest_bidder = bidder;
        auction.bid_count = auction.bid_count + 1;

        // Create bid entry for history
        let bid_entry = BidEntry {
            bidder,
            amount: bid_amount_mist,
            timestamp: current_time,
        };
        
        // Add to bid history
        vector::push_back(&mut auction.bid_history, bid_entry);

        // Update bidder info
        if (vec_map::contains(&auction.bidder_info, &bidder)) {
            let bidder_info = vec_map::get_mut(&mut auction.bidder_info, &bidder);
            bidder_info.total_bid_amount = bidder_info.total_bid_amount + bid_amount_mist;
            bidder_info.bid_count = bidder_info.bid_count + 1;
            if (bid_amount_mist > bidder_info.highest_bid) {
                bidder_info.highest_bid = bid_amount_mist;
            };
            bidder_info.latest_bid_time = current_time;
        } else {
            let new_bidder_info = BidderInfo {
                total_bid_amount: bid_amount_mist,
                bid_count: 1,
                highest_bid: bid_amount_mist,
                latest_bid_time: current_time,
            };
            vec_map::insert(&mut auction.bidder_info, bidder, new_bidder_info);
            auction.unique_bidders = auction.unique_bidders + 1;
        };

        // Emit event
        event::emit(BidPlaced {
            auction_id: object::id(auction),
            bidder,
            bid_amount: bid_amount_mist,
            timestamp: current_time,
        });
    }

    // Helper function to extract NFT from wrapper
    fun extract_nft<T: key + store>(wrapper: NFTWrapper<T>): T {
        let NFTWrapper { id, nft } = wrapper;
        object::delete(id);
        nft
    }

    // End an auction and transfer the NFT to the highest bidder
    public entry fun end_auction<T: key + store>(
        auction: &mut Auction<T>,
        registry: &mut AuctionRegistry,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        
        // Check if auction can be ended
        assert!(matches(&auction.status, &AuctionStatus::Active), EAuctionNotActive);
        assert!(current_time >= auction.end_time, EAuctionStillActive);

        // Update status
        auction.status = AuctionStatus::Ended;
        
        // Update registry
        let auction_id = object::id(auction);
        *table::borrow_mut(&mut registry.auctions, auction_id) = false;

        // We need to consume the auction to extract the NFT
        // This is a limitation - we'll need to restructure this
        // For now, let's emit the event without transferring the NFT
        // The NFT transfer will need to be done in a separate claim function

        // Emit event
        event::emit(AuctionEnded {
            auction_id,
            winner: auction.highest_bidder,
            winning_bid: auction.current_bid,
            total_bids: auction.bid_count,
        });
    }

    // Claim the NFT after auction ends (called by winner)
    public entry fun claim_nft<T: key + store>(
        auction: Auction<T>,
        ctx: &mut TxContext
    ) {
        let claimer = tx_context::sender(ctx);
        
        // Only the highest bidder can claim
        assert!(claimer == auction.highest_bidder, ENotAuctionCreator);
        assert!(matches(&auction.status, &AuctionStatus::Ended), EAuctionStillActive);

        // Extract creator before destructuring
        let creator = auction.creator;

        // Extract the NFT and transfer to winner
        let Auction { 
            id, 
            creator: _, 
            title: _, 
            description: _, 
            starting_bid: _, 
            current_bid: _, 
            highest_bidder, 
            start_time: _, 
            end_time: _, 
            status: _, 
            bid_count: _, 
            nft, 
            bid_history: _, 
            bidder_info: _, 
            unique_bidders: _,
            stored_bids: mut stored_bids,
            highest_bid_balance,
        } = auction;
        
        // Handle remaining balances - refund any stored bids
        let bidders = vec_map::keys(&stored_bids);
        let mut i = 0;
        let len = vector::length(&bidders);
        
        while (i < len) {
            let bidder_addr = *vector::borrow(&bidders, i);
            let (_, balance) = vec_map::remove(&mut stored_bids, &bidder_addr);
            if (balance::value(&balance) > 0) {
                let refund_coin = coin::from_balance(balance, ctx);
                transfer::public_transfer(refund_coin, bidder_addr);
            } else {
                balance::destroy_zero(balance);
            };
            i = i + 1;
        };
        
        // Destroy empty stored_bids map
        vec_map::destroy_empty(stored_bids);
        
        // Handle highest bid balance - this should go to the auction creator
        if (balance::value(&highest_bid_balance) > 0) {
            let payment_coin = coin::from_balance(highest_bid_balance, ctx);
            transfer::public_transfer(payment_coin, creator);
        } else {
            balance::destroy_zero(highest_bid_balance);
        };
        
        object::delete(id);
        let extracted_nft = extract_nft(nft);
        transfer::public_transfer(extracted_nft, highest_bidder);
    }

    // Claim auction proceeds (for auction creator)
    public entry fun claim_proceeds<T: key + store>(
        auction: &mut Auction<T>,
        registry: &mut AuctionRegistry,
        ctx: &mut TxContext
    ) {
        let claimer = tx_context::sender(ctx);
        
        // Only auction creator can claim
        assert!(claimer == auction.creator, ENotAuctionCreator);
        assert!(matches(&auction.status, &AuctionStatus::Ended), EAuctionStillActive);

        // Calculate 1% fee
        let total_amount = auction.current_bid;
        let fee_amount = (total_amount * FEE_PERCENTAGE) / PERCENTAGE_BASE;
        let creator_amount = total_amount - fee_amount;

        // Extract the highest bid balance
        assert!(balance::value(&auction.highest_bid_balance) >= total_amount, EInsufficientPayment);
        
        let mut total_balance = balance::withdraw_all(&mut auction.highest_bid_balance);
        let fee_balance = balance::split(&mut total_balance, fee_amount);
        
        // Send creator their proceeds (total amount minus fees)
        let creator_coin = coin::from_balance(total_balance, ctx);
        transfer::public_transfer(creator_coin, auction.creator);
        
        // Store fees in registry for later collection by treasury
        balance::join(&mut registry.fee_balance, fee_balance);

        // Update auction status
        auction.status = AuctionStatus::Claimed;

        // Emit event
        event::emit(AuctionClaimed {
            auction_id: object::id(auction),
            winner: auction.highest_bidder,
            final_amount: creator_amount,
            fee_collected: fee_amount,
        });
    }

    // Withdraw accumulated fees from registry (only auction house admins with cap)
    public entry fun withdraw_fees(
        _auction_house_cap: &mut AuctionHouseCap,
        registry: &mut AuctionRegistry,
        ctx: &mut TxContext
    ) {
        let fee_amount = balance::value(&registry.fee_balance);
        if (fee_amount > 0) {
            let fee_coin = coin::from_balance(
                balance::withdraw_all(&mut registry.fee_balance),
                ctx
            );
            transfer::public_transfer(fee_coin, tx_context::sender(ctx));
        };
    }

    // Withdraw fees from auction house cap (only auction house admins with cap)
    public entry fun withdraw_cap_fees(
        auction_house_cap: &mut AuctionHouseCap,
        ctx: &mut TxContext
    ) {
        let fee_amount = balance::value(&auction_house_cap.fee_balance);
        if (fee_amount > 0) {
            let fee_coin = coin::from_balance(
                balance::withdraw_all(&mut auction_house_cap.fee_balance),
                ctx
            );
            transfer::public_transfer(fee_coin, tx_context::sender(ctx));
        };
    }

    // Update treasury address (only auction house admins with cap)
    public entry fun update_treasury_address(
        _auction_house_cap: &AuctionHouseCap,
        registry: &mut AuctionRegistry,
        new_treasury: address,
        _ctx: &mut TxContext
    ) {
        registry.treasury_address = new_treasury;
    }

    // Helper function to match enum values
    fun matches<T: copy + drop>(value: &T, pattern: &T): bool {
        *value == *pattern
    }

    // View functions
    public fun get_auction_info<T: key + store>(auction: &Auction<T>): (
        String, String, u64, u64, address, u64, u64, AuctionStatus, u64, u64
    ) {
        (
            auction.title,
            auction.description,
            auction.starting_bid,
            auction.current_bid,
            auction.highest_bidder,
            auction.start_time,
            auction.end_time,
            auction.status,
            auction.bid_count,
            auction.unique_bidders
        )
    }

    // Get complete bid history for an auction
    public fun get_bid_history<T: key + store>(auction: &Auction<T>): vector<BidEntry> {
        auction.bid_history
    }

    // Get bidder leaderboard (returns all bidders sorted by total bid amount)
    public fun get_bidder_leaderboard<T: key + store>(auction: &Auction<T>): vector<BidderLeaderboard> {
        let mut leaderboard = vector::empty<BidderLeaderboard>();
        let bidders = vec_map::keys(&auction.bidder_info);
        let auction_id = object::id(auction);
        
        let mut i = 0;
        let len = vector::length(&bidders);
        
        while (i < len) {
            let bidder_addr = *vector::borrow(&bidders, i);
            let bidder_info = vec_map::get(&auction.bidder_info, &bidder_addr);
            
            let entry = BidderLeaderboard {
                auction_id,
                bidder: copy bidder_addr,
                total_bid_amount: bidder_info.total_bid_amount,
                bid_count: bidder_info.bid_count,
                highest_bid: bidder_info.highest_bid,
                latest_bid_time: bidder_info.latest_bid_time,
            };
            
            vector::push_back(&mut leaderboard, entry);
            i = i + 1;
        };
        
        // Sort by total bid amount (descending)
        // Note: In a real implementation, you'd want a more efficient sorting algorithm
        let mut sorted_leaderboard = vector::empty<BidderLeaderboard>();
        let mut remaining = leaderboard;
        
        while (!vector::is_empty(&remaining)) {
            let mut max_idx = 0;
            let mut max_amount = 0;
            let mut i = 0;
            let len = vector::length(&remaining);
            
            // Find the bidder with highest total bid amount
            while (i < len) {
                let entry = vector::borrow(&remaining, i);
                if (entry.total_bid_amount > max_amount) {
                    max_amount = entry.total_bid_amount;
                    max_idx = i;
                };
                i = i + 1;
            };
            
            let max_entry = vector::remove(&mut remaining, max_idx);
            vector::push_back(&mut sorted_leaderboard, max_entry);
        };
        
        sorted_leaderboard
    }

    // Get specific bidder's info
    public fun get_bidder_info<T: key + store>(auction: &Auction<T>, bidder: address): (u64, u64, u64, u64) {
        if (vec_map::contains(&auction.bidder_info, &bidder)) {
            let info = vec_map::get(&auction.bidder_info, &bidder);
            (info.total_bid_amount, info.bid_count, info.highest_bid, info.latest_bid_time)
        } else {
            (0, 0, 0, 0)
        }
    }

    // Get recent bids (last N bids)
    public fun get_recent_bids<T: key + store>(auction: &Auction<T>, count: u64): vector<BidEntry> {
        let mut recent_bids = vector::empty<BidEntry>();
        let total_bids = vector::length(&auction.bid_history);
        
        if (total_bids == 0) {
            return recent_bids
        };
        
        let start_idx = if (count >= total_bids) {
            0
        } else {
            total_bids - count
        };
        
        let mut i = start_idx;
        while (i < total_bids) {
            let bid = *vector::borrow(&auction.bid_history, i);
            vector::push_back(&mut recent_bids, bid);
            i = i + 1;
        };
        
        recent_bids
    }

    // Check if address has bid on auction
    public fun has_bidder_participated<T: key + store>(auction: &Auction<T>, bidder: address): bool {
        vec_map::contains(&auction.bidder_info, &bidder)
    }

    // Get stored bid amount for a bidder
    public fun get_stored_bid_amount<T: key + store>(auction: &Auction<T>, bidder: address): u64 {
        if (vec_map::contains(&auction.stored_bids, &bidder)) {
            let balance_ref = vec_map::get(&auction.stored_bids, &bidder);
            balance::value(balance_ref)
        } else {
            0
        }
    }

    public fun get_registry_info(registry: &AuctionRegistry): u64 {
        registry.auction_count
    }

    public fun get_registry_fee_info(registry: &AuctionRegistry): (u64, address) {
        (balance::value(&registry.fee_balance), registry.treasury_address)
    }

    public fun get_auction_house_fee_balance(auction_house_cap: &AuctionHouseCap): u64 {
        balance::value(&auction_house_cap.fee_balance)
    }

    public fun is_auction_active<T: key + store>(auction: &Auction<T>, clock: &Clock): bool {
        let current_time = clock::timestamp_ms(clock);
        matches(&auction.status, &AuctionStatus::Active) && current_time < auction.end_time
    }

    public fun get_time_remaining<T: key + store>(auction: &Auction<T>, clock: &Clock): u64 {
        let current_time = clock::timestamp_ms(clock);
        if (current_time >= auction.end_time) {
            0
        } else {
            auction.end_time - current_time
        }
    }

    // Emergency functions
    public entry fun cancel_auction<T: key + store>(
        auction: Auction<T>,
        registry: &mut AuctionRegistry,
        ctx: &mut TxContext
    ) {
        let caller = tx_context::sender(ctx);
        
        // Only creator can cancel, and only if no bids placed
        assert!(caller == auction.creator, ENotAuctionCreator);
        assert!(auction.bid_count == 0, EBidTooLow);

        // Extract creator before destructuring
        let creator = auction.creator;
        let auction_id = object::id(&auction);

        // Update registry
        *table::borrow_mut(&mut registry.auctions, auction_id) = false;

        // Destructure the auction and return the NFT to creator
        let Auction { 
            id, 
            creator: _, 
            title: _, 
            description: _, 
            starting_bid: _, 
            current_bid: _, 
            highest_bidder: _, 
            start_time: _, 
            end_time: _, 
            status: _, 
            bid_count: _, 
            nft, 
            bid_history: _, 
            bidder_info: _, 
            unique_bidders: _,
            stored_bids,
            highest_bid_balance,
        } = auction;
        
        // Clean up any balances (should be empty since no bids)
        vec_map::destroy_empty(stored_bids);
        balance::destroy_zero(highest_bid_balance);
        
        // Delete the auction object
        object::delete(id);
        
        // Extract and return the NFT to the creator
        let extracted_nft = extract_nft(nft);
        transfer::public_transfer(extracted_nft, creator);
    }
}

