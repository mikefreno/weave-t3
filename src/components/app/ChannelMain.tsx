import PaperClip from "@/src/icons/PaperClip";
import SendIcon from "@/src/icons/SendIcon";
import { Input, Loading } from "@nextui-org/react";
import { Server_Channel } from "@prisma/client";
import React, { useContext, useRef, useState } from "react";
import useOnClickOutside from "../ClickOutsideHook";
import ThemeContext from "../ThemeContextProvider";
import AttachmentModal from "./AttachmentModal";
import TopBanner from "./TopBanner";

const ChannelMain = (props: { selectedChannel: Server_Channel }) => {
  const { selectedChannel } = props;
  const [messageSendLoading, setMessageSendLoading] = useState(false);
  const [iconClass, setIconClass] = useState("");
  const { isDarkTheme } = useContext(ThemeContext);
  const [attachmentModalShowing, setAttachmentModalShowing] = useState(false);
  const attachmentButtonRef = useRef<HTMLButtonElement>(null);
  const attachmentModalRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    setIconClass("move-fade");
    setTimeout(() => {
      setIconClass("");
    }, 1000);
  };
  useOnClickOutside([attachmentModalRef, attachmentButtonRef], () => {
    setAttachmentModalShowing(false);
  });

  const attachmentModalToggle = () => {
    setAttachmentModalShowing(!attachmentModalShowing);
  };

  return (
    <div>
      <TopBanner currentChannel={selectedChannel} />
      <div className="chatScreen rounded bg-zinc-900"></div>
      <div className="fixed bottom-0 h-12 w-full bg-zinc-700">
        <div className="px-12">
          <Input
            css={{ width: "80%" }}
            contentClickable
            contentLeft={
              <button
                ref={attachmentButtonRef}
                className="absolute cursor-pointer rounded-full"
                onClick={attachmentModalToggle}
              >
                {messageSendLoading ? (
                  <Loading size="xs" />
                ) : (
                  <div className="">
                    <PaperClip
                      height={16}
                      strokeWidth={1}
                      width={16}
                      stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                    />
                  </div>
                )}
              </button>
            }
            contentRight={
              <button
                className="absolute cursor-pointer rounded-full"
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
