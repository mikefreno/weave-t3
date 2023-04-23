import DoubleChevrons from "@/src/icons/DoubleChevrons";
import PaperClip from "@/src/icons/PaperClip";
import SendIcon from "@/src/icons/SendIcon";
import { api } from "@/src/utils/api";
import { Input, Loading, Tooltip } from "@nextui-org/react";
import {
  Server,
  Server_Admin,
  Server_Channel,
  Server_Member,
  User,
} from "@prisma/client";
import React, { useContext, useEffect, useRef, useState } from "react";
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

interface ChannelMainProps {
  selectedChannel: Server_Channel;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
  socket: WebSocket | null;
  fullscreen: boolean;
}

const ChannelMain = (props: ChannelMainProps) => {
  const { selectedChannel, currentUser, socket, fullscreen } = props;
  const [messageSendLoading, setMessageSendLoading] = useState(false);
  const [iconClass, setIconClass] = useState("");
  const { isDarkTheme } = useContext(ThemeContext);
  const [attachmentModalShowing, setAttachmentModalShowing] = useState(false);
  const attachmentButtonRef = useRef<HTMLButtonElement>(null);
  const attachmentModalRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<CommentWithUser[]>([]);
  const getMessages = api.server.getChannelComments.useQuery(
    selectedChannel.id
  );
  const inputDivRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [thisChannel, setThisChannel] = useState<Server_Channel | null>(null);

  useEffect(() => {
    if (getMessages.data) {
      setMessages(getMessages.data);
    }
  }, [selectedChannel, getMessages]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (event) => {
        console.log(event.data);
        if (event.data.message !== "Internal server error") {
          getMessages.refetch();
        }
      };
    }
  }, [socket]);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    const input = messageInputRef.current?.value;
    if (input!.length > 0) {
      setIconClass("move-fade");
      const data = {
        message: input,
        senderID: currentUser.id,
        channelID: thisChannel?.id,
        action: "message",
      };
      socket?.send(JSON.stringify(data));
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

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const UsersCommentClass =
    "shadow-lg text-zinc-100 shadow-zinc-400 dark:shadow-zinc-700 bg-purple-700 rounded-2xl py-5 px-6 max-w-[75%]";
  const OtherCommentsClass =
    "bg-zinc-100 shadow-lg dark:bg-zinc-800 dark:shadow-zinc-700 rounded-2xl py-5 pr-6 pl-8 max-w-[75%]";

  return (
    <>
      <div className="">
        <div
          className={`${
            fullscreen ? "w-screen" : "w-full"
          } scrollXDisabled h-screen  rounded bg-zinc-50 transition-colors duration-300 ease-in-out dark:bg-zinc-900`}
        >
          <div ref={bannerRef}>
            <TopBanner
              key={selectedChannel.id}
              selectedChannel={selectedChannel}
              fullscreen={fullscreen}
            />
          </div>
          <div className="scrollXDisabled overflow-y-scroll pb-24 pt-8">
            <ul className={`${fullscreen ? "w-screen" : "w-full"} px-4 pt-6`}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.userId == currentUser.id
                      ? "my-4 flex justify-end pr-9"
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
                    <div className="-ml-3 -mt-3 text-xs font-semibold">
                      {message.user.name}
                    </div>
                    <div
                      className={`${
                        message.user.id == currentUser.id ? "text-right" : ""
                      } relative w-fit`}
                    >
                      {message.message}
                    </div>
                    {message.userId == currentUser.id ? null : (
                      <div>
                        <div className="-mb-12 -ml-8 mt-1">
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
            <div ref={bottomRef}></div>
          </div>
          <div
            className={`fixed bottom-0 ${fullscreen ? "w-screen" : "w-full"}`}
          >
            <div
              ref={inputDivRef}
              className="bg-zinc-100 pb-4 dark:bg-zinc-700 md:pb-0"
            >
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
