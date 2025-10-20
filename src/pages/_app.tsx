import "@/styles/globals.css";
//import "bootstrap/dist/css/bootstrap.min.css"; // <-- Importa Bootstrap
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
