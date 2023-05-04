import CircleSlashIcon from "@/src/icons/CircleSlashIcon";
import PaperClip from "@/src/icons/PaperClip";
import SendIcon from "@/src/icons/SendIcon";
import { api } from "@/src/utils/api";
import { Button, Input, Loading, Tooltip } from "@nextui-org/react";
import {
  Conversation,
  Conversation_junction,
  DirectMessage,
  Friend_Request,
  Friend_Request_junction,
  Friendship,
  Friendship_junction,
  Reaction,
  Server,
  Server_Admin,
  Server_Member,
  User,
} from "@prisma/client";
import { useContext, useEffect, useRef, useState } from "react";
import ThemeContext from "../ThemeContextProvider";
import TopBanner from "./TopBanner";
import AdjustableLoadingElement from "../AdjustableLoadingElement";
//emojis
import AngryEmoji from "@/src/icons/emojis/Angry.svg";
import BlankEmoji from "@/src/icons/emojis/Blank.svg";
import CryEmoji from "@/src/icons/emojis/Cry.svg";
import ExcitedEmoji from "@/src/icons/emojis/Excited.svg";
import FlatEmoji from "@/src/icons/emojis/Flat.svg";
import HeartEyeEmoji from "@/src/icons/emojis/HeartEye.svg";
import MoneyEyeEmoji from "@/src/icons/emojis/MoneyEye.svg";
import ShiftyEmoji from "@/src/icons/emojis/Shifty.svg";
import SickEmoji from "@/src/icons/emojis/Sick.svg";
import SilentEmoji from "@/src/icons/emojis/Silent.svg";
import SmirkEmoji from "@/src/icons/emojis/Smirk.svg";
import TearsEmoji from "@/src/icons/emojis/Tears.svg";
import ThumbsUpEmoji from "@/src/icons/emojis/ThumbsUp.svg";
import TongueEmoji from "@/src/icons/emojis/Tongue.svg";
import UpsideDownEmoji from "@/src/icons/emojis/UpsideDown.svg";
import WorriedEmoji from "@/src/icons/emojis/Worried.svg";
import HeartEmoji from "@/src/icons/emojis/Heart.svg";

interface DMPagesProps {
  selectedInnerTab: string;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
  setConversationPage: (conversationID: number) => void;
  requestedConversationID: number | null;
  fullscreen: boolean;
  triggerDMRefetch: () => void;
  conversations:
    | (Conversation & {
        conversation_junction: (Conversation_junction & {
          user: User;
        })[];
        directMessage: DirectMessage[];
      })[]
    | undefined;
  friendRequests:
    | (Friend_Request & {
        friendRequest_junction: (Friend_Request_junction & {
          user: User;
        })[];
      })[]
    | undefined;
  friendshipList:
    | (Friendship & {
        friendship_junction: (Friendship_junction & {
          user: User;
        })[];
      })[]
    | undefined;
  selectedConversation:
    | (Conversation & {
        conversation_junction: (Conversation_junction & {
          user: User;
        })[];
        directMessage: (DirectMessage & {
          reactions: Reaction[];
        })[];
      })
    | null;
  conversedUser: User | undefined;
  socket: WebSocket | null;
}

const UsersCommentClass =
  "shadow-lg text-zinc-100 relative shadow-zinc-400 dark:shadow-zinc-700 bg-purple-700 rounded-2xl p-5 max-w-[75%]";
const OtherCommentsClass =
  "bg-zinc-100 shadow-lg relative dark:bg-zinc-800 dark:shadow-zinc-700 rounded-2xl p-5 max-w-[75%]";
const usersEmojiArray: string[] = ["thumbsUp", "heart", "heartEye", "excited", "angry", "cry", "sick", "flat", "blank"];

