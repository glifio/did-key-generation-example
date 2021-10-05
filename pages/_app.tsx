import { AppProps } from "next/app";
import Head from "next/head";

import { theme, ThemeProvider } from "@glif/react-components";
import { Web3ContextProvider } from "../src/contexts";
import "../styles/normalize.css";
import "../styles/styles.css";

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
