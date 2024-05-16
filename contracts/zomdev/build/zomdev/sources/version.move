module zomdev::version{
    // === Constants ===
    const VERSION: u64 = 1;

    // === Public-View Functions ===
    public fun current_version(): u64 { VERSION } 
}