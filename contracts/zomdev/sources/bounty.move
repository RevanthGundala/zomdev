module zomdev::bounty { 
    use zomdev::{platform::{Platform, companies_mut, company_mut_id}, version};
    use std::string::String;
    use sui::event;
    use sui::dynamic_object_field as dof;

    public struct Bounty has key, store {
        id: UID,
        title: String,
        description: String,
        requirements: String,
        reward: u64,
        submissions: vector<address>,
        created_at: String,
        deadline: String,
        version: u64,
    }
    public struct BountyPosted has copy, drop {
        id: ID,
    }

    public fun new_v1(platform: &mut Platform, company_name: String, title: String, description: String, requirements: String, reward: u64, created_at: String, deadline: String, ctx: &mut TxContext) {
        new_internal(platform, company_name, title, description, requirements, reward, created_at, deadline, ctx);
    }

    public fun new_internal(
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
            deadline,
            version: version::version(),
        };
        
        event::emit(BountyPosted { id:  object::uid_to_inner(&bounty.id) });
        let company = &mut companies_mut(platform)[company_name];
        dof::add(company_mut_id(company), title, bounty);
    }
}