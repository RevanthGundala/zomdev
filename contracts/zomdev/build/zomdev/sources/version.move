module zomdev::version{
    // === Imports ===
    use std::string::{Self, String};
    
    // === Constants ===
    const VERSION: vector<u8> = b"1.0.1";

    // === Public-View Functions ===
    public fun current_version(): String { string::utf8(VERSION) } 
}