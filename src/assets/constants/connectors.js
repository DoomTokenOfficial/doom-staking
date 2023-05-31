import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const POLLING_INTERVAL = 12000;
const RPC_URL = "https://rpc.testnet.fantom.network/";
// const RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545";

export const injected = new InjectedConnector({
    supportedChainIds: [4002],
});

export const walletconnect = new WalletConnectConnector({
    rpc: { 56: RPC_URL },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});
