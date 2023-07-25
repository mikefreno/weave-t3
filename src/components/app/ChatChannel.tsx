import DoubleChevrons from "@/src/icons/DoubleChevrons";
import PaperClip from "@/src/icons/PaperClip";
import SendIcon from "@/src/icons/SendIcon";
import { api } from "@/src/utils/api";
import { Input, Tooltip } from "@nextui-org/react";
import { Server, Server_Admin, Server_Channel, Server_Member, User, Comment, Reaction } from "@prisma/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import useOnClickOutside from "../ClickOutsideHook";
import ThemeContext from "../ThemeContextProvider";
import AttachmentModal from "./AttachmentModal";
import TopBanner from "./TopBanner";
import UserTooltip from "./UserTooltip";
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
import AdjustableLoadingElement from "../AdjustableLoadingElement";

interface ChannelMainProps {
  selectedChannel: Server_Channel;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
  socket: WebSocket | null;
  serverReactions: string | null | undefined;
}
const UsersCommentClass =
  "shadow-lg text-zinc-100 relative shadow-zinc-400 dark:shadow-zinc-700 bg-purple-700 rounded-2xl py-5 px-6 max-w-[75%]";
const OtherCommentsClass =
  "bg-zinc-100 shadow-lg relative dark:bg-zinc-800 dark:shadow-zinc-700 rounded-2xl py-5 pr-6 pl-8 max-w-[75%]";

