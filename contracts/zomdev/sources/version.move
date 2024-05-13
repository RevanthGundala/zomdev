module zomdev::version{
    // === Constants ===
    const VERSION: u64 = 2;

    // === Public-View Functions ===
    public fun current_version(): u64 { VERSION } 
}