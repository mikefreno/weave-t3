import React, { useContext } from "react";
import ShieldIcon from "@/src/icons/ShieldIcon";
import ThemeContext from "../ThemeContextProvider";

function SecurityModal(props: { fill: string }) {
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
        } rounded-2xl p-4 shadow-2xl md:w-60`}
      >
        <span className="flex justify-center">
          <ShieldIcon height={144} width={144} fill={props.fill} />
        </span>
        <div className="text-[#171717] dark:text-[#E2E2E2]">
          <h3 className="text-md text-center">Control Your Data Flow</h3>
          <p className="text-center text-sm">
            Soft requests allow the user to not share the requested info but
            still join the group, hard requests must be accepted to join. (Full
            Name, current activity, etc.)
          </p>
        </div>
      </div>
    </div>
  );
}

export default SecurityModal;
