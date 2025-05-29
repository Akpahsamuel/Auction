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

    // Constants
    const FEE_PERCENTAGE: u64 = 1; // 1% fee
    const PERCENTAGE_BASE: u64 = 100;
    const MIN_BID_INCREMENT: u64 = 1000000; // 0.001 SUI minimum increment

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
            current_bid: starting_bid,
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


}