export default function ChatChannel(props: ChannelMainProps) {
  const { selectedChannel, currentUser, socket, serverReactions } = props;
  const { isDarkTheme } = useContext(ThemeContext);
  //state
  const [height, setHeight] = useState<number>();
  const [messageSendLoading, setMessageSendLoading] = useState(false);
  const [iconClass, setIconClass] = useState("");
  const [attachmentModalShowing, setAttachmentModalShowing] = useState(false);
  const [messages, setMessages] = useState<
    (Comment & {
      user: User;
      reactions: Reaction[];
    })[]
  >([]);
  const [serverEmojiArray, setServerEmojiArray] = useState<string[]>([]);
  const [messageClickedMap, setMessageClickedMap] = useState<Map<number, boolean>>(new Map());
  //ref
  const messageInputRef = useRef<HTMLInputElement>(null);
  const attachmentButtonRef = useRef<HTMLButtonElement>(null);
  const attachmentModalRef = useRef<HTMLDivElement>(null);
  const inputDivRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const firstScrollDone = useRef<boolean>(false);

  //trpc (api)
  const getMessagesQuery = api.server.getChannelComments.useQuery(selectedChannel.id);

  //hooks
  useOnClickOutside([attachmentModalRef, attachmentButtonRef], () => {
    setAttachmentModalShowing(false);
  });

  useEffect(() => {
    const handleResize = () => {
      if (bannerRef.current && inputDivRef.current) {
        const bodyHeight = window.innerHeight - (bannerRef.current.clientHeight + inputDivRef.current.clientHeight);
        setHeight(bodyHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [bannerRef.current, inputDivRef.current]);

  useEffect(() => {
    if (getMessagesQuery.data) {
      const messages = getMessagesQuery.data;
      if (messages) {
        setMessages(messages);
      }
    }
    firstScrollDone.current = false;
  }, [selectedChannel, getMessagesQuery]);

  useEffect(() => {
    if (serverReactions) {
      const reactionArray = serverReactions.split(",");
      setServerEmojiArray(reactionArray);
    }
  }, [serverReactions]);

  useEffect(() => {
    if (firstScrollDone.current == false && bottomRef.current) {
      bottomRef.current.scrollIntoView();
      firstScrollDone.current = true;
    }
    messages.forEach((message) => {
      setMessageClickedMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(message.id, false);
        return newMap;
      });
    });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (event) => {
        console.log(event.data);
        if (event.data.message !== "Internal server error") {
          getMessagesQuery.refetch();
        }
      };
    }
  }, [socket]);

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

  //toggles
  const attachmentModalToggle = () => {
    setAttachmentModalShowing(!attachmentModalShowing);
  };
  //user functions
  const sendMessage = async (e: any) => {
    e.preventDefault();
    const input = messageInputRef.current?.value;
    if (input!.length > 0) {
      setIconClass("move-fade");
      const data = {
        message: input,
        senderID: currentUser.id,
        channelID: selectedChannel.id,
        action: "message",
      };
      socket?.send(JSON.stringify(data));
      messageInputRef.current!.value = "";
      setTimeout(() => {
        setIconClass("");
      }, 500);
    }
  };
  const updateClickedMap = (commentID: number) => {
    setMessageClickedMap((prevMap) => {
      const newMap = new Map(prevMap);
      const currentValue = newMap.get(commentID);
      newMap.set(commentID, !currentValue);
      return newMap;
    });
  };

  const giveReaction = async (reactionGiven: string, commentID: number) => {
    // await commentReactionGivenMutation.mutateAsync({
    //   reaction: reactionGiven,
    //   commentID: commentID,
    //   reactingUserID: currentUser.id,
    // });
    const data = {
      message: "",
      senderID: currentUser.id,
      channelID: selectedChannel.id,
      action: "message",
      reaction: true,
      reactionType: reactionGiven,
      messageID: commentID,
    };
    socket?.send(JSON.stringify(data));
    getMessagesQuery.refetch();
  };

  const getReactionCount = (
    comment: Comment & {
      user: User;
      reactions: Reaction[];
    },
    emojiName: string
  ) => {
    let count = 0;
    comment.reactions.forEach((reaction) => {
      if (reaction.type === emojiName) {
        count = reaction.count;
      }
    });
    return count;
  };

  return (
    <>
      <div className="">
        <div className="scrollXDisabled h-screen w-full rounded bg-zinc-50 transition-colors duration-300 ease-in-out dark:bg-zinc-900">
          <div ref={bannerRef}>
            <TopBanner key={selectedChannel.id} selectedChannel={selectedChannel} />
          </div>
          <div className="flex h-screen flex-col justify-end">
            <ul className="w-full overflow-y-scroll px-4 pb-24 pt-14">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.userId == currentUser.id ? "flex justify-end py-4 pr-9" : "flex py-4"}
                >
                  <div
                    className={message.userId == currentUser.id ? UsersCommentClass : OtherCommentsClass}
                    onClick={() => updateClickedMap(message.id)}
                  >
                    <div className="text-xs font-semibold">{message.user.name}</div>
                    <div className={`${message.user.id == currentUser.id ? "text-right" : ""} relative w-fit`}>
                      {message.message}
                    </div>
                    {message.userId == currentUser.id ? null : (
                      <div className="-mb-12 -ml-8 mt-1 w-min">
                        {message.user.name !== "User Deleted" ? (
                          <Tooltip content={<UserTooltip user={message.user} />} color="default" placement="topStart">
                            <button>
                              <img
                                src={message.user.image as string}
                                alt={`${message.user.name} - avi`}
                                width={36}
                                height={36}
                                className="rounded-full"
                              />
                            </button>
                          </Tooltip>
                        ) : (
                          <div className="pb-10" />
                        )}
                      </div>
                    )}
                    {messageClickedMap.get(message.id) && currentUser.id !== message.user.id ? (
                      <div className="-mb-3 ml-6 mt-3 max-w-sm overflow-scroll rounded-lg md:overflow-auto ">
                        <div className="flex justify-between">
                          {serverEmojiArray.map((emojiName: string, index) => (
                            <div className="flex" key={index}>
                              <div className="flex">
                                <button onClick={() => giveReaction(emojiName, message.id)}>
                                  <div className="h-7 w-7">{returnEmoji(emojiName)}</div>
                                </button>
                                <div className="my-auto px-1 text-sm text-black dark:text-white">
                                  {getReactionCount(message, emojiName)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="-mb-3 ml-6 mt-3 max-w-sm overflow-scroll rounded-lg">
                        <div className="flex justify-between">
                          {serverEmojiArray.map((emojiName: string, index) => (
                            <div className="flex" key={index}>
                              {getReactionCount(message, emojiName) !== 0 ? (
                                <div className="flex">
                                  {currentUser.id === message.user.id ? (
                                    <>
                                      <div className="h-7 w-7">{returnEmoji(emojiName)}</div>
                                    </>
                                  ) : (
                                    <button onClick={() => giveReaction(emojiName, message.id)}>
                                      <div className="h-7 w-7">{returnEmoji(emojiName)}</div>
                                    </button>
                                  )}
                                  <div className="my-auto px-1 text-sm text-black dark:text-white">
                                    {getReactionCount(message, emojiName)}
                                  </div>
                                </div>
                              ) : null}
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
          </div>
          <div ref={inputDivRef} className="fixed bottom-0 w-full">
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
                      <div className="-ml-7 flex">
                        <button
                          ref={attachmentButtonRef}
                          className="-ml-1 rounded-full pr-3"
                          onClick={attachmentModalToggle}
                          type="button"
                        >
                          <PaperClip
                            height={16}
                            strokeWidth={1}
                            width={16}
                            stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                          />
                        </button>
                        <button type="submit">
                          <div className={iconClass}>
                            <SendIcon
                              height={16}
                              strokeWidth={1}
                              width={16}
                              color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                            />
                          </div>
                        </button>
                      </div>
                    }
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
        {attachmentModalShowing ? (
          <AttachmentModal toggle={attachmentModalToggle} attachmentModalRef={attachmentModalRef} />
        ) : null}
      </div>
    </>
  );
}
