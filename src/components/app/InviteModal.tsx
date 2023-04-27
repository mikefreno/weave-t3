import { Button, FormElement, Input, Loading } from "@nextui-org/react";
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
  const { isDarkTheme, inviteModalToggle, selectedInnerTabID, selectedInnerTab, inviteModalRef } = props;

  const [iconClass, setIconClass] = useState("");
  const [emailSendLoading, setEmailSendLoading] = useState(false);
  const [emailSendReport, setEmailSendReport] = useState("");
  const [QRCodeShowing, setQRCodeShowing] = useState(false);
  const [QRCodeValue, setQRCodeValue] = useState("");
  const [showingGenericCode, setShowingGenericCode] = useState(false);
  const [genericCodeData, setGenericCodeData] = useState("");

  const invitee = useRef<FormElement>(null);

  const createJWTInvite = api.server.createJWTInvite.useMutation({});
  const sendServerInvite = api.server.sendServerInvite.useMutation({});
  const userCheck = api.server.checkForMemberEmail.useMutation({});

  const sendEmail = async () => {
    if (invitee.current) {
      const email = invitee.current.value;
      const token = await createJWTInvite.mutateAsync({
        email: email,
        serverID: selectedInnerTabID,
      });
      if (email.length >= 3) {
        setIconClass("move-fade");
        setEmailSendLoading(true);
        const res = await userCheck.mutateAsync({
          email: email,
          serverID: selectedInnerTabID,
        });
        if (res === false) {
          await sendServerInvite.mutateAsync({
            invitee: invitee.current.value,
            token: token as string,
            serverName: selectedInnerTab,
          });
          setEmailSendReport("Email Sent!");
        } else if (res === true) {
          setEmailSendReport("User Exists!");
        }
        setEmailSendLoading(false);
      }
    }
  };

  const showCode = async () => {
    if (showingGenericCode) {
      setShowingGenericCode(false);
    } else if (invitee.current) {
      const email = invitee.current.value;
      if (email.length >= 3) {
        const token = await createJWTInvite.mutateAsync({
          email: email,
          serverID: selectedInnerTabID,
        });
        setGenericCodeData(token);
        setShowingGenericCode(true);
      } else {
        alert("Please enter a valid email address in above field!");
      }
    }
  };

  const generateQRCode = async () => {
    if (invitee.current) {
      const email = invitee.current.value;
      if (email.length >= 3) {
        const token = await createJWTInvite.mutateAsync({
          email: email,
          serverID: selectedInnerTabID,
        });
        setQRCodeValue(`localhost:3000/api/joinServer?token=${token}`);
        setQRCodeShowing(!QRCodeShowing);
      } else {
        alert("Please enter a valid email address in above field!");
      }
    }
  };

  return (
    <div className="fixed">
      <div className="modal-offset flex h-screen w-screen items-center justify-center backdrop-blur-sm">
        <div
          ref={props.inviteModalRef}
          className="fade-in -mt-24 w-11/12 rounded-xl bg-zinc-100 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
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
            <div className="-mt-6 pb-4 text-center text-2xl">Send an Invite</div>
            <div className="mt-6 flex justify-center">
              <div className="mx-4 my-auto">Send by email</div>
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
                        <SendIcon height={12} strokeWidth={1} width={12} color={isDarkTheme ? "#e4e4e7" : "#27272a"} />
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
              ) : emailSendReport === "User Exists!" ? (
                <div>
                  {" "}
                  <div>
                    {emailSendReport}{" "}
                    <button
                      className="hover:underline"
                      onClick={() => {
                        setIconClass("");
                        setEmailSendReport("");
                      }}
                    >
                      Try Another?
                    </button>
                  </div>
                </div>
              ) : null}
              <div className="rule-around my-4">Or</div>
              <div className="flex justify-evenly">
                <div className="flex flex-col items-center">
                  <div className="mb-2">Generate Code</div>
                  <Button auto size={"sm"} color={"secondary"} onClick={showCode}>
                    Get
                  </Button>
                  <div className="mt-2 w-40 break-words">{showingGenericCode ? genericCodeData : null}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-2">Generate QR Code</div>
                  <Button auto size={"sm"} color={"secondary"} onClick={generateQRCode}>
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
