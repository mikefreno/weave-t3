import React, { useContext, useEffect, useState } from "react";
import { Server_Channel } from "@prisma/client";
import HeadphonesIcon from "@/src/icons/HeadphonesIcon";
import CommentsIcon from "@/src/icons/CommentsIcon";
import ThemeContext from "../ThemeContextProvider";

export default function TopBanner(props: {
  selectedChannel: Server_Channel;
  fullscreen: boolean;
}) {
  const { isDarkTheme } = useContext(ThemeContext);
  const { selectedChannel, fullscreen } = props;

  const [channelName, setChannelName] = useState(selectedChannel.name);

  useEffect(() => {
    setChannelName(selectedChannel.name);
  }, [selectedChannel]);

  return (
    <div
      className={`fixed top-0 z-10 my-auto h-14 ${
        fullscreen ? "w-screen" : "w-full"
      } bg-purple-400 dark:bg-zinc-700`}
    >
      <div className="flex items-center pl-6 pt-3 text-xl underline underline-offset-8">
        {selectedChannel.type == "voice" ? (
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
        <div className="z-[1000] mx-6">{channelName}</div>
      </div>
    </div>
  );
}
