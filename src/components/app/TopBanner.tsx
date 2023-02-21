import React, { useContext } from "react";
import { Server_Channel } from "@prisma/client";
import HeadphonesIcon from "@/src/icons/HeadphonesIcon";
import CommentsIcon from "@/src/icons/CommentsIcon";
import ThemeContext from "../ThemeContextProvider";

const TopBanner = (props: { currentChannel?: Server_Channel }) => {
  const { isDarkTheme } = useContext(ThemeContext);

  const { currentChannel } = props;
  const context = () => {
    if (currentChannel) {
      return (
        <div className="top-0 my-auto h-14 bg-zinc-700">
          <div className="flex items-center pl-6 pt-3 text-xl underline underline-offset-8">
            {currentChannel.type == "voice" ? (
              <HeadphonesIcon
                height={36}
                width={36}
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
              />
            ) : (
              <CommentsIcon
                height={36}
                width={36}
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                strokeWidth={1}
              />
            )}
            <div className="mx-6">{currentChannel.name}</div>
          </div>
        </div>
      );
    }
  };
  return <>{context()}</>;
};

export default TopBanner;
