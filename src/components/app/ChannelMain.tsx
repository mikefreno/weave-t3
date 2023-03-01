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
import React, { useContext, useEffect, useRef, useState } from "react";
import useOnClickOutside from "../ClickOutsideHook";
import LoadingElement from "../loading";
import ThemeContext from "../ThemeContextProvider";
import AttachmentModal from "./AttachmentModal";
import TopBanner from "./TopBanner";

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
}) => {
  const { selectedChannel, currentUser, socket, setSocket } = props;
  const [messageSendLoading, setMessageSendLoading] = useState(false);
  const [iconClass, setIconClass] = useState("");
  const { isDarkTheme } = useContext(ThemeContext);
  const [attachmentModalShowing, setAttachmentModalShowing] = useState(false);
  const attachmentButtonRef = useRef<HTMLButtonElement>(null);
  const attachmentModalRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<CommentWithUser[]>([]);
  const getMessages = api.server.getChannelComments.useMutation({});

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
    console.log("send" + payload);
    socket.send(JSON.stringify(payload));
  }, [selectedChannel]);

  socket.onmessage = async (event) => {
    const comments = await getMessages.mutateAsync(selectedChannel.id);
    setMessages(comments);
  };

  socket.addEventListener("message", (event) => {
    console.log(`Received message: ${event.data}`);
  });

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

  const UsersCommentClass = "userCommentBGColor rounded-lg py-5 px-6";
  const OtherCommentsClass = "bg-zinc-800 rounded-lg py-5 px-6";

  return (
    <div className="">
      <TopBanner currentChannel={selectedChannel} />
      <div className="chatScreen container overflow-y-scroll rounded bg-zinc-900">
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
        {/* messages */}
        <ul className="pt-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.userId == currentUser.id
                  ? "my-4 flex justify-end"
                  : "my-4 flex"
              }
            >
              <li
                className={
                  message.userId == currentUser.id
                    ? UsersCommentClass
                    : OtherCommentsClass
                }
              >
                <div>{message.message}</div>
                {message.userId == currentUser.id ? null : (
                  <div>
                    {/* <div className="pt-2 text-sm">{message.user.name}</div> */}
                    <div className="absolute -ml-6 mt-1">
                      <Tooltip
                        content={message.user.name}
                        color="secondary"
                        placement="topStart"
                      >
                        <button>
                          <Image
                            src={message.user.image as string}
                            alt={`${message.user.name} - avi`}
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </li>
            </div>
          ))}
        </ul>
      </div>
      <div className="container bg-zinc-700">
        <div className="mx-2 pt-3 md:mx-6 lg:mx-8 xl:mx-12">
          <form onSubmit={sendMessage}>
            <Input
              ref={messageInputRef}
              css={{ width: "100%" }}
              contentClickable
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
      {attachmentModalShowing ? (
        <AttachmentModal
          toggle={attachmentModalToggle}
          attachmentModalRef={attachmentModalRef}
        />
      ) : null}
    </div>
  );
};

export default ChannelMain;
