module zomdev::bounty { 
    // === Imports ===
    use zomdev::{platform::{Platform, Self}, company};
    use std::{string::String, type_name};
    use sui::{dynamic_field as df, event, table::{Self, Table}, coin::Coin};

    // === Errors ===
    const EInvalidBountyCap: u64 = 0;
    const EInvalidCoinType: u64 = 1;
  
    // === Structs ===
    public struct Bounty has key, store { id: UID }

    public struct BountyCapV1 has key { id: UID, bounty_id: ID }

    public struct BountyDataV1 has store {
        title: String,
        description: String,
        requirements: String,
        reward: u64,
        submissions: Table<address, String>,
        created_at: String,
        deadline: String,
        winner: Option<address>,
    }

    public struct BountyPostedV1 has copy, drop { id: ID }

    // === Public Functions ===

    // coin type can't be private entry
    public fun select_winner_v1<T>(
    // cap: BountyCapV1, 
    platform: &mut Platform, 
    company_id: ID, 
    bounty_id: ID, 
    winner: address, 
    payment: Coin<T>,
    ctx: &mut TxContext
    ) { 
        select_winner_internal(platform, company_id, bounty_id, winner, payment, ctx);
    }

    // === Public-Package Functions ===
    public(package) fun uid(self: &Bounty): &UID { &self.id } 
    public(package) fun uid_mut(self: &mut Bounty): &mut UID { &mut self.id }

    // === Private Functions ===

    // change signature in case of upgrade
    entry fun new(
        platform: &mut Platform,
        company_id: ID,
        title: String, 
        description: String, 
        requirements: String, 
        reward: u64, 
        created_at: String, 
        deadline: String,
        ctx: &mut TxContext
        ) {
        platform::assert_current_version(platform);
        let company = company::self_mut(platform, company_id);
        let mut bounty = Bounty { id: object::new(ctx) };
        let bounty_data = BountyDataV1 {
            title,
            description,
            requirements,
            reward,
            submissions: table::new(ctx),
            created_at,
            deadline,
            winner: option::none(),
        };
        let id = object::uid_to_inner(&bounty.id);
        event::emit(BountyPostedV1 { id });
        df::add(&mut bounty.id, b"data_v1", bounty_data);
        df::add(company::uid_mut(company), id, bounty);
        // only the company has certain capabilities with the bounty
        transfer::transfer(BountyCapV1 { id: object::new(ctx), bounty_id: id }, ctx.sender());
    } 

    entry fun submit(platform: &mut Platform, company_id: ID, bounty_id: ID, submission: String, ctx: &TxContext) { 
        platform::assert_current_version(platform);
        // get the bounty from the company
        let bounty = df::borrow_mut<ID, Bounty>(company::uid_mut(company::self_mut(platform, company_id)), bounty_id);

        // get the bounty data
        let bounty_data = df::borrow_mut<vector<u8>, BountyDataV1>(uid_mut(bounty), b"data_v1");
        
        bounty_data.submissions.add(ctx.sender(), submission);
    }

    entry fun transfer_bounty_cap(bounty_cap: BountyCapV1, new_owner: address) {
        transfer::transfer(bounty_cap, new_owner);
    }

    fun select_winner_internal<T>(
        // cap: BountyCapV1, 
        platform: &mut Platform, 
        company_id: ID, 
        bounty_id: ID, 
        winner: address, 
        mut payment: Coin<T>,
        ctx: &mut TxContext
        ) {
        platform::assert_current_version(platform);
        // assert!(cap.bounty_id == bounty_id, EInvalidBountyCap);

        // TODO: Only accept USDC right now
        //let usdc = b"0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN";
        // let usdc = b"0x2::sui::SUI";
        
        // let coin_type = type_name::into_string(type_name::get<T>()).into_bytes();
        // assert!(coin_type == usdc, EInvalidCoinType);
        let company = company::self_mut(platform, company_id);

        // create new scope so we can reuse company variable
        { 
            // update the company's completed payouts
            company::update_completed_payouts(company);
        };

        let bounty = df::borrow_mut<ID, Bounty>(company::uid_mut(company), bounty_id);
        let bounty_data = df::borrow_mut<vector<u8>, BountyDataV1>(uid_mut(bounty), b"data_v1");
        bounty_data.winner = option::some(winner);
    
        // pay the winner - will automatically abort if the payment fails
        payment.split_and_transfer(bounty_data.reward, winner, ctx);
        payment.destroy_zero();

        // TODO: delete the bounty cap
        // let BountyCapV1 { id , bounty_id: _ } = cap;
        // object::delete(id);
    }
}