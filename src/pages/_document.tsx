import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" id="html">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/path/to/apple-touch-icon.png" />
      </Head>
      <body className="transition-all duration-500">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
