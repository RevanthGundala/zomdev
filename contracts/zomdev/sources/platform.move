module zomdev::platform {
    // === Imports ===
    use zomdev::version;
    use sui::package;

    // === Structs ===
    public struct Platform has key, store {
        id: UID,
        version: u64,
    }

    public struct AdminCap has key { id: UID }
    
    public struct PLATFORM has drop { } 

    // === Init ===
    fun init(otw: PLATFORM, ctx: &mut TxContext) {
        package::claim_and_keep(otw, ctx);
        transfer::transfer(AdminCap { id: object::new(ctx) }, ctx.sender());
        transfer::public_share_object(Platform { id: object::new(ctx), version: version::version() })
    }

    // === Public-View Functions ===
    public fun uid(self: &Platform): &UID { &self.id }
    public fun uid_mut(self: &mut Platform): &mut UID { &mut self.id }
}