import PaperClip from "@/src/icons/PaperClip";
import SendIcon from "@/src/icons/SendIcon";
import { api } from "@/src/utils/api";
import { Input, Loading } from "@nextui-org/react";
import {
  Server,
  Server_Admin,
  Server_Channel,
  Server_Member,
  User,
} from "@prisma/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import useOnClickOutside from "../ClickOutsideHook";
import LoadingElement from "../loading";
import ThemeContext from "../ThemeContextProvider";
import AttachmentModal from "./AttachmentModal";
import TopBanner from "./TopBanner";

const ChannelMain = (props: {
  selectedChannel: Server_Channel;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
}) => {
  const { selectedChannel, currentUser } = props;
  const [messageSendLoading, setMessageSendLoading] = useState(false);
  const [iconClass, setIconClass] = useState("");
  const { isDarkTheme } = useContext(ThemeContext);
  const [attachmentModalShowing, setAttachmentModalShowing] = useState(false);
  const attachmentButtonRef = useRef<HTMLButtonElement>(null);
  const attachmentModalRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const socket = new WebSocket(
      "wss://ho6sto5l50.execute-api.us-east-1.amazonaws.com/prod"
    );

    socket.addEventListener("open", (event) => {
      console.log("WebSocket connected");

      // Define the payload to send in the request body
      const payload = {
        message: "Hello from the frontend",
        senderID: currentUser.id,
        channelID: selectedChannel.id,
      };

      // Send the payload in the request body
      socket.send(JSON.stringify(payload));
    });

    socket.addEventListener("message", (event) => {
      console.log("Received message:", event.data);
    });

    socket.addEventListener("close", (event) => {
      console.log("WebSocket disconnected");
    });
  }, []);

  const sendMessage = async () => {
    const input = messageInputRef.current.value;
    if (input.length > 0) {
      setIconClass("move-fade");
      messageInputRef.current.value = "";
      setIconClass("");
    }
  };
  useOnClickOutside([attachmentModalRef, attachmentButtonRef], () => {
    setAttachmentModalShowing(false);
  });

  const attachmentModalToggle = () => {
    setAttachmentModalShowing(!attachmentModalShowing);
  };

  return (
    <div className="">
      <TopBanner currentChannel={selectedChannel} />
      <div className="chatScreen container rounded bg-zinc-900">
        {/* {eventSourceState == 0 ? (
          <LoadingElement isDarkTheme={isDarkTheme} />
        ) : eventSourceState == 2 ? (
          <div>Disconnected, click channel button to reconnect</div>
        ) : (
          connectedStateReturn()
        )} */}
        {/* <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul> */}
      </div>
      <div className="container bg-zinc-700">
        <div className="mx-2 pt-3 md:mx-6 lg:mx-8 xl:mx-12">
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
                >
                  <PaperClip
                    height={16}
                    strokeWidth={1}
                    width={16}
                    stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                  />
                </button>
                <button
                  onClick={() => {
                    sendMessage();
                  }}
                >
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
