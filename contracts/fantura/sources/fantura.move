
/// Module: fantura
module fantura::fantura {


    /// Struct: Fantura
    public struct Fantura has key{
        id: UID,
        name: u32,
        age: u32,
    }

    fun init(ctx: &mut TxContext) {
        transfer::share_object(Fantura {
            id: object::new(ctx),
            name: 0,
            age: 0,
        });
    }
}
