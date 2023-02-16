import { Button, Input, Loading } from "@nextui-org/react";
import React, { useState } from "react";
import SendIcon from "@/src/icons/SendIcon";
import QRCode from "react-qr-code";
import Xmark from "@/src/icons/Xmark";
import { api } from "@/src/utils/api";

const InviteModal = (props: {
  isDarkTheme: boolean;
  setInviteModalShowing: any;
  selectedInnerTabID: number;
}) => {
  const { isDarkTheme, setInviteModalShowing, selectedInnerTabID } = props;
  const [iconClass, setIconClass] = useState("");
  const [emailSendLoading, setEmailSendLoading] = useState(false);
  const [emailSendReport, setEmailSendReport] = useState("");
  const [QRCodeShowing, setQRCodeShowing] = useState(false);
  const [QRCodeValue, setQRCodeValue] = useState("");
  const [showingGenericCode, setShowingGenericCode] = useState(false);
  let inviteMutaion = api.server.createJWTInvite.useMutation({});

  const sendEmail = async () => {
    setEmailSendLoading(true);
    await inviteMutaion.mutateAsync(selectedInnerTabID);

    setTimeout(() => {
      setEmailSendLoading(false);
      setEmailSendReport("Email Sent!");
    }, 1000);
  };

  const showCode = async () => {
    setShowingGenericCode(!showingGenericCode);
  };

  const generateQRCode = async () => {
    setQRCodeShowing(!QRCodeShowing);
  };

  return (
    <div id="modal" className="fixed">
      <div className="absolute flex w-screen items-center justify-center">
        <div
          id="serverModalContent"
          className="fade-in w-3/4 rounded-xl bg-zinc-400 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
        >
          <div className="">
            <button
              className="right-4 w-10"
              onClick={() => {
                setInviteModalShowing(false);
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
                labelPlaceholder="Enter an email..."
                contentClickable
                underlined
                contentRight={
                  <button
                    className="absolute cursor-pointer rounded-full"
                    onClick={() => {
                      setIconClass("move-fade");
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
                        value={"192.168.0.55:3000/login"}
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
