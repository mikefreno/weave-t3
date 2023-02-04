import React, { createContext, useState, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { useTheme } from "@nextui-org/react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  useEffect(() => {
    setDarkTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    if (!isDarkTheme) {
      setTheme("light");
      document.getElementById("html")?.classList.remove("dark");
    } else {
      setTheme("dark");
      document.getElementById("html")?.classList.add("dark");
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
