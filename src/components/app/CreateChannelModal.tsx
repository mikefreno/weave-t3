import BackArrow from "@/src/icons/BackArrow";
import CommentsIcon from "@/src/icons/CommentsIcon";
import MicIcon from "@/src/icons/MicIcon";
import Xmark from "@/src/icons/Xmark";
import { api } from "@/src/utils/api";
import { Button, Input, Loading, Textarea } from "@nextui-org/react";
import React, { RefObject, useRef, useState } from "react";

const CreateChannelModal = (props: {
  isDarkTheme: boolean;
  createChannelToggle: any;
  selectedInnerTabID: number;
  createChannelRef: RefObject<HTMLDivElement>;
  refreshUserServers;
}) => {
  const { isDarkTheme, createChannelToggle, createChannelRef } = props;
  const [channelType, setChannelType] = useState("");
  const [channelName, setChannelName] = useState("");
  const [step, setStep] = useState(0);
  const channelNameRef = useRef<HTMLInputElement>(null);
  const serverDescRef = useRef<HTMLTextAreaElement>(null);
  const createServer = api.server.createServerChannel.useMutation({});
  const [createButtonLoading, setCreateButtonLoading] = useState(false);

  const createChannelRequest = async (e: { preventDefault: () => void }) => {
    setCreateButtonLoading(true);
    e.preventDefault();
    const res = await createServer.mutateAsync({
      description: serverDescRef.current?.value,
      name: channelName,
      serverType: channelType,
      serverID: props.selectedInnerTabID,
    });
    if (res == true) {
      props.createChannelToggle();
      await props.refreshUserServers();
      setCreateButtonLoading(false);
    }
  };

  const stepThrough = () => {
    if (step === 0) {
      return (
        <>
          <div className="text-center text-xl">Create A Channel</div>
          <div className="flex">
            <button
              className="m-4 mx-auto flex rounded-xl bg-emerald-500 p-4  hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:active:bg-emerald-800"
              onClick={() => {
                setChannelType("text");
                setStep(1);
              }}
            >
              <CommentsIcon
                height={40}
                width={40}
                strokeWidth={1.5}
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
              />
              <div className="my-auto ml-8 text-xl">Text Channel</div>
            </button>
            <button
              className="m-4 mx-auto flex rounded-xl bg-blue-500 p-4 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800"
              onClick={() => {
                setChannelType("voice");
                setStep(1);
              }}
            >
              <MicIcon
                height={36}
                width={36}
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
              />
              <div className="my-auto ml-8 text-xl">Voice Channel</div>
            </button>
          </div>
        </>
      );
    } else if (step === 1) {
      return (
        <>
          <div className="-mt-4 text-center text-xl">Give it a name!</div>
          <form
            onSubmit={(e) => {
              e.preventDefault;
              setChannelName(channelNameRef.current!.value);
              setStep(2);
            }}
          >
            <div className="my-12 flex justify-center">
              <Input
                labelPlaceholder="Channel Name..."
                size="lg"
                required
                ref={channelNameRef}
              />
            </div>
            <div className="relative flex justify-end">
              <div className="absolute">
                <Button auto shadow type="submit">
                  <span className="my-auto">Continue</span>
                  <span className="rotate-180">
                    <BackArrow
                      height={16}
                      width={16}
                      stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                      strokeWidth={1.5}
                    />
                  </span>
                </Button>
              </div>
            </div>
          </form>
          <div className="flex items-end">
            <Button
              auto
              color={"secondary"}
              shadow
              onClick={() => {
                setStep(0);
              }}
            >
              <BackArrow
                height={12}
                width={12}
                stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                strokeWidth={1.5}
              />
            </Button>
          </div>
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <div>
            <div className="text-center text-xl">Finish Setup</div>
            <div className="text-center">
              Give it a subtitile or short description
            </div>
            <form onSubmit={createChannelRequest}>
              <div className="mt-4 flex justify-center">
                <Textarea ref={serverDescRef} required />
              </div>
              <div className="flex justify-center py-12">
                {createButtonLoading ? (
                  <Button color={"gradient"} disabled shadow size={"lg"}>
                    <Loading type="points" size="sm" />
                  </Button>
                ) : (
                  <Button color={"gradient"} shadow size={"lg"} type="submit">
                    Finish & Create Server!
                  </Button>
                )}
              </div>
            </form>
            <div className="-mt-12 flex items-end">
              <Button
                auto
                color={"secondary"}
                shadow
                onClick={() => {
                  setStep(1);
                }}
              >
                <BackArrow
                  height={12}
                  width={12}
                  stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                  strokeWidth={1.5}
                />
              </Button>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="fixed mt-24">
      <div className="absolute flex w-screen items-center justify-center">
        <div
          ref={createChannelRef}
          className="fade-in w-3/4 rounded-xl bg-zinc-400 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
        >
          <div className="">
            <button
              className="right-4 w-10"
              onClick={() => {
                createChannelToggle();
              }}
            >
              <Xmark className="text-zinc-800 dark:text-zinc-200" />
            </button>
            {stepThrough()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelModal;
