import MAINNET_ADDRESSES from "../mainnet_deployed_addresses.json";
import TESTNET_ADDRESSES from "../testnet_deployed_addresses.json";
export const ADDRESSES =
  process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet"
    ? MAINNET_ADDRESSES
    : TESTNET_ADDRESSES;

export const NAME = "Zomdev";
export const MAX_LENGTH = 175;

export const SUI_TYPE = "0x2::sui::SUI";
export const USDC_TYPE =
  "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN";
