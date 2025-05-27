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





































}