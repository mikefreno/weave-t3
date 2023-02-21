import MicIcon from "@/src/icons/MicIcon";
import MicSlashIcon from "@/src/icons/MicSlashIcon";
import SpeakerOff from "@/src/icons/SpeakerOff";
import SpeakerOn from "@/src/icons/SpeakerOn";
import { Server, Server_Admin, Server_Member, User } from "@prisma/client";
import React, { Dispatch, SetStateAction, useContext } from "react";
import ThemeContext from "../ThemeContextProvider";

const InnerNavOverlay = (props: {
  setSelectedInnerTab: Dispatch<SetStateAction<string>>;
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
  const { currentUser } = props;
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <div className="fixed bottom-0 w-52 border-l border-r border-zinc-700 bg-zinc-600 dark:border-zinc-500 dark:bg-zinc-900">
      <div className="flex w-52 justify-between">
        <div className="flex justify-start">
          <div className="flex flex-row p-2">
            <div className="my-auto">
              {currentUser?.image ? (
                <button
                  onClick={() => props.setSelectedInnerTab("AccountOverview")}
                >
                  <img
                    src={currentUser.image}
                    className="stopIT h-8 w-8 rounded-full"
                  ></img>
                </button>
              ) : (
                <button
                  className="h-8 w-8 rounded-full border border-zinc-200 bg-zinc-600"
                  onClick={() => props.setSelectedInnerTab("AccountOverview")}
                >
                  {currentUser?.name?.split(" ")[0]?.charAt(0)}{" "}
                  {currentUser?.name?.split(" ")[1]?.charAt(0)}
                </button>
              )}
            </div>
            <div className="my-auto flex flex-col pl-2">
              <div>
                <button
                  onClick={() => props.setSelectedInnerTab("AccountOverview")}
                >
                  {currentUser?.name}
                </button>
              </div>
              <div>
                <button
                  onClick={() => props.setSelectedInnerTab("AccountOverview")}
                >
                  {currentUser.psuedonym}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-12 justify-between pr-2">
          <button onClick={props.audioToggle}>
            {props.audioState ? (
              <SpeakerOn
                height={16}
                width={16}
                stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                strokeWidth={1.5}
              />
            ) : (
              <SpeakerOff
                height={16}
                width={16}
                stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                strokeWidth={1.5}
              />
            )}
          </button>
          <button onClick={props.microphoneToggle}>
            {props.microphoneState ? (
              <MicIcon
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                height={16}
                width={16}
              />
            ) : (
              <MicSlashIcon
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                height={16}
                width={16}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InnerNavOverlay;
