import React, { useContext, useState } from "react";
import LightLogo from "@/public/Logo - light.png";
import DarkLogo from "@/public/Logo - dark.png";
import Image from "next/image";
import ThemeContext from "../ThemeContextProvider";
import { Tooltip } from "@nextui-org/react";
import AddIcon from "@/src/icons/AddIcon";
import BullhornIcon from "@/src/icons/BullhornIcon";
import RobotIcon from "@/src/icons/RobotIcon";
import InnerNav from "./InnerNav";

const SideNav = (props: {
  serverModalToggle: React.MouseEventHandler<HTMLButtonElement>;
  serverButtonRef: React.LegacyRef<HTMLButtonElement>;
  publicServerModalToggle: React.MouseEventHandler<HTMLButtonElement>;
  publicServerButtonRef: React.LegacyRef<HTMLButtonElement>;
  botModalToggle: React.MouseEventHandler<HTMLButtonElement>;
  botButtonRef: React.LegacyRef<HTMLButtonElement>;
}) => {
  const { isDarkTheme } = useContext(ThemeContext);
  const [currentTab, setCurrentTab] = useState("0");

  return (
    <div>
      <aside className="stopIT absolute left-0 flex h-screen w-72 border-r-2 border-zinc-600 bg-zinc-500 dark:bg-zinc-800">
        <div id="inner-nav" className="ml-20 w-52">
          <InnerNav currentTab={currentTab} />
        </div>
        <aside
          id="outer-nav"
          className="absolute left-0 h-screen w-20 bg-zinc-700 dark:bg-zinc-900"
        >
          <div className="border-zinx-600 mx-4 mb-4 flex justify-center border-b-2 border-zinc-400 py-4 dark:border-zinc-600">
            <Tooltip
              content={"Direct Messaging"}
              trigger="hover"
              color={"secondary"}
              placement="rightEnd"
            >
              <button
                id="0"
                className="logoSpinner z-50"
                onClick={() => {
                  setCurrentTab("0");
                }}
              >
                <Image src={isDarkTheme ? DarkLogo : LightLogo} alt="logo" />
              </button>
            </Tooltip>
            {currentTab === "0" ? (
              <span className="absolute mr-24 mt-4 h-4 w-4 rounded-full bg-zinc-200" />
            ) : null}
          </div>
          <div id="joined-server-list"></div>
          <div id="server-utilities">
            <div className="mb-4 flex justify-center">
              <Tooltip
                content={"Add a Server!"}
                trigger="hover"
                color={"secondary"}
                placement="rightEnd"
              >
                <button
                  ref={props.serverButtonRef}
                  className="borderRadiusTransform shaker w-min rounded-2xl bg-zinc-300 p-2 hover:bg-zinc-400 active:bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:active:bg-zinc-800"
                  onClick={props.serverModalToggle}
                >
                  <AddIcon
                    height={40}
                    width={40}
                    stroke={"#4c1d95"}
                    strokeWidth={1.5}
                  />
                </button>
              </Tooltip>
            </div>
            <div className="flex justify-center">
              <Tooltip
                content={"Join Public Server!"}
                trigger="hover"
                color={"secondary"}
                placement="rightEnd"
              >
                <button
                  ref={props.publicServerButtonRef}
                  className="borderRadiusTransform shaker flex justify-center rounded-2xl bg-zinc-300 p-2 hover:bg-zinc-400 active:bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:active:bg-zinc-800"
                  onClick={props.publicServerModalToggle}
                >
                  <div className="flex h-[40px] w-[40px] items-center justify-center">
                    <BullhornIcon
                      height={30}
                      width={30}
                      fill={"#4c1d95"}
                      strokeWidth={1}
                    />
                  </div>
                </button>
              </Tooltip>
            </div>
            <div className="mx-4 mt-4 flex justify-center border-t-2 border-zinc-400 py-4 dark:border-zinc-600">
              <Tooltip
                content={"Bot Services"}
                trigger="hover"
                color={"secondary"}
                placement="rightEnd"
              >
                <button
                  ref={props.botButtonRef}
                  className="borderRadiusTransform shaker flex justify-center rounded-2xl bg-zinc-300 p-2 hover:bg-zinc-400 active:bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:active:bg-zinc-800"
                  onClick={props.botModalToggle}
                >
                  <RobotIcon height={40} width={40} fill={"#4c1d95"} />
                </button>
              </Tooltip>
            </div>
          </div>
        </aside>
      </aside>
    </div>
  );
};

export default SideNav;
