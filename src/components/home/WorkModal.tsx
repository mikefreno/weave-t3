import React from "react";
import BriefcaseIcon from "@/src/icons/BriefcaseIcon";

const WorkModal = (props: { isDarkTheme: boolean }) => {
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
          <BriefcaseIcon
            height={144}
            width={144}
            stroke={isDarkTheme ? "#f4f4f5" : "#27272a"}
            strokeWidth={0.5}
          />
        </span>
        <div className="text-[#171717] dark:text-[#E2E2E2]">
          <h3 className="text-md text-center">Easy Coordination</h3>
          <p className="text-center text-sm">
            Be it in network heirarchy, current availabilty, real-name
            enforcement, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkModal;
