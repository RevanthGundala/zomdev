module zomdev::core {
    use std::string::String;
    use sui::table::{Self, Table};
    use sui::event;

    public struct Platform has key {
        id: UID,
        users: vector<address>,
        bounties: Table<address, vector<Bounty>>
    }

    public struct Bounty has key, store {
        id: UID,
        company: String,
        title: String,
        description: String,
        requirements: String,
        reward: u64,
        submissions: vector<address>,
        created_at: String,
        deadline: String,
    }

    public struct BountyPosted has copy, drop {
        id: ID,
    }

    fun init (ctx: &mut TxContext) {
        transfer::share_object(
            Platform {
                id: object::new(ctx),
                users: vector[],
                bounties: table::new(ctx)
            }
        )
    }

    public fun createBounty(
        platform: &mut Platform,
        company: String,
        title: String,
        description: String,
        requirements: String,
        reward: u64,
        created_at: String,
        deadline: String,
        ctx: &mut TxContext) {
        let bounty = Bounty {
            id: object::new(ctx),
            company,
            title,
            description,
            requirements,
            reward,
            submissions: vector[],
            created_at,
            deadline
        };
        if(!platform.bounties.contains(ctx.sender())) {
            platform.users.push_back(ctx.sender());
            platform.bounties.add(ctx.sender(), vector[]);
        };
        event::emit(BountyPosted { id: object::uid_to_inner(&bounty.id) });
        platform.bounties.borrow_mut(ctx.sender()).push_back(bounty);

    }

    // public fun createBountySubmission(platform: &mut Platform, ctx : &mut TxContext) {
    //      platform.bounties[ctx.sender()].push_back(ctx.sender());
         
    
    // }

    public fun getBountiesOwnedBy(platform: &Platform, user: address): &vector<Bounty> {
        platform.bounties.borrow(user)
    }
}
