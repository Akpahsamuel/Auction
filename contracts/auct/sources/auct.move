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








































}