import { Routes } from "components/route/Routes";
import { GlobalContext } from "context/GlobalContext";
import { useContext, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { messages } from "language";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "connectors/hooks";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const { language } = useContext(GlobalContext);
  const { connector } = useWeb3React();

  const [loading, setLoading] = useState(false);

  const [activatingConnector, setActivatingConnector] = useState();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);

  return loading ? (
    <div>loading</div>
  ) : (
    <IntlProvider locale={language} messages={messages[language]}>
      <Routes />
    </IntlProvider>
  );
}

export default function () {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  );
}
