import React, { useContext } from "react";
import GitHub from "@/src/icons/GitHub";
import LinkedIn from "@/src/icons/LinkedIn";
import Envelope from "@/src/icons/Envelope";
import ThemeContext from "../ThemeContextProvider";

const Footer = () => {
  const currentYear = new Date().getFullYear().toString();
  const { isDarkTheme } = useContext(ThemeContext);

  let copyright_tag = "2023";
  if (currentYear != "2023") {
    copyright_tag += ` - ${currentYear}`;
  }

  return (
    <div className="mx-auto mt-12 h-2/5 w-screen text-center text-zinc-800 dark:text-zinc-300">
      <ul className="icons mt-6">
        <li>
          <a
            href="https://github.com/MikeFreno/"
            target="_blank"
            rel="noreferrer"
            className="hvr-grow-rotate-left rounded-full border-zinc-800 dark:border-zinc-300"
          >
            <span className="m-auto">
              <GitHub
                height={16}
                width={16}
                fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`}
                stroke={undefined}
              />
            </span>
          </a>
        </li>
        <li>
          <a
            href="mailto:michael@freno.me"
            className="hvr-grow rounded-full border-zinc-800 dark:border-zinc-300"
          >
            <span className="m-auto">
              <Envelope
                height={16}
                width={16}
                fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`}
              />
            </span>
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/michael-freno-176001256/"
            target="_blank"
            rel="noreferrer"
            className="hvr-grow-rotate rounded-full border-zinc-800 dark:border-zinc-300"
          >
            <span className="m-auto">
              <LinkedIn
                height={16}
                width={16}
                fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`}
                stroke={undefined}
              />
            </span>
          </a>
        </li>
      </ul>
      <div className="mr-6 -mt-6 flex flex-col items-end pb-12 md:mr-24 md:pb-4">
        <span className="flex">©{copyright_tag}</span>
        <span className="flex">Michael Freno</span>
      </div>
    </div>
  );
};

export default Footer;
