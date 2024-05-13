module zomdev::platform {
    // === Imports ===
    use zomdev::version;
    use sui::package;

    // === Errors ===
    const EInvalidMigration: u64 = 0;
    const EInvalidVersion: u64 = 1;

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
        transfer::public_share_object(Platform { id: object::new(ctx), version: version::current_version() })
    }

    // === Public Functions ===
    public fun version(self: &Platform): u64 { self.version }

    // === Public-Package Functions ===
    public(package) fun uid(self: &Platform): &UID { &self.id }
    public(package) fun uid_mut(self: &mut Platform): &mut UID { &mut self.id }
    public(package) fun assert_current_version(self: &Platform) { assert!(self.version == version::current_version(), EInvalidVersion) }
 
    // === Private Functions ===
    entry fun migrate(_: &AdminCap, self: &mut Platform) { 
        assert!(self.version != version::current_version(), EInvalidMigration);
        self.version = version::current_version();
    }
}