module auct::admin {
    use sui::coin;
    use auct::auction_house::AuctionRegistry;

    // Main auction house capability for admin functions
    public struct AuctionHouseCap has key {
        id: UID,
    }

    // Initialize the admin capability on package publish
    fun init(ctx: &mut TxContext) {
        let auction_house_cap = AuctionHouseCap {
            id: object::new(ctx),
        };
        transfer::transfer(auction_house_cap, tx_context::sender(ctx));
    }

    // Public entry function to create and transfer additional admin capabilities
    public entry fun create_admin_cap(ctx: &mut TxContext) {
        let auction_house_cap = AuctionHouseCap {
            id: object::new(ctx),
        };
        transfer::transfer(auction_house_cap, tx_context::sender(ctx));
    }

    // Withdraw accumulated fees from registry (only auction house admins with cap)
    public entry fun withdraw_registry_fees(
        _auction_house_cap: &AuctionHouseCap,
        registry: &mut AuctionRegistry,
        ctx: &mut TxContext
    ) {
        let fee_amount = auct::auction_house::get_registry_fee_balance(registry);
        if (fee_amount > 0) {
            let fee_coin = coin::from_balance(
                auct::auction_house::withdraw_registry_fees_balance(registry),
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
        auct::auction_house::set_treasury_address(registry, new_treasury);
    }
} 