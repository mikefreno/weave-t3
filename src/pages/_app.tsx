import "@/src/styles/globals.css";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { api } from "../utils/api";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeContextProvider } from "../components/ThemeContextProvider";
import { Analytics } from "@vercel/analytics/react";

const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {},
  },
});

const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {},
  },
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NextThemesProvider
        defaultTheme="system"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <ThemeContextProvider>
            <Component {...pageProps} />
            <Analytics />
          </ThemeContextProvider>
        </NextUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
