import MicIcon from "@/src/icons/MicIcon";
import MicSlashIcon from "@/src/icons/MicSlashIcon";
import SpeakerOff from "@/src/icons/SpeakerOff";
import SpeakerOn from "@/src/icons/SpeakerOn";
import { Server, Server_Admin, Server_Member, User } from "@prisma/client";
import React, { Dispatch, SetStateAction, useContext } from "react";
import ThemeContext from "../ThemeContextProvider";

const InnerNavOverlay = (props: {
  timestamp: number;
  setSelectedInnerTab: Dispatch<SetStateAction<string>>;
  currentTabSetter: (id: string) => void;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
  microphoneState: boolean;
  microphoneToggle: any;
  audioState: boolean;
  audioToggle: any;
}) => {
  const { currentUser, timestamp } = props;
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <div className="fixed bottom-0 -ml-20 hidden w-44 border-r border-zinc-700 bg-purple-900 text-zinc-200 dark:border-zinc-500 dark:bg-zinc-900 md:ml-0 md:block md:w-52">
      <div className="flex justify-between">
        <div className="flex justify-start">
          <div className="flex flex-row p-2">
            <div className="flex items-center">
              {currentUser?.image ? (
                <button
                  onClick={() => {
                    props.setSelectedInnerTab("AccountOverview");
                    props.currentTabSetter("DMS");
                  }}
                >
                  <img
                    src={`${currentUser.image}?t=${timestamp}`}
                    className="stopIT h-10 w-10 rounded-full"
                  />
                </button>
              ) : (
                <button
                  className="h-8 w-8 rounded-full border border-zinc-200 bg-zinc-600"
                  onClick={() => {
                    props.setSelectedInnerTab("AccountOverview");
                    props.currentTabSetter("DMS");
                  }}
                >
                  {currentUser?.name?.split(" ")[0]?.charAt(0)}{" "}
                  {currentUser?.name?.split(" ")[1]?.charAt(0)}
                </button>
              )}
            </div>
            <div className="my-auto flex flex-1 flex-col pl-3">
              {currentUser.name ? (
                <div className="">
                  <button
                    className="flex text-left"
                    onClick={() => {
                      props.setSelectedInnerTab("AccountOverview");
                      props.currentTabSetter("DMS");
                    }}
                  >
                    {currentUser?.name}
                  </button>
                </div>
              ) : null}
              {currentUser.pseudonym ? (
                <div>
                  <button
                    onClick={() => {
                      props.setSelectedInnerTab("AccountOverview");
                      props.currentTabSetter("DMS");
                    }}
                  >
                    {currentUser.pseudonym}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex justify-between pr-2">
          <button onClick={props.audioToggle} className="pr-2">
            {props.audioState ? (
              <SpeakerOn
                height={16}
                width={16}
                stroke={"#e4e4e7"}
                strokeWidth={1.5}
              />
            ) : (
              <SpeakerOff
                height={16}
                width={16}
                stroke={"#e4e4e7"}
                strokeWidth={1.5}
              />
            )}
          </button>
          <button onClick={props.microphoneToggle} className="pr-1">
            {props.microphoneState ? (
              <MicIcon color={"#e4e4e7"} height={16} width={16} />
            ) : (
              <MicSlashIcon color={"#e4e4e7"} height={16} width={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InnerNavOverlay;
