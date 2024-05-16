module zomdev::bounty { 
    // === Imports ===
    use zomdev::{company, platform::{Platform, Self}};
    use std::string::String;
    use sui::{dynamic_field as df, event, vec_set::{VecSet, Self}};
  
    // === Structs ===
    public struct Bounty has key, store { id: UID }

    public struct BountyCap has key { id: UID }

    public struct BountyDataV1 has store {
        title: String,
        description: String,
        requirements: String,
        reward: u64,
        submissions: VecSet<address>,
        created_at: String,
        deadline: String,
        winner: Option<address>,
    }

    public struct BountyPostedV1 has copy, drop { id: ID }

    // === Public-Package Functions ===
    public(package) fun uid(self: &Bounty): &UID { &self.id } 
    public(package) fun uid_mut(self: &mut Bounty): &mut UID { &mut self.id }

    // === Private Functions ===
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
            submissions: vec_set::empty(),
            created_at,
            deadline,
            winner: option::none(),
        };
        let id = object::uid_to_inner(&bounty.id);
        event::emit(BountyPostedV1 { id });
        df::add(&mut bounty.id, b"data_v1", bounty_data);
        df::add(company::uid_mut(company), id, bounty);
        // only the company has certain capabilities with the bounty
        transfer::transfer(BountyCap { id: object::new(ctx) }, ctx.sender());
    } 

    entry fun transfer_bounty_cap(cap: BountyCap, to: address) { 
        transfer::transfer(cap, to);
    }

    // TODO: Implement this function
    // entry fun submit(platform: &mut Platform) { 
    //     // get the bounty from the company
    //     let bounty;

    //     // get the bounty data
    //     let bounty_data;

    //     bounty_data.submissions.push(ctx.sender());
    // }

    // entry fun select_winner(_: &BountyCap, platform: &mut Platform, company_name: String, bounty_title: String, winner: address) {
      
    //     bounty_data.winner = option::some(winner);
    // }
}