module zomdev::company {
    // === Imports ===
    use zomdev::platform::{Platform, Self};
    use std::string::String;
    use sui::{dynamic_field as df, dynamic_object_field as dof};

    // === Structs ===
    public struct Company has key, store { id: UID } 

    public struct CompanyV1 has store {
        name: String,
        reputation: u64,
    }

    // === Public-View Functions ===
    public fun uid(self: &Company): &UID { &self.id } 
    public fun uid_mut(self: &mut Company): &mut UID { &mut self.id }

    // === Public-Package Functions ===
    public(package) fun new_v1(platform: &mut Platform, name: String, ctx: &mut TxContext) {  
        new_internal(platform, name, ctx);
    }

    // === Private Functions ===
    fun new_internal(platform: &mut Platform, name: String, ctx: &mut TxContext) {
        let mut company = Company { id: object::new(ctx) };
        let company_data = CompanyV1 { name, reputation: 0 };
        df::add(&mut company.id, name, company_data);
        dof::add(platform::uid_mut(platform), object::uid_to_inner(&company.id), company);
    }
}