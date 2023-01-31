import React, { createContext, useState, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { useTheme } from "@nextui-org/react";

const ThemeContext = createContext({
  isDarkTheme: false,
  switchDarkTheme: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const ThemeContextProvider: React.FC<Props> = ({ children }) => {
  const [isDarkTheme, setDarkTheme] = useState(false);
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();

  useEffect(() => {
    setDarkTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.getElementById("html")?.classList.add("dark");
    } else {
      document.getElementById("html")?.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (!isDarkTheme) {
      document.getElementById("html")?.classList.remove("dark");
      document.getElementById("html")?.setAttribute("class", "bg-zinc-300");
      document
        .getElementById("body")
        ?.setAttribute("class", "bgColorGradientLight");
      document
        .getElementById("bottomGradient")
        ?.setAttribute("class", "bottomGradientLight");
      setTheme("light");
    } else {
      document
        .getElementById("html")
        ?.setAttribute("class", "dark bg-[#262626]");
      document
        .getElementById("bottomGradient")
        ?.setAttribute("class", "bottomGradient");
      setTheme("dark");
      document.getElementById("body")?.setAttribute("class", "bgColorGradient");
    }
  }, [isDarkTheme]);

  function changeDarkMode() {
    setDarkTheme(() => {
      return !isDarkTheme;
    });
  }
  const context = {
    isDarkTheme: isDarkTheme,
    switchDarkTheme: changeDarkMode,
  };

  return (
    <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
