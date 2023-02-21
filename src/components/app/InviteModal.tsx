import { Button, Input, Loading } from "@nextui-org/react";
import React, { MutableRefObject, RefObject, useRef, useState } from "react";
import SendIcon from "@/src/icons/SendIcon";
import QRCode from "react-qr-code";
import Xmark from "@/src/icons/Xmark";
import { api } from "@/src/utils/api";

const InviteModal = (props: {
  isDarkTheme: boolean;
  inviteModalToggle: any;
  selectedInnerTabID: number;
  selectedInnerTab: string;
  inviteModalRef: RefObject<HTMLDivElement>;
}) => {
  const {
    isDarkTheme,
    inviteModalToggle,
    selectedInnerTabID,
    selectedInnerTab,
    inviteModalRef,
  } = props;
  const [iconClass, setIconClass] = useState("");
  const [emailSendLoading, setEmailSendLoading] = useState(false);
  const [emailSendReport, setEmailSendReport] = useState("");
  const [QRCodeShowing, setQRCodeShowing] = useState(false);
  const [QRCodeValue, setQRCodeValue] = useState("");
  const [showingGenericCode, setShowingGenericCode] = useState(false);
  const invitee =
    useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;
  const createJWTInvite =
    api.server.createJWTInvite.useQuery(selectedInnerTabID);
  const sendServerInvite = api.server.sendServerInvite.useMutation({});

  const sendEmail = async () => {
    await createJWTInvite.refetch();
    if (invitee.current.value.length >= 3) {
      setIconClass("move-fade");
      setEmailSendLoading(true);
      sendServerInvite.mutateAsync({
        invitee: invitee.current.value,
        token: createJWTInvite.data as string,
        serverName: selectedInnerTab,
      });
      setEmailSendLoading(false);
      setEmailSendReport("Email Sent!");
    }
  };

  const showCode = async () => {
    await createJWTInvite.refetch();
    setShowingGenericCode(!showingGenericCode);
  };

  const generateQRCode = async () => {
    await createJWTInvite.refetch();
    setQRCodeValue(
      `localhost:3000/api/joinServer?token=${createJWTInvite.data}`
    );
    setQRCodeShowing(!QRCodeShowing);
  };

  return (
    <div className="fixed">
      <div className="absolute mt-24 flex w-screen items-center justify-center">
        <div
          ref={props.inviteModalRef}
          className="fade-in w-3/4 rounded-xl bg-zinc-400 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
        >
          <div className="">
            <button
              className="right-4 w-10"
              onClick={() => {
                inviteModalToggle();
              }}
            >
              <Xmark className="text-zinc-800 dark:text-zinc-200" />
            </button>
            <div className="-mt-6 pb-4 text-center text-2xl">
              Send an Invite
            </div>
            <div className="mt-6 flex justify-center">
              <div className="my-auto mx-4">Send by email</div>
              <Input
                id="invitee-input"
                ref={invitee}
                labelPlaceholder="Enter an email..."
                contentClickable
                underlined
                type={"email"}
                contentRight={
                  <button
                    className="absolute cursor-pointer rounded-full"
                    onClick={() => {
                      sendEmail();
                    }}
                  >
                    {emailSendLoading ? (
                      <Loading size="xs" />
                    ) : (
                      <div className={iconClass}>
                        <SendIcon
                          height={12}
                          strokeWidth={1}
                          width={12}
                          color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                        />
                      </div>
                    )}
                  </button>
                }
              />
            </div>
            <div className="mb-6 pt-1 text-center text-sm">
              {emailSendReport === "Email Sent!" ? (
                <div>
                  {emailSendReport}{" "}
                  <button
                    className="hover:underline"
                    onClick={() => {
                      setIconClass("");
                      setEmailSendReport("");
                    }}
                  >
                    Send Another?
                  </button>
                </div>
              ) : null}
              <div className="rule-around my-4">Or</div>
              <div className="flex justify-evenly">
                <div className="flex flex-col items-center">
                  <div className="mb-2">Generate Code</div>
                  <Button
                    auto
                    size={"sm"}
                    color={"secondary"}
                    onClick={showCode}
                  >
                    Get
                  </Button>
                  <div className="w-36 break-words">
                    {showingGenericCode ? createJWTInvite.data : null}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-2">Generate QR Code</div>
                  <Button
                    auto
                    size={"sm"}
                    color={"secondary"}
                    onClick={generateQRCode}
                  >
                    Get
                  </Button>
                  {QRCodeShowing ? (
                    <div className="m-4 rounded-md bg-zinc-100 p-4">
                      <QRCode
                        size={128}
                        style={{
                          height: "auto",
                        }}
                        value={QRCodeValue}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
