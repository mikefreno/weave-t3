import React, { useContext } from "react";
import CommentsIcon from "@/src/icons/CommentsIcon";
import ThemeContext from "../ThemeContextProvider";

const ChatModal = (props: { isDarkTheme: boolean }) => {
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
          <CommentsIcon
            height={144}
            width={144}
            color={isDarkTheme ? "#f4f4f5" : "#27272a"}
            strokeWidth={0.5}
          />
        </span>
        <div className="text-[#171717] dark:text-[#E2E2E2]">
          <h3 className="text-md text-center">Chat in an invite-only space</h3>
          <p className="text-center text-sm">
            Admin controlled individual privileges allow for flexibly creating
            the spaces you want.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
