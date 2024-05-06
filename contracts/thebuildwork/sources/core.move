/// Module: thebuildwork
module thebuildwork::core {
    use std::string::String;
    use sui::table::{Self, Table};
    use sui::event;

    public struct TheBuildWork has key {
        id: UID,
        users: vector<address>,
        bounties: Table<address, vector<Bounty>>
    }

    public struct Bounty has key, store {
        id: UID,
        title: String,
        description: String,
        requirements: String,
        reward: u64,
        deadline: String,
    }

    public struct BountyPosted has copy, drop {
        id: ID,
    }

    fun init (ctx: &mut TxContext) {
        transfer::share_object(
            TheBuildWork {
                id: object::new(ctx),
                users: vector[],
                bounties: table::new(ctx)
            }
        )
    }

    public fun createBounty(
        the_build_work: &mut TheBuildWork,
        title: String,
        description: String,
        requirements: String,
        reward: u64,
        deadline: String,
        ctx: &mut TxContext) {
        let bounty = Bounty {
            id: object::new(ctx),
            title,
            description,
            requirements,
            reward,
            deadline
        };
        if(!the_build_work.bounties.contains(ctx.sender())) {
            the_build_work.users.push_back(ctx.sender());
            the_build_work.bounties.add(ctx.sender(), vector[]);
        };
        event::emit(BountyPosted { id: object::uid_to_inner(&bounty.id) });
        the_build_work.bounties.borrow_mut(ctx.sender()).push_back(bounty);

    }

    public fun getBountiesOwnedBy(the_build_work: &TheBuildWork, user: address): &vector<Bounty> {
        the_build_work.bounties.borrow(user)
    }
}
