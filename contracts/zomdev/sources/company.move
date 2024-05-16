module zomdev::company {
    // === Imports ===
    use zomdev::platform::{Platform, Self};
    use std::string::String;
    use sui::{dynamic_field as df, event};
  
    // === Structs ===
    public struct Company has key, store { id: UID } 

    public struct CompanyDataV1 has store {
        name: String,
        completed_payouts: u64,
    }

    public struct CompanyCreatedV1 has copy, drop { id: ID }

    // === Public-Package Functions ===
    public(package) fun uid(self: &Company): &UID { &self.id } 
    public(package) fun uid_mut(self: &mut Company): &mut UID { &mut self.id }
    public(package) fun self(platform: &Platform, company_id: ID): &Company {
        df::borrow(platform::uid(platform), company_id)
    }
    public(package) fun self_mut(platform: &mut Platform, company_id: ID): &mut Company {
        df::borrow_mut(platform::uid_mut(platform), company_id)
    }

    // === Private Functions ===
    entry fun new(platform: &mut Platform, company_name: String, ctx: &mut TxContext) {  
        platform::assert_current_version(platform);
        let mut company = Company { id: object::new(ctx) };
        let company_data = CompanyDataV1 { name: company_name, completed_payouts: 0 };
        let id = object::uid_to_inner(&company.id);
        event::emit(CompanyCreatedV1 { id: id } );
        // Don't need a uniqe name b/c it's a 1:1 relationship
        df::add(&mut company.id, b"data_v1", company_data);
        df::add(platform::uid_mut(platform), id, company);
    }

    // entry fun update(_: &AdminCap, platform: &mut Platform, company_name: String) { 
    //     let company = self_mut(platform, company_name);
    //     let old_company_data = df::remove<vector<u8>, CompanyDataV1>(&mut company.id, b"data_v1");
    //     let new_company_data = CompanyDataV2 { completed_payouts: old_company_data.completed_payouts };
    //     df::add(&mut company.id, b"data_v2", new_company_data);
    // }
} 