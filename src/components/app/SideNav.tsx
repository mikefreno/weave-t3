import React, { useContext } from "react";
import LightLogo from "@/public/Logo - light.png";
import DarkLogo from "@/public/Logo - dark.png";
import Image from "next/image";
import ThemeContext from "../ThemeContextProvider";
import { Tooltip } from "@nextui-org/react";
import AddIcon from "@/src/icons/AddIcon";
import BullhornIcon from "@/src/icons/BullhornIcon";
import RobotIcon from "@/src/icons/RobotIcon";

function SideNav(props: { serverModalToggle(): any; serverButtonRef }) {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <div>
      <aside className="stopIT absolute left-0 flex h-screen w-72 flex-col items-center justify-center border-r-2 border-zinc-600 bg-zinc-800">
        <aside className="absolute left-0 h-screen w-20 bg-zinc-900">
          <div className="mx-4 mb-4 flex justify-center border-b-2 border-zinc-600 py-4">
            <Tooltip
              content={"Direct Messaging"}
              trigger="hover"
              color={"secondary"}
              placement="rightEnd"
            >
              <button className="logoSpinner z-50">
                <Image src={isDarkTheme ? DarkLogo : LightLogo} alt="logo" />
              </button>
            </Tooltip>
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
                  className="borderRadiusTransform shaker w-min rounded-2xl bg-zinc-600 p-2 hover:bg-zinc-700 active:bg-zinc-800"
                  onClick={props.serverModalToggle}
                >
                  <AddIcon height={40} width={40} stroke={"#4c1d95"} />
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
                <button className="borderRadiusTransform shaker flex justify-center rounded-2xl bg-zinc-600 p-2 hover:bg-zinc-700 active:bg-zinc-800">
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
            <div className="mx-4 mt-4 flex justify-center border-t-2 border-zinc-600 py-4">
              <Tooltip
                content={"Bot Services"}
                trigger="hover"
                color={"secondary"}
                placement="rightEnd"
              >
                <button className="borderRadiusTransform shaker flex justify-center rounded-2xl bg-zinc-600 p-2 hover:bg-zinc-700 active:bg-zinc-800">
                  <RobotIcon height={40} width={40} fill={"#4c1d95"} />
                </button>
              </Tooltip>
            </div>
          </div>
        </aside>
      </aside>
    </div>
  );
}

export default SideNav;
