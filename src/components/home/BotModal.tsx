import React, { useContext } from "react";
import RobotIcon from "@/src/icons/RobotIcon";
import ThemeContext from "../ThemeContextProvider";

function BotModal(props: { fill: string }) {
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
        } rounded-2xl p-4 shadow-2xl md:w-72`}
      >
        <span className="flex justify-center">
          <RobotIcon height={144} width={144} fill={props.fill} />
        </span>
        <div className="text-[#171717] dark:text-[#E2E2E2]">
          <h3 className="text-md text-center">Ready-made Bots</h3>
          <p className="text-center text-sm">
            Pre-built bots for productivity and entertainment. User extensible,
            or BYOB (bring your own bot)!
          </p>
        </div>
      </div>
    </div>
  );
}

export default BotModal;
