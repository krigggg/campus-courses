import Layout from "@/components/layout/layout";
import { store } from "@/services/store";
import "@/styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}
