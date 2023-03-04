import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" id="html">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta
          name="keywords"
          content="group chat, productivity, web app, team collaboration, real-time messaging, messaging app, online communication, chat app"
        />
      </Head>
      <body className="transition-all duration-500">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
