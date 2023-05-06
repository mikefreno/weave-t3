import React, { useContext, useEffect, useState } from "react";
import { Server_Channel } from "@prisma/client";
import CommentsIcon from "@/src/icons/CommentsIcon";
import ThemeContext from "../ThemeContextProvider";
import SpeakerOn from "@/src/icons/SpeakerOn";
import VideoCamIcon from "@/src/icons/VideoCamIcon";
import UserCircle from "@/src/icons/UserCircle";
import { Button, Tooltip } from "@nextui-org/react";
import AddFriendIcon from "@/src/icons/AddFriendIcon";
import { api } from "@/src/utils/api";

export default function TopBanner(props: { selectedChannel: Server_Channel; fullscreen: boolean }) {
  const { selectedChannel, fullscreen } = props;

  const { isDarkTheme } = useContext(ThemeContext);

  const [channelName, setChannelName] = useState(selectedChannel.name);
  const [isFriend, setIsFriend] = useState<boolean>(true);
  const [friendRequestExists, setFriendRequestExists] = useState<boolean>(false);
  const sendFriendRequestMutation = api.friends.sendFriendRequest.useMutation();
  const getFriendStateMutation = api.friends.checkFriendState.useMutation();
  const getFriendRequestStateMutation = api.friends.checkFriendRequestState.useMutation();

  useEffect(() => {
    friendStateSetter();
  }, [selectedChannel]);

  const friendStateSetter = async () => {
    if (selectedChannel.type === "friend" && selectedChannel.description) {
      const res = await getFriendStateMutation.mutateAsync(selectedChannel.description);
      const res2 = await getFriendRequestStateMutation.mutateAsync(selectedChannel.description);
      setIsFriend(res);
      setFriendRequestExists(res2);
    }
  };

  useEffect(() => {
    setChannelName(selectedChannel.name);
  }, [selectedChannel]);

  const sendFriendRequest = async () => {
    await sendFriendRequestMutation.mutateAsync(selectedChannel.description as string);
    friendStateSetter();
  };

  return (
    <div
      className={`fixed top-0 z-10 my-auto h-14 ${fullscreen ? "w-screen" : "w-full"} bg-purple-400 dark:bg-zinc-700`}
    >
      <div
        className={`${
          fullscreen ? "pl-16" : "pl-6"
        } flex items-center pt-3 text-xl underline underline-offset-8 md:pl-6`}
      >
        {selectedChannel.type == "audio" ? (
          <SpeakerOn height={36} width={36} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1} />
        ) : selectedChannel.type == "text" ? (
          <CommentsIcon height={36} width={36} color={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1} />
        ) : selectedChannel.type == "video" ? (
          <VideoCamIcon height={24} width={24} strokeWidth={0.5} color={isDarkTheme ? "#e4e4e7" : "#27272a"} />
        ) : (
          <UserCircle height={24} width={24} strokeWidth={0.5} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} />
        )}
        <div className="z-[1000] mx-6">{channelName}</div>
        {isFriend === false ? (
          friendRequestExists ? (
            <Tooltip content={"Friend Request already exists"} placement="bottom">
              <Button color={"secondary"} auto disabled>
                <AddFriendIcon height={20} width={20} stroke={"white"} strokeWidth={1.5} />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content={"Add as friend?"} placement="bottom">
              <Button color={"secondary"} auto onClick={sendFriendRequest}>
                <AddFriendIcon height={20} width={20} stroke={"white"} strokeWidth={1.5} />
              </Button>
            </Tooltip>
          )
        ) : null}
      </div>
    </div>
  );
}
