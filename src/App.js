import * as React from "react";
// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { ShopContext, XRPContext } from "./context";
import EmbedRoute from "./routes/embed/Embed";
import { parseQuery } from "./utils/url";
// import { XummSdk } from "xumm-sdk";
// import { XummSdkJwt} from "xumm-sdk";
const { shop = "" } = parseQuery(window.location.search);

function App() {
  // 2. Wrap ChakraProvider at the root of your app

  const client = new window.xrpl.Client("wss://s.altnet.rippletest.net:51233");
  const wallet = window.xrpl.Wallet.fromSeed("ssAeDF75joWhQMmHdBYWZp9kRA7QB"); // For testing load from env
  // console.log(wallet);


  return (
    <ChakraProvider>
      <XRPContext.Provider value={{ wallet, client }}>
        <ShopContext.Provider value={shop}>
          <EmbedRoute />
        </ShopContext.Provider>
      </XRPContext.Provider>
    </ChakraProvider>
  );
}

export default App;
