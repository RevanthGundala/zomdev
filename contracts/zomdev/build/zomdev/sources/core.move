module zomdev::core {
    use std::string::String;
    use sui::object_table::{Self, ObjectTable};
    use sui::event;
    use sui::dynamic_object_field as dof;

    public struct Platform has key {
        id: UID,
        companies: ObjectTable<String, Company>,
    }

    public struct Company has key, store {
       id: UID,
       reputation: u64,
    } 

    public struct Bounty has key, store {
        id: UID,
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
                companies: object_table::new(ctx),
            }
        )
    }

    public fun addCompany(platform: &mut Platform, name: String, ctx: &mut TxContext) {
        let company = Company {
            id: object::new(ctx),
            reputation: 0,
        };
        platform.companies.add(name, company);
    }

    public fun createBounty(
        platform: &mut Platform,
        company_name: String,
        title: String,
        description: String,
        requirements: String,
        reward: u64,
        created_at: String,
        deadline: String,
        ctx: &mut TxContext) {
        let bounty = Bounty {
            id: object::new(ctx),
            title,
            description,
            requirements,
            reward,
            submissions: vector[],
            created_at,
            deadline
        };
        event::emit(BountyPosted { id:  object::uid_to_inner(&bounty.id) });
        dof::add(&mut platform.companies[company_name].id, title, bounty);
    }

    // public fun createBountySubmission(platform: &mut Platform, ctx : &mut TxContext) {
    //      platform.bounties[ctx.sender()].push_back(ctx.sender());
         
    
    // }
}
