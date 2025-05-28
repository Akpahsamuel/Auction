module auct::auction_house {
    use std::string::{Self,String};
    use sui::coin::{Self,Coin};
    use sui::sui::SUI;
    use sui::balance::{Self,Balance};
    use sui::clock::{Self,Clock};
    use sui::event;
    use sui::table::{Self,Table};
    use sui::vec_map::{Self,VecMap};


    //ErrorCodes

    const EAuctionNotActive: u64 = 0;
    const EAuctionEnded: u64 = 1;
    const EBidTooLow: u64 = 2;
    const ENotAuctionCreator: u64 = 3;
    const EAuctionStillActive: u64 = 4;
    const EInsufficientPayment: u64 = 5;

    //FeeCalculation
    const FEE_PERCENTAGE:u64 = 1; //1% fee
    const PERCENTAGE_BASE:u64 = 100; 

    //ActionStatus
    public enum AuctionStatus has copy,store,drop {
        Active,
        Ended,
        Claimed,
    }

    public struct AuctionHouseCap  has key{
        id: UID,
        fee_balance: Balance<SUI>,
    }



    public struct NFTWrapper<T: key + store> has key, store {
        id: UID,
        nft: T,

    }




    public struct Auction has key, store {
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
        // bid tracking
        bid_history: vector<BidEntry>,
        bidder_info: VecMap<address, BidderInfo>,
        nft: NFTWrapper<T>,
        stored_bids: VecMap<address, Balance<SUI>>,
        highest_bid_balance: Balance<SUI>,


    }
    
    
    public struct BidEntry has store, drop, copy {
        bidder: address,
        amount: u64,
        timestamp: u64,

    }




    //AuctionRegistry Struct

   public struct AuctionRegistry has key {
        id: UID,
        auctions: Table<object::ID, bool>, // auction_id -> is_active
        auction_count: u64,
        // Fee collection
        fee_balance: Balance<SUI>,
        treasury_address: address,
    }


    //Event
    public struct AuctionCreated  has copy, drop {
        auction_id: object::ID,
        creator: address,
        title: String,
        starting_bid: u64,
        end_time: u64,
        nft_type: String, // Placeholder for NFT type
    }


    //Creating a bidder info struct
    public struct BidderInfo has store,drop,copy{
        total_amount_bid: u64,
        bid_count:u64,
        highest_bid :u64,
        latest_bid_time: u64,

    }


    // Represents an event when a bid is placed in an auction.
    // Contains details such as the auction ID, bidder's address, bid amount, and timestamp.
    public struct BidPlaced has drop, copy {
        auction_id: object::ID,
        bidder: address,
        bid_amount: u64,
        timestamp: u64,
    }


    // Represents an event when an auction ends.
    // Contains details such as the auction ID, winner's address, winning bid amount, and total number of bids.
    public struct AuctionEnded has drop, copy {
        auction_id: object::ID,
        winner: address,
        winning_bid: u64,
        total_bids: u64,
    }

    // This struct represents an event when an auction is claimed.
    public struct AuctionClaimed has drop, copy {
        auction_id: object::ID,
        winner: address,
        final_amount: u64,
        fee_collected: u64,
    }

    // This struct represents a leaderboard entry for bidders in an auction.
    public struct BidderLeaderboard has copy, drop {
        auction_id: object::ID,
        bidder: address,
        total_bid_amount: u64,
        bid_count: u64,
        highest_bid: u64,
        latest_bid_time: u64,
    }



    fun init(ctx: &mut TxContext) {
        // Initialize the AuctionHouseCap with a new UID and an empty fee balance
        let auction_house_cap = AuctionHouseCap {
            id: object::new(ctx),
            fee_balance: balance::zero<SUI>(),
        };


        let registry = AuctionRegistry {
            id: object::new(ctx),
            auctions:  table::new<object::ID, bool>(ctx),
            auction_count: 0,
            fee_balance: balance::zero<SUI>(),
            treasury_address: tx_context::sender(ctx),
        };


        transfer::transfer(auction_house_cap, tx_context::sender(ctx));
        transfer::share_object(registry)
        

}


//create a  new auction funtiion

public fun create_auction<T: key + store >(
    registry: &mut AuctionRegistry,
    nft: T,
    title: vector<u8>,
    description: vector<u8>,
    starting_bid: u64,
    duration_ms: u64,
    clock: &Clock,
    ctx: &mut TxContext,

) {
    let creator = tx_context::sender(ctx);
    let current_time = clock::timestamp_ms(clock);
    let end_time = current_time + duration_ms;


    let nftwrapper = NFTWrapper {
        id: object::new(ctx),
        nft,
    };

    // Ensure the auction end time is in the future
    assert!(end_time > current_time, EAuctionNotActive);

    // Create a new auction
    let auction = Auction {
        id: object::new(ctx),
        creator,
        title: string::utf8(title),
        description: string::utf8(description),
        starting_bid,
        current_bid: starting_bid,
        highest_bidder: tx_context::sender(ctx),
        start_time: current_time,
        end_time,
        status: AuctionStatus::Active,
        bid_count: 0,
        nft:nftwrapper,
        bid_history: vector::empty<BidEntry>(),
        bidder_info: vec_map::empty<address, BidderInfo>(),
        stored_bids: vec_map::empty<address, Balance<SUI>>(),
        highest_bid_balance: balance::zero<SUI>(),
    };

    // Add the auction to the registry
    table::add(&mut registry.auctions, object::id(&auction), true);
    registry.auction_count = registry.auction_count + 1;

    // Emit an event for the auction creation
    event::emit(AuctionCreated {
        auction_id: object::id(&auction),
        creator,
        title:auction.title,
        starting_bid,
        end_time,
        nft_type: string::utf8(b"Generic NFT Type"), // Placeholder for NFT type
    });

    // Transfer the auction object to the creator
    transfer::share_object(auction );










}
}




