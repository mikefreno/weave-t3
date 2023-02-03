import React, { useContext } from "react";
import ThemeContext from "../ThemeContextProvider";
import GamepadIconThin from "@/src/icons/GamepadIcon-Thin";

const GameModal = (props: { fill: string }) => {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <div
      className={`z-50 rounded-2xl p-1 backdrop-blur ${
        isDarkTheme ? "darkBorder" : "lightBorder"
      }`}
    >
      <div
        className={`${
          isDarkTheme ? "transparentZinc800" : "transparentZinc300"
        } w-64 rounded-2xl p-4 shadow-2xl xl:w-96`}
      >
        <span className="flex justify-center">
          <GamepadIconThin height={120} width={160} color={props.fill} />
        </span>
        <div className="text-[#171717] dark:text-[#E2E2E2]">
          <h3 className="text-md text-center">Easy voice-lobby creation</h3>
          <p className="text-center text-sm">
            Currently-speaking overlays, and current game display allows you
            connect with friends quickly and easily.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
