module zomdev::bounty { 
    // === Imports ===
    use zomdev::company::{Company, Self};
    use std::string::String;
    use sui::{dynamic_field as df, dynamic_object_field as dof, event};
 
    // === Structs ===
    public struct Bounty has key, store { id: UID }

    public struct BountyV1 has store {
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
    public fun uid(self: &Bounty): &UID { &self.id } 
    public fun uid_mut(self: &mut Bounty): &mut UID { &mut self.id }

    // === Public-Package Functions ===
    public(package) fun new_v1(
        company: &mut Company,
        title: String, 
        description: String, 
        requirements: String, 
        reward: u64, 
        created_at: String, 
        deadline: String,
        ctx: &mut TxContext
        ) {
        new_internal(company, title, description, requirements, reward, created_at, deadline, ctx);
    }

    // === Private Functions ===
    public fun new_internal(
        company: &mut Company,
        title: String,
        description: String,
        requirements: String,
        reward: u64,
        created_at: String,
        deadline: String,
        ctx: &mut TxContext
        ) {
        let mut bounty = Bounty { id: object::new(ctx) };
        let bounty_data = BountyV1 {
            title,
            description,
            requirements,
            reward,
            submissions: vector[],
            created_at,
            deadline,
        };
        event::emit(BountyPostedV1 { id:  object::uid_to_inner(&bounty.id) });
        df::add(&mut bounty.id, title, bounty_data);
        dof::add(company::uid_mut(company), object::uid_to_inner(&bounty.id), bounty);
    }
}