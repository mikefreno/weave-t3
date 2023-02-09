import HeadphonesIcon from "@/src/icons/HeadphonesIcon";
import HeadphoneSlashIcon from "@/src/icons/HeadphoneSlashIcon";
import MicIcon from "@/src/icons/MicIcon";
import MicSlashIcon from "@/src/icons/MicSlashIcon";
import { useSession } from "next-auth/react";
import React, { Dispatch, SetStateAction, useContext } from "react";
import ThemeContext from "../ThemeContextProvider";

const InnerNavOverlay = (props: {
  setSelectedInnerTab: Dispatch<SetStateAction<string>>;
  session: any;
  microphoneState: boolean;
  microphoneToggle: any;
  audioState: boolean;
  audioToggle: any;
}) => {
  const { session } = props;
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <div className="absolute bottom-0 w-52 border-l border-r border-zinc-700 bg-zinc-600 dark:border-zinc-500 dark:bg-zinc-900">
      <div className="flex justify-start">
        <div className="flex flex-row p-2">
          <div>
            {session?.user?.image ? (
              <button
                onClick={() => props.setSelectedInnerTab("AccountOverview")}
              >
                <img
                  src={session.user.image}
                  className="stopIT h-8 w-8 rounded-full"
                ></img>
              </button>
            ) : (
              <button className="h-8 w-8 rounded-full border border-zinc-200 bg-zinc-600">
                {session?.user?.name?.split(" ")[0]?.charAt(0)}{" "}
                {session?.user?.name?.split(" ")[1]?.charAt(0)}
              </button>
            )}
          </div>
          <div className="my-auto pl-2">
            <button
              onClick={() => props.setSelectedInnerTab("AccountOverview")}
            >
              {session?.user?.name}
            </button>
          </div>
        </div>
        <div className="flex w-12 justify-evenly">
          <button onClick={props.audioToggle}>
            {props.audioState ? (
              <HeadphonesIcon
                height={16}
                width={16}
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
              />
            ) : (
              <HeadphoneSlashIcon
                height={16}
                width={16}
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
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
