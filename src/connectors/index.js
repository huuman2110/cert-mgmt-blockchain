import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { ReactComponent as MetamaskIcon } from "assets/images/metamask.svg";
import { ReactComponent as WalletConnectIcon } from "assets/images/walletconnect.svg";
import { StaticJsonRpcProvider } from "@ethersproject/providers";

export const injected = new InjectedConnector({ supportedChainIds: [97] });

export const walletconnect = new WalletConnectConnector({
  rpc: {
    97: "https://speedy-nodes-nyc.moralis.io/a43f8c3622ef7381f8b32707/bsc/testnet",
  },
});

export const connectors = [
  {
    name: "Metamask",
    connector: injected,
    icon: <MetamaskIcon />,
  },
  {
    name: "WalletConnect",
    connector: walletconnect,
    icon: <WalletConnectIcon />,
  },
];

export const simpleRpcProvider = new StaticJsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
);
