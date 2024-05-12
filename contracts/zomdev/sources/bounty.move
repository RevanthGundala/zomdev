module zomdev::bounty { 
    // === Imports ===
    use zomdev::{company, platform::Platform};
    use std::string::String;
    use sui::{dynamic_field as df, event};
 
    // === Structs ===
    public struct Bounty has key, store { id: UID }

    public struct BountyDataV1 has store {
        title: String,
        description: String,
        requirements: String,
        reward: u64,
        submissions: vector<address>,
        created_at: String,
        deadline: String,
    }

    public struct BountyPostedV1 has copy, drop { id: ID }

    // === Public-View Functions ===

    // === Public-Package Functions ===
    public(package) fun uid(self: &Bounty): &UID { &self.id } 
    public(package) fun uid_mut(self: &mut Bounty): &mut UID { &mut self.id }

    // === Private Functions ===
    entry fun new(
        platform: &mut Platform,
        company_name: String,
        title: String, 
        description: String, 
        requirements: String, 
        reward: u64, 
        created_at: String, 
        deadline: String,
        ctx: &mut TxContext
        ) {
        new_internal(platform, company_name, title, description, requirements, reward, created_at, deadline, ctx);
    } 

    fun new_internal(
        platform: &mut Platform,
        company_name: String,
        title: String,
        description: String,
        requirements: String,
        reward: u64,
        created_at: String,
        deadline: String,
        ctx: &mut TxContext
        ) {
        let company = company::self_mut(platform, company_name);
        let mut bounty = Bounty { id: object::new(ctx) };
        let bounty_data = BountyDataV1 {
            title,
            description,
            requirements,
            reward,
            submissions: vector[],
            created_at,
            deadline,
        };
        event::emit(BountyPostedV1 { id:  object::uid_to_inner(&bounty.id) });
        df::add(&mut bounty.id, b"data", bounty_data);
        df::add(company::uid_mut(company), title, bounty);
    }
}