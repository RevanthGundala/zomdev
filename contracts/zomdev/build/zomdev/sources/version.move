module zomdev::version{
    // Change this value to the new version number when upgrading 
    const VERSION: u64 = 1;

    public fun version(): u64 {
        VERSION
    }
}