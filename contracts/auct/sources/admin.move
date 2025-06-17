module auct::admin {
    use sui::coin;
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};
    use sui::event;
    use auct::auction_house::AuctionRegistry;

    // Error codes
    const ENotAuthorized: u64 = 0;
    const ECannotRevokeDeployer: u64 = 1;
    const EAdminCapNotFound: u64 = 2;
    const EAdminAlreadyExists: u64 = 3;
    const ESelfRevocation: u64 = 4;

    // Admin capability for managing the auction house
    public struct AuctionHouseCap has key, store {
        id: UID,
        admin_address: address,
        granted_by: address,
        granted_time: u64,
        is_deployer: bool, // Special flag for the original deployer
    }

    // Registry for tracking all admin capabilities
    public struct AdminRegistry has key {
        id: UID,
        deployer: address, // Original deployer who cannot be revoked
        admin_caps: Table<address, AdminCapInfo>, // admin_address -> cap info
        admin_addresses: vector<address>, // Keep track of all admin addresses
        admin_count: u64,
    }

    // Information about admin capabilities stored in registry
    public struct AdminCapInfo has store, copy, drop {
        cap_object_id: object::ID,
        granted_by: address,
        granted_time: u64,
        is_deployer: bool,
        is_active: bool,
    }

    // Events
    public struct AdminCapCreated has copy, drop {
        cap_id: object::ID,
        admin_address: address,
        granted_by: address,
        granted_time: u64,
        is_deployer: bool,
    }

    public struct AdminCapRevoked has copy, drop {
        cap_id: object::ID,
        admin_address: address,
        revoked_by: address,
        revoked_time: u64,
    }

    // Initialize the admin registry and create the first admin capability for deployer
    fun init(ctx: &mut TxContext) {
        let deployer = tx_context::sender(ctx);
        
        // Create admin registry
        let mut admin_registry = AdminRegistry {
            id: object::new(ctx),
            deployer,
            admin_caps: table::new<address, AdminCapInfo>(ctx),
            admin_addresses: vector::empty<address>(),
            admin_count: 0,
        };

        // Create the first admin capability for the deployer
        let deployer_cap = AuctionHouseCap {
            id: object::new(ctx),
            admin_address: deployer,
            granted_by: deployer,
            granted_time: 0, // Will be set when first used with clock
            is_deployer: true,
        };

        let cap_id = object::id(&deployer_cap);

        // Add deployer to registry
        let deployer_info = AdminCapInfo {
            cap_object_id: cap_id,
            granted_by: deployer,
            granted_time: 0,
            is_deployer: true,
            is_active: true,
        };

        table::add(&mut admin_registry.admin_caps, deployer, deployer_info);
        admin_registry.admin_count = 1;
        vector::push_back(&mut admin_registry.admin_addresses, deployer);

        // Transfer objects
        transfer::share_object(admin_registry);
        transfer::transfer(deployer_cap, deployer);

        // Emit event
        event::emit(AdminCapCreated {
            cap_id,
            admin_address: deployer,
            granted_by: deployer,
            granted_time: 0,
            is_deployer: true,
        });
    }

    // Create and transfer additional admin capabilities (requires existing admin cap)
    public entry fun create_admin_cap(
        _admin_cap: &AuctionHouseCap,
        admin_registry: &mut AdminRegistry,
        recipient: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let granter = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);

        // Check if recipient already has an active admin capability
        if (table::contains(&admin_registry.admin_caps, recipient)) {
            let existing_info = table::borrow(&admin_registry.admin_caps, recipient);
            assert!(!existing_info.is_active, EAdminAlreadyExists);
        };

        // Create new admin capability
        let new_cap = AuctionHouseCap {
            id: object::new(ctx),
            admin_address: recipient,
            granted_by: granter,
            granted_time: current_time,
            is_deployer: false,
        };

        let cap_id = object::id(&new_cap);

        // Add to registry
        let cap_info = AdminCapInfo {
            cap_object_id: cap_id,
            granted_by: granter,
            granted_time: current_time,
            is_deployer: false,
            is_active: true,
        };

        if (table::contains(&admin_registry.admin_caps, recipient)) {
            // Update existing entry
            *table::borrow_mut(&mut admin_registry.admin_caps, recipient) = cap_info;
        } else {
            // Add new entry
            table::add(&mut admin_registry.admin_caps, recipient, cap_info);
            admin_registry.admin_count = admin_registry.admin_count + 1;
            vector::push_back(&mut admin_registry.admin_addresses, recipient);
        };

        // Transfer capability to recipient
        transfer::transfer(new_cap, recipient);

        // Emit event
        event::emit(AdminCapCreated {
            cap_id,
            admin_address: recipient,
            granted_by: granter,
            granted_time: current_time,
            is_deployer: false,
        });
    }

    // Revoke admin capability (cannot revoke deployer, cannot self-revoke)
    public entry fun revoke_admin_cap(
        _admin_cap: &AuctionHouseCap,
        admin_registry: &mut AdminRegistry,
        target_admin: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let revoker = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);

        // Cannot revoke yourself
        assert!(revoker != target_admin, ESelfRevocation);

        // Check if target admin exists and is active
        assert!(table::contains(&admin_registry.admin_caps, target_admin), EAdminCapNotFound);
        let target_info = table::borrow(&admin_registry.admin_caps, target_admin);
        assert!(target_info.is_active, EAdminCapNotFound);

        // Cannot revoke the deployer
        assert!(!target_info.is_deployer, ECannotRevokeDeployer);
        assert!(target_admin != admin_registry.deployer, ECannotRevokeDeployer);

        // Copy values from target_info before mutable borrow
        let cap_object_id = target_info.cap_object_id;
        let granted_by = target_info.granted_by;
        let granted_time = target_info.granted_time;
        let is_deployer = target_info.is_deployer;

        // Mark as inactive in registry
        let updated_info = AdminCapInfo {
            cap_object_id,
            granted_by,
            granted_time,
            is_deployer,
            is_active: false,
        };

        *table::borrow_mut(&mut admin_registry.admin_caps, target_admin) = updated_info;

        // Emit event
        event::emit(AdminCapRevoked {
            cap_id: cap_object_id,
            admin_address: target_admin,
            revoked_by: revoker,
            revoked_time: current_time,
        });
    }

    // Withdraw accumulated fees from auction registry (only active admin cap holders)
    public entry fun withdraw_registry_fees(
        admin_cap: &AuctionHouseCap,
        admin_registry: &AdminRegistry,
        auction_registry: &mut AuctionRegistry,
        ctx: &mut TxContext
    ) {
        let admin_address = tx_context::sender(ctx);
        
        // Verify the admin capability is still active
        assert!(table::contains(&admin_registry.admin_caps, admin_address), ENotAuthorized);
        let admin_info = table::borrow(&admin_registry.admin_caps, admin_address);
        assert!(admin_info.is_active, ENotAuthorized);
        assert!(admin_info.cap_object_id == object::id(admin_cap), ENotAuthorized);

        let fee_amount = auct::auction_house::get_registry_fee_balance(auction_registry);
        if (fee_amount > 0) {
            let fee_coin = coin::from_balance(
                auct::auction_house::withdraw_registry_fees_balance(auction_registry),
                ctx
            );
            transfer::public_transfer(fee_coin, admin_address);
        };
    }

    // Update treasury address (only active admin cap holders)
    public entry fun update_treasury_address(
        admin_cap: &AuctionHouseCap,
        admin_registry: &AdminRegistry,
        auction_registry: &mut AuctionRegistry,
        new_treasury: address,
        ctx: &mut TxContext
    ) {
        let admin_address = tx_context::sender(ctx);
        
        // Verify the admin capability is still active
        assert!(table::contains(&admin_registry.admin_caps, admin_address), ENotAuthorized);
        let admin_info = table::borrow(&admin_registry.admin_caps, admin_address);
        assert!(admin_info.is_active, ENotAuthorized);
        assert!(admin_info.cap_object_id == object::id(admin_cap), ENotAuthorized);

        auct::auction_house::set_treasury_address(auction_registry, new_treasury);
    }

    // View functions for frontend to query admin information

    // Get all active admin addresses
    public fun get_all_active_admins(admin_registry: &AdminRegistry): vector<address> {
        let mut active_admins = vector::empty<address>();
        let all_addresses = &admin_registry.admin_addresses;
        
        let mut i = 0;
        let len = vector::length(all_addresses);
        
        while (i < len) {
            let admin_addr = *vector::borrow(all_addresses, i);
            let admin_info = table::borrow(&admin_registry.admin_caps, admin_addr);
            
            if (admin_info.is_active) {
                vector::push_back(&mut active_admins, admin_addr);
            };
            
            i = i + 1;
        };
        
        active_admins
    }

    // Get admin capability info for a specific address
    public fun get_admin_info(admin_registry: &AdminRegistry, admin_address: address): (
        object::ID, address, u64, bool, bool
    ) {
        assert!(table::contains(&admin_registry.admin_caps, admin_address), EAdminCapNotFound);
        let admin_info = table::borrow(&admin_registry.admin_caps, admin_address);
        
        (
            admin_info.cap_object_id,
            admin_info.granted_by,
            admin_info.granted_time,
            admin_info.is_deployer,
            admin_info.is_active
        )
    }

    // Get admin registry statistics
    public fun get_admin_registry_stats(admin_registry: &AdminRegistry): (
        address, u64, u64
    ) {
        let active_count = vector::length(&get_all_active_admins(admin_registry));
        
        (
            admin_registry.deployer,
            admin_registry.admin_count,
            active_count
        )
    }

    // Check if an address has an active admin capability
    public fun is_active_admin(admin_registry: &AdminRegistry, admin_address: address): bool {
        if (!table::contains(&admin_registry.admin_caps, admin_address)) {
            return false
        };
        
        let admin_info = table::borrow(&admin_registry.admin_caps, admin_address);
        admin_info.is_active
    }

    // Get deployer address
    public fun get_deployer(admin_registry: &AdminRegistry): address {
        admin_registry.deployer
    }

    // Get all admin addresses (active and inactive)
    public fun get_all_admins(admin_registry: &AdminRegistry): vector<address> {
        admin_registry.admin_addresses
    }
} 