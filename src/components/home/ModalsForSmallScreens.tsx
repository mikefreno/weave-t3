import React, { useContext } from "react";
import ThemeContext from "../ThemeContextProvider";
import BotModal from "./BotModal";
import ChatModal from "./ChatModal";
import ConfigModal from "./ConfigModal";
import GameModal from "./GameModal";
import SecurityModal from "./SecurityModal";
import WorkModal from "./WorkModal";

function ModalsForSmallScreens() {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <div className="absolute z-20 mt-12 w-screen sm:mt-24">
      <div className="mx-auto grid w-11/12 grid-flow-col grid-rows-3 gap-2 sm:grid-rows-2">
        <div className="animate-up-down layer2">
          <ChatModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
        <div className="animate-up-down layer1">
          <GameModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
        <div className="animate-up-down layer3">
          <WorkModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
        <div className="animate-up-down layer3">
          <BotModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
        <div className="animate-up-down layer1">
          <ConfigModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
        <div className="animate-up-down layer2">
          <SecurityModal fill={`${isDarkTheme ? "#d4d4d8" : "#27272a"}`} />
        </div>
      </div>
    </div>
  );
}

export default ModalsForSmallScreens;
