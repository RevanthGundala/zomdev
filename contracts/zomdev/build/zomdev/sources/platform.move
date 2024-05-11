
module zomdev::platform { 
    use sui::object_table::{Self, ObjectTable};
    use std::string::String;
    use zomdev::version;

    public struct Platform has key {
        id: UID,
        companies: ObjectTable<String, Company>,
        version: u64,
    }

    public struct Company has key, store {
       id: UID,
       reputation: u64,
       version: u64,
    } 

    fun init(ctx: &mut TxContext) {
        init_internal(ctx);
    }

    fun init_internal(ctx: &mut TxContext) {
        transfer::share_object(
            Platform {
                id: object::new(ctx),
                companies: object_table::new(ctx),
                version: version::version(),
            }
        )
    }

   // version "new" in case of upgrade
    public fun new_company_v1(self: &mut Platform, name: String, ctx: &mut TxContext) {
        new_company_internal(self, name, ctx);
    }

    fun new_company_internal(self: &mut Platform, name: String, ctx: &mut TxContext) {
        let company = Company {
            id: object::new(ctx),
            reputation: 0,
            version: version::version(),
        };
        self.companies.add(name, company);
    }

    public fun companies(self: &Platform): &ObjectTable<String, Company> {
        &self.companies
    }

    public fun companies_mut(self: &mut Platform): &mut ObjectTable<String, Company> {
        &mut self.companies
    }

    public fun company_id(company: &Company): &UID {
        &company.id
    }

    public fun company_mut_id(company: &mut Company): &mut UID {
        &mut company.id
    }
    
}