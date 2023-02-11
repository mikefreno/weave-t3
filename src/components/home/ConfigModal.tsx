import React from "react";
import CommandLineIcon from "@/src/icons/CommandLineIcon";

const ConfigModal = (props: { isDarkTheme: boolean }) => {
  const { isDarkTheme } = props;

  return (
    <div
      className={`z-50 rounded-2xl p-1 backdrop-blur ${
        isDarkTheme ? "darkBorder" : "lightBorder"
      }`}
    >
      <div
        className={`${
          isDarkTheme ? "transparentZinc800" : "transparentZinc300"
        } rounded-2xl p-4 shadow-2xl md:w-48`}
      >
        <span className="flex justify-center">
          <CommandLineIcon
            height={144}
            width={144}
            stroke={isDarkTheme ? "#f4f4f5" : "#27272a"}
            strokeWidth={0.5}
          />
        </span>
        <div className="text-[#171717] dark:text-[#E2E2E2]">
          <h3 className="text-md text-center">Highly configurable</h3>
          <p className="text-center text-sm">accessability or just per taste</p>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
