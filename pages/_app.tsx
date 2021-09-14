import { AppProps } from "next/app";
import Head from "next/head";

import { theme, ThemeProvider } from "@glif/react-components";
import "../styles/normalize.css";
import { Web3ContextProvider } from "../src/contexts";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>UCAN GLIF</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Web3ContextProvider>
          <Component {...pageProps} />
        </Web3ContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
