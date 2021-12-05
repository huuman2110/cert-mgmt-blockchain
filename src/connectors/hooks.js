import { useState, useEffect, useCallback } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { injected } from "./index";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import { useHistory } from "react-router";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };
      const handleChainChanged = (chainId) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };
      const handleAccountsChanged = (accounts) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      // const handleNetworkChanged = (networkId) => {
      //   console.log("Handling 'networkChanged' event with payload", networkId)
      //   activate(injected)
      // }

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      // ethereum.on('networkChanged', handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          // ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      };
    }
  }, [active, error, suppress, activate]);
}

const setupDefaultNetwork = async () => {
  const provider = window.ethereum;
  if (provider) {
    const chainId = 97;
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: "Binance Smart Chain Testnet",
            nativeCurrency: {
              name: "BNB",
              symbol: "bnb",
              decimals: 18,
            },
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error("Failed to setup the network in Metamask:", error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

export const useWallet = () => {
  const { activate, deactivate, error } = useActiveWeb3React();
  const history = useHistory();

  const [currentConnector, setCurrentConnector] = useState();

  useEffect(() => {
    const catchError = async () => {
      if (error) {
        let errMessage;
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupDefaultNetwork();
          if (hasSetup) {
            activate(currentConnector);
          }
        } else if (error instanceof NoEthereumProviderError) {
          errMessage =
            "NoEthereumProviderError: Please install metamask extension or visit website in app which has ethereum provider.";
        }
        if (errMessage) {
          alert(errMessage);
        }
      }
    };

    catchError();
  }, [error]);

  const connect = useCallback((connector) => {
    setCurrentConnector(connector);
    activate(connector).then((_) => history.push("/"));
  }, []);

  const disconnect = useCallback(() => {
    deactivate();
  }, [deactivate]);

  return {
    connect,
    disconnect,
    error,
  };
};
