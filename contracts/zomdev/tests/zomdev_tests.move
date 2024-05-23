#[test_only]
module zomdev::zomdev_tests {
    use zomdev::platform::{Self, Platform};
    use std::string;

    // const ENotImplemented: u64 = 0;

    // #[test]
    // fun test_zomdev() {
    //     // pass
    // }

    // #[test, expected_failure(abort_code = zomdev::zomdev_tests::ENotImplemented)]
    // fun test_zomdev_fail() {
    //     abort ENotImplemented
    // }

    // #[test(platform = 0xfc43051466df65fb00171e654c8857eb5c058f958fe04deec03323b2c0bc9559::platform::Platform)]
    // fun test_platform_version(platform: &Platform) {
    //     assert!(platform.version() == string::utf8(b"1.0.0"));
    // }

    #[test]
    fun test_comparison() { 
        assert!(string::utf8(b"1.0.0") != string::utf8(b"1.0.1"));
    }
}