export default function DMPages(props: DMPagesProps) {
  const {
    selectedInnerTab,
    currentUser,
    setConversationPage,
    fullscreen,
    triggerDMRefetch,
    selectedConversation,
    friendshipList,
    friendRequests,
    conversations,
    conversedUser,
    socket,
  } = props;
  const { isDarkTheme } = useContext(ThemeContext);
  //state
  const [messageSendLoading, setMessageSendLoading] = useState<boolean>(false);
  const [messageClickedMap, setMessageClickedMap] = useState<Map<number, boolean>>(new Map());
  const [directMessages, setDirectMessages] = useState<
    (DirectMessage & {
      reactions: Reaction[];
    })[]
  >();
  const [showingIgnored, setShowingIgnored] = useState<boolean>(false);

  //refs
  const messageInputRef = useRef<HTMLInputElement>(null);
  const attachmentButtonRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const firstScrollDone = useRef<boolean>(false);

  //trpc (api)
  //friends api
  const deleteFriendRequestMutation = api.friends.deleteFriendRequest.useMutation();
  const ignoreFriendRequestMutation = api.friends.ignoreFriendRequest.useMutation();
  const acceptFriendRequestMutation = api.friends.acceptFriendRequest.useMutation();
  //conversation api
  const deleteConversationMutation = api.conversation.deleteConversation.useMutation();
  const ignoreConversationMutation = api.conversation.ignoreConversation.useMutation();
  const acceptConversationMutation = api.conversation.acceptConversation.useMutation();
  const directMessageGiveReactionMutation = api.conversation.directMessageGiveReaction.useMutation();
  const getDirectMessagesQuery = api.conversation.getDirectMessages.useQuery(selectedConversation?.id);

  useEffect(() => {
    if (firstScrollDone.current == false && bottomRef.current) {
      bottomRef.current.scrollIntoView();
      firstScrollDone.current = true;
    }
    selectedConversation?.directMessage.forEach((message) => {
      setMessageClickedMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(message.id, false);
        return newMap;
      });
    });
  }, [selectedConversation?.directMessage]);

  //friend functions
  const deleteFriendRequest = async (friendRequestID: number) => {
    await deleteFriendRequestMutation.mutateAsync(friendRequestID);
    triggerDMRefetch();
  };
  const ignoreFriendRequest = async (friendRequestID: number) => {
    await ignoreFriendRequestMutation.mutateAsync({ requestID: friendRequestID, targetBoolean: !showingIgnored });
    triggerDMRefetch();
  };
  const acceptFriendRequest = async (requestID: number, senderID: string) => {
    await acceptFriendRequestMutation.mutateAsync({ requestID: requestID, senderID: senderID });
    triggerDMRefetch();
  };

  //conversation functions
  const deleteDMRequest = async (conversationID: number) => {
    await deleteConversationMutation.mutateAsync(conversationID);
    triggerDMRefetch();
  };
  const ignoreDMRequest = async (conversationID: number) => {
    await ignoreConversationMutation.mutateAsync(conversationID);
    triggerDMRefetch();
  };
  const acceptDMRequest = async (conversationID: number) => {
    await acceptConversationMutation.mutateAsync(conversationID);
    triggerDMRefetch();
  };

  const updateClickedMap = (commentID: number) => {
    setMessageClickedMap((prevMap) => {
      const newMap = new Map(prevMap);
      const currentValue = newMap.get(commentID);
      newMap.set(commentID, !currentValue);
      return newMap;
    });
  };
  useEffect(() => {
    if (getDirectMessagesQuery.data && getDirectMessagesQuery.data !== "no input") {
      setDirectMessages(getDirectMessagesQuery.data);
    }
  }, [getDirectMessagesQuery]);

  useEffect(() => {
    if (selectedConversation && socket) {
      try {
        socket.send(
          JSON.stringify({
            senderID: currentUser?.id,
            conversationID: selectedConversation.id,
            updateType: "channel",
          })
        );
      } catch (e) {
        console.log(e);
      }
    }
  }, [selectedConversation, socket]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (event) => {
        console.log("fired onmessage");
        getDirectMessagesQuery.refetch();
      };
    }
  }, [socket]);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    setMessageSendLoading(true);
    const input = messageInputRef.current?.value;
    if (input!.length > 0 && selectedConversation) {
      const data = {
        message: input,
        senderID: currentUser.id,
        conversationID: selectedConversation.id,
        action: "message",
      };
      socket?.send(JSON.stringify(data));
      messageInputRef.current!.value = "";
    }
    setMessageSendLoading(false);
  };

  const returnEmoji = (emojiName: string) => {
    switch (emojiName) {
      case "thumbsUp":
        return (
          <div className="fill-emerald-400">
            <ThumbsUpEmoji />
          </div>
        );
      case "thumbsDown":
        return (
          <div className="rotate-180 fill-rose-400">
            <ThumbsUpEmoji />
          </div>
        );
      case "angry":
        return <AngryEmoji />;
      case "blank":
        return <BlankEmoji />;
      case "cry":
        return <CryEmoji />;
      case "excited":
        return <ExcitedEmoji />;
      case "flat":
        return <FlatEmoji />;
      case "heartEye":
        return <HeartEyeEmoji />;
      case "heart":
        return (
          <div className="fill-rose-600">
            <HeartEmoji />
          </div>
        );
      case "moneyEye":
        return <MoneyEyeEmoji />;
      case "shifty":
        return <ShiftyEmoji />;
      case "sick":
        return <SickEmoji />;
      case "silent":
        return <SilentEmoji />;
      case "smirk":
        return <SmirkEmoji />;
      case "tears":
        return <TearsEmoji />;
      case "tongue":
        return <TongueEmoji />;
      case "upsideDown":
        return <UpsideDownEmoji />;
      case "worried":
        return <WorriedEmoji />;
    }
  };

  const giveReaction = async (reactionGiven: string, directMessage: number) => {
    // const res = await directMessageGiveReactionMutation.mutateAsync({
    //   reaction: reactionGiven,
    //   dmID: directMessage,
    // });
    const data = {
      message: "",
      senderID: currentUser.id,
      conversationID: selectedConversation?.id,
      action: "message",
      reaction: true,
      reactionType: reactionGiven,
      dmID: directMessage,
    };
    socket?.send(JSON.stringify(data));
    getDirectMessagesQuery.refetch();
  };

  const showingIgnoredToggle = () => {
    setShowingIgnored(!showingIgnored);
  };

  if (selectedConversation) {
    if (!conversedUser || !directMessages) {
      return (
        <div className="h-screen w-full overflow-y-scroll bg-zinc-50 dark:bg-zinc-900">
          <AdjustableLoadingElement />
        </div>
      );
    } else {
      return (
        <div className="scrollXDisabled h-screen w-full overflow-y-scroll bg-zinc-50 dark:bg-zinc-900">
          <TopBanner
            selectedChannel={{
              id: 0,
              name: conversedUser.name as string,
              ServerId: 0,
              description: conversedUser.id,
              type: "friend",
            }}
            fullscreen={fullscreen}
          />
          <ul className={`${fullscreen ? "w-screen" : "w-full"} overflow-y-scroll px-4 pb-24 pt-14`}>
            {directMessages.map((message) => (
              <div
                key={message.id}
                className={message.senderID === currentUser.id ? "flex justify-end py-4 pr-9" : "flex py-4"}
              >
                <div
                  className={message.senderID === currentUser.id ? UsersCommentClass : OtherCommentsClass}
                  onClick={() => updateClickedMap(message.id)}
                >
                  <div className={`${message.senderID === currentUser.id ? "text-right" : "text-left"} relative w-fit`}>
                    {message.message}
                  </div>
                  {messageClickedMap.get(message.id) && currentUser.id !== message.senderID ? (
                    <div className="-mb-3 ml-6 mt-3 max-w-sm overflow-scroll rounded-lg ">
                      <div className="flex">
                        {usersEmojiArray.map((emojiName: string, index) => (
                          <div className="flex p-1" key={index}>
                            <button onClick={() => giveReaction(emojiName, message.id)}>
                              <div className="h-7 w-7">{returnEmoji(emojiName)}</div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="-mb-3 ml-6 mt-3 max-w-sm overflow-scroll rounded-lg">
                      <div className="flex">
                        {message.reactions.map((reaction) => (
                          <div className="flex px-2" key={reaction.id}>
                            <div className="h-7 w-7">{returnEmoji(reaction.type)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </ul>
          <div className={`fixed bottom-0 ${fullscreen ? "w-screen" : "w-full"}`}>
            <div className="bg-zinc-100 pb-4 dark:bg-zinc-700 md:pb-0">
              <div className="mx-auto p-4">
                <form onSubmit={sendMessage}>
                  <Input
                    css={{ width: "100%" }}
                    aria-label="message input"
                    ref={messageInputRef}
                    contentClickable
                    status="secondary"
                    contentRight={
                      <div className="-ml-6 flex">
                        <button ref={attachmentButtonRef} className="rounded-full px-2" type="button">
                          <PaperClip
                            height={16}
                            strokeWidth={1}
                            width={16}
                            stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                          />
                        </button>
                        <button type="submit">
                          {messageSendLoading ? (
                            <Loading size="xs" />
                          ) : (
                            <div>
                              <SendIcon
                                height={16}
                                strokeWidth={1}
                                width={16}
                                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                              />
                            </div>
                          )}
                        </button>
                      </div>
                    }
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else if (selectedInnerTab == "friends") {
    if (!friendshipList) {
      return (
        <div className="h-screen w-full overflow-y-scroll bg-zinc-50 dark:bg-zinc-900">
          <AdjustableLoadingElement />
        </div>
      );
    } else {
      return (
        <div className="px-6 pt-12 text-center text-lg md:px-12 md:pt-24">
          <div className="flex justify-center pb-8 text-2xl tracking-widest">Friends</div>
          {friendshipList.length === 0 ? (
            <div className="rule-around px-8 italic">No friends yet</div>
          ) : (
            friendshipList.map((friendship) =>
              friendship.friendship_junction.map((junction) =>
                junction.userID !== currentUser.id ? (
                  <div key={junction.user.id}>
                    <Tooltip content={"Friend profiles will be implemented soon!"}>
                      <button className="h-24 w-24 rounded-full bg-purple-100 shadow-xl dark:bg-zinc-800">
                        <div></div>
                        <div className="px-4">{junction.user.name}</div>
                      </button>
                    </Tooltip>
                  </div>
                ) : null
              )
            )
          )}
        </div>
      );
    }
  } else {
    return (
      <div className="pt-12 text-center text-lg md:pt-24">
        <div className="flex justify-center pb-8 text-2xl tracking-widest">Friend Requests</div>
        <div className="flex w-full justify-end px-8">
          <Button size={"md"} color={"warning"} auto onClick={showingIgnoredToggle}>
            {showingIgnored ? "Hide Ignored" : "Show Ignored"}
          </Button>
        </div>
        <div className="px-2 md:px-8">
          {friendRequests?.filter(
            (friendRequest) => friendRequest.senderID !== currentUser.id && friendRequest.ignored === showingIgnored
          ).length === 0 ? (
            <div className="rule-around py-8 text-center italic">No active requests in</div>
          ) : (
            <ul className="py-8">
              {friendRequests
                ?.filter(
                  (friendRequest) =>
                    friendRequest.senderID !== currentUser.id && friendRequest.ignored === showingIgnored
                )
                .map((friendRequest, index) => (
                  <div
                    key={index}
                    className="mx-4 my-2 rounded-lg bg-purple-100 px-4 py-2 shadow-xl dark:bg-zinc-800 md:mx-8"
                  >
                    <div className="-ml-2">
                      <div className="flex">
                        <Tooltip content={"Become Friends!"}>
                          <Button
                            className="mx-1 rounded-sm bg-green-500 px-2 hover:bg-green-600 active:bg-green-700"
                            onClick={() => acceptFriendRequest(friendRequest.id, friendRequest.senderID)}
                            size={"sm"}
                            auto
                          >
                            <span>Accept</span>
                          </Button>
                        </Tooltip>
                        <Tooltip content={"Ignoring hides the request for you, but won't alert the sender"}>
                          <Button
                            className="mx-1 rounded-sm bg-orange-500 px-2 hover:bg-orange-600 active:bg-orange-700"
                            onClick={() => ignoreFriendRequest(friendRequest.id)}
                            color={"warning"}
                            size={"sm"}
                            auto
                          >
                            <span>{showingIgnored ? "Remove Ignore" : "Ignore"}</span>
                          </Button>
                        </Tooltip>
                        <Tooltip content={"Delete Request"}>
                          <Button
                            className="mx-1 rounded-sm bg-rose-500 hover:bg-rose-600 active:bg-rose-700"
                            onClick={() => deleteFriendRequest(friendRequest.id)}
                            auto
                            size={"sm"}
                            color={"error"}
                          >
                            <CircleSlashIcon height={16} width={16} stroke={"white"} strokeWidth={1} />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex w-full justify-evenly">
                      <div>From:</div>
                      <div>
                        {friendRequest.friendRequest_junction.map((junction) =>
                          junction.user.id !== currentUser.id ? junction.user.name : null
                        )}
                      </div>
                    </div>
                    <div className="flex justify-evenly">
                      <div>Sent on:</div>
                      <div>{friendRequest.sentAt.toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
            </ul>
          )}
          {friendRequests?.filter((friendRequests) => friendRequests.senderID === currentUser.id).length === 0 ? (
            <div className="rule-around py-8 text-center italic">No active requests out</div>
          ) : (
            friendRequests
              ?.filter((friendRequest) => friendRequest.senderID === currentUser.id)
              .map((friendRequest, index) => (
                <div
                  key={index}
                  className="mx-4 my-2 rounded-lg bg-purple-100 px-4 py-2 shadow-xl dark:bg-zinc-800 md:mx-8"
                >
                  <div className="absolute -ml-2">
                    <Tooltip content={"Delete Request"}>
                      <Button
                        className="bg-rose-500 p-1 hover:bg-rose-600 active:bg-rose-700"
                        onClick={() => deleteFriendRequest(friendRequest.id)}
                        auto
                        color={"error"}
                        size={"sm"}
                      >
                        <CircleSlashIcon height={16} width={16} stroke={"white"} strokeWidth={1} />
                      </Button>
                    </Tooltip>
                  </div>
                  <div className="flex w-full justify-evenly">
                    <div>To:</div>
                    <div>
                      {friendRequest.friendRequest_junction.map((junction) =>
                        junction.user.id !== currentUser.id ? junction.user.name : null
                      )}
                    </div>
                  </div>
                  <div className="flex justify-evenly">
                    <div>Sent on:</div>
                    <div>{friendRequest.sentAt.toLocaleDateString()}</div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    );
  }
}
