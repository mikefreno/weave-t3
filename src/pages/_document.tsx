import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="bg-[#262626] " id="html">
      <Head />
      <body className="bgColorGradient" id="body">
        <div id="bottomGradient" className="bottomGradient">
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  );
}
