/*
/// Module: auct
module auct::auct;

*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

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
        balance: Balance<SUI>,
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
        bid_history: String,
        bidder_info: String,
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
}