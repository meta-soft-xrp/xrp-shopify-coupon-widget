import * as React from 'react'

// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import { ShopContext } from "./context";
import EmbedRoute from './routes/embed/Embed';
import { parseQuery } from "./utils/url";
const { shop = '' } = parseQuery(window.location.search);

function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      <ShopContext.Provider value={shop}>
        <EmbedRoute />
      </ShopContext.Provider>
    </ChakraProvider>
  )
}

export default App;