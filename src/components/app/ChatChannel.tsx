import DoubleChevrons from "@/src/icons/DoubleChevrons";
import PaperClip from "@/src/icons/PaperClip";
import SendIcon from "@/src/icons/SendIcon";
import { api } from "@/src/utils/api";
import { Button, Input, Loading, Tooltip } from "@nextui-org/react";
import {
  Comment,
  Server,
  Server_Admin,
  Server_Channel,
  Server_Member,
  User,
} from "@prisma/client";
import Image from "next/image";
import React, {
  Dispatch,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useOnClickOutside from "../ClickOutsideHook";
import ThemeContext from "../ThemeContextProvider";
import AttachmentModal from "./AttachmentModal";
import TopBanner from "./TopBanner";
import UserTooltip from "./UserTooltip";

type CommentWithUser = {
  id: number;
  userId: string;
  message: string;
  channelID: number;
  user: User;
};

const ChannelMain = (props: {
  selectedChannel: Server_Channel;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
  socket: WebSocket;
  setSocket: any;
  fullscreen: boolean;
}) => {
  const { selectedChannel, currentUser, socket, setSocket, fullscreen } = props;
  const [messageSendLoading, setMessageSendLoading] = useState(false);
  const [iconClass, setIconClass] = useState("");
  const { isDarkTheme } = useContext(ThemeContext);
  const [attachmentModalShowing, setAttachmentModalShowing] = useState(false);
  const attachmentButtonRef = useRef<HTMLButtonElement>(null);
  const attachmentModalRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<CommentWithUser[]>([]);
  const getMessages = api.server.getChannelComments.useMutation({});
  const [paddingAdded, setPaddingAdded] = useState<boolean>(false);

  const getComments = async () => {
    const comments = await getMessages.mutateAsync(selectedChannel.id);
    setMessages(comments);
  };

  useEffect(() => {
    getComments();
    if (socket.readyState === 0) {
      const newSocket = new WebSocket(
        process.env.NEXT_PUBLIC_WEBSOCKET as string
      );
      setSocket(newSocket);
    }
    const payload = {
      senderID: currentUser.id,
      channelID: selectedChannel.id,
      channelUpdate: true,
    };
    socket.send(JSON.stringify(payload));
  }, [selectedChannel]);

  socket.onmessage = async (event) => {
    const comments = await getMessages.mutateAsync(selectedChannel.id);
    setMessages(comments);
  };
  const manualReconnect = () => {
    if (socket.readyState === 0 || socket.readyState === 2) {
      const newSocket = new WebSocket(
        process.env.NEXT_PUBLIC_WEBSOCKET as string
      );
      setSocket(newSocket);
    }
  };
  const sendMessage = async (e: any) => {
    e.preventDefault();
    const input = messageInputRef.current?.value;
    if (input!.length > 0) {
      setIconClass("move-fade");
      const payload = {
        message: input,
        senderID: currentUser.id,
        channelID: selectedChannel.id,
        channelUpdate: false,
      };
      socket.send(JSON.stringify(payload));
      messageInputRef.current!.value = "";
      setTimeout(() => {
        setIconClass("");
      }, 500);
    }
  };
  useOnClickOutside([attachmentModalRef, attachmentButtonRef], () => {
    setAttachmentModalShowing(false);
  });

  const attachmentModalToggle = () => {
    setAttachmentModalShowing(!attachmentModalShowing);
  };

  const paddingToggle = () => {
    setPaddingAdded(!paddingAdded);
  };

  const UsersCommentClass =
    "shadow-lg text-zinc-100 shadow-zinc-400 dark:shadow-zinc-700 bg-purple-700 rounded-2xl py-5 px-6";
  const OtherCommentsClass =
    "bg-zinc-200 shadow-lg dark:bg-zinc-800 dark:shadow-zinc-700 rounded-2xl py-5 px-6";

  return (
    <>
      <div className="">
        <div className="scrollXDisabled h-screen rounded bg-zinc-50 dark:bg-zinc-900">
          <TopBanner currentChannel={selectedChannel} fullscreen={fullscreen} />
          <div className="scrollXDisabled overflow-y-scroll pt-8 pb-24">
            <ul className={`${fullscreen ? "w-screen" : "w-full"} pt-6`}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.userId == currentUser.id
                      ? "my-4 flex justify-end pr-9"
                      : "my-4 flex pl-3"
                  }
                >
                  <li
                    className={
                      message.userId == currentUser.id
                        ? UsersCommentClass
                        : OtherCommentsClass
                    }
                  >
                    <div className="-ml-3 -mt-3 text-xs font-semibold">
                      {message.user.name}
                    </div>
                    <div
                      className={`${
                        message.user.id == currentUser.id ? "text-right" : ""
                      } relative `}
                    >
                      {message.message}
                    </div>
                    {message.userId == currentUser.id ? null : (
                      <div>
                        <div className="-ml-8 mt-1 -mb-12">
                          {message.user.name !== "User Deleted" ? (
                            <Tooltip
                              content={<UserTooltip user={message.user} />}
                              color="default"
                              placement="topStart"
                            >
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
                      </div>
                    )}
                  </li>
                </div>
              ))}
            </ul>
          </div>
          {socket.readyState == 0 ? (
            <div className="flex flex-col items-center justify-center pt-[30vh]">
              <button onClick={manualReconnect}>Connect</button>
            </div>
          ) : socket.readyState == 2 ? (
            <div className="flex flex-col items-center justify-center pt-[30vh]">
              Disconnected, click channel button to reconnect
              <button
                className="mt-2 w-min rounded-sm border px-4 py-2"
                onClick={manualReconnect}
              >
                Reconnect
              </button>
            </div>
          ) : null}

          <div
            className={`fixed bottom-0 ${fullscreen ? "w-screen" : "w-full"}`}
          >
            <button
              className="absolute right-0 z-50 -mt-12 md:hidden"
              onClick={paddingToggle}
            >
              {paddingAdded ? (
                <div className="-rotate-90 transform transition-all duration-500 ease-in-out">
                  <DoubleChevrons
                    height={36}
                    width={36}
                    stroke={isDarkTheme ? "#fafafa" : "#18181b"}
                    strokeWidth={1}
                  />
                </div>
              ) : (
                <div className="rotate-90 transform transition-all duration-300 ease-in-out">
                  <DoubleChevrons
                    height={36}
                    width={36}
                    stroke={isDarkTheme ? "#fafafa" : "#18181b"}
                    strokeWidth={1}
                  />
                </div>
              )}
            </button>
            <div
              className={`${
                paddingAdded ? "pb-24" : "pb-4"
              } bg-zinc-100 dark:bg-zinc-700 md:pb-0`}
            >
              <div className="mx-auto p-4">
                <form onSubmit={sendMessage}>
                  <Input
                    css={{ width: "100%" }}
                    ref={messageInputRef}
                    contentClickable
                    status="secondary"
                    contentRight={
                      <div className="-ml-6 flex">
                        <button
                          ref={attachmentButtonRef}
                          className="rounded-full px-2"
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
                          {messageSendLoading ? (
                            <Loading size="xs" />
                          ) : (
                            <div className={iconClass}>
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
        {attachmentModalShowing ? (
          <AttachmentModal
            toggle={attachmentModalToggle}
            attachmentModalRef={attachmentModalRef}
          />
        ) : null}
      </div>
    </>
  );
};

export default ChannelMain;
