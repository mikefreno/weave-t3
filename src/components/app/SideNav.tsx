import React, {
  MouseEventHandler,
  RefObject,
  useContext,
  useState,
} from "react";
import LightLogo from "@/public/Logo - light.png";
import DarkLogo from "@/public/Logo - dark.png";
import Image from "next/image";
import ThemeContext from "../ThemeContextProvider";
import { Tooltip } from "@nextui-org/react";
import AddIcon from "@/src/icons/AddIcon";
import BullhornIcon from "@/src/icons/BullhornIcon";
import RobotForApp from "@/src/icons/RobotForApp";
import { Server, Server_Admin, Server_Member, User } from "@prisma/client";
import { Raleway } from "@next/font/google";
import DoubleChevrons from "@/src/icons/DoubleChevrons";

const raleway = Raleway({ weight: "400", subsets: ["latin"] });

const SideNav = (props: {
  setSelectedChannel: any;
  serverModalToggle: MouseEventHandler<HTMLButtonElement>;
  serverButtonRef: RefObject<HTMLButtonElement>;
  botModalToggle: MouseEventHandler<HTMLButtonElement>;
  botButtonRef: RefObject<HTMLButtonElement>;
  currentTab: string;
  currentTabSetter: any;
  setSelectedInnerTab: any;
  setSelectedInnerTabID: any;
  usersServers: Server[] | undefined;
  selectedInnerTabID: number;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
  toggleInnerNav: () => void;
}) => {
  const { isDarkTheme } = useContext(ThemeContext);

  const { currentUser, usersServers, toggleInnerNav } = props;
  const [innerHiddenRotate, setInnerHiddenRotate] = useState(false);

  return (
    <aside className="stopIT fixed h-screen w-20 border-r border-zinc-200 bg-purple-700 dark:border-zinc-400 dark:bg-zinc-900">
      <div className="flex justify-center border-b border-zinc-200 py-4 dark:border-zinc-600">
        <Tooltip
          content={"Direct Messaging"}
          trigger="hover"
          color={isDarkTheme ? "secondary" : "default"}
          placement="rightEnd"
        >
          <button
            id="DMS"
            className="z-50"
            onClick={() => {
              props.currentTabSetter("DMS");
              props.setSelectedInnerTab("AccountOverview");
            }}
          >
            <img
              src={
                currentUser.image
                  ? currentUser.image
                  : currentUser.psuedonym_image
                  ? currentUser.psuedonym_image
                  : ""
              }
              alt="logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          </button>
        </Tooltip>
      </div>
      <div id="joined-server-list">
        <div id="users-owned-servers">
          <div className="flex flex-col items-center border-b border-zinc-200 py-2 dark:border-zinc-600">
            {usersServers?.map((server: Server) => (
              <div className="py-2" key={server.id}>
                {props.selectedInnerTabID == server.id &&
                props.currentTab == "server" ? (
                  <span className="absolute -ml-[1.25rem] mt-4 h-4 w-4 rounded-full bg-zinc-200" />
                ) : null}
                <Tooltip
                  content={server.name}
                  trigger="hover"
                  color={isDarkTheme ? "secondary" : "default"}
                  placement="rightEnd"
                >
                  <button
                    className=""
                    onClick={() => {
                      props.setSelectedInnerTab(server.name);
                      props.setSelectedInnerTabID(server.id);
                      props.currentTabSetter("server");
                      props.setSelectedChannel(null);
                    }}
                  >
                    {server.logo_url ? (
                      <div className="shaker">
                        <Image
                          src={server.logo_url}
                          alt={`${server.name} logo`}
                          width={56}
                          height={56}
                          className="rounded-full"
                        />
                      </div>
                    ) : (
                      <div
                        className={`${raleway.className} borderRadiusTransform shaker flex h-[56px] w-[56px] items-center justify-center rounded-2xl bg-zinc-300 p-2 text-2xl text-violet-500 hover:bg-zinc-400 active:bg-zinc-500 dark:bg-zinc-600 dark:text-violet-900 dark:hover:bg-zinc-700 dark:active:bg-zinc-800`}
                      >
                        {server.name.charAt(0)}
                      </div>
                    )}
                  </button>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="server-utilities">
        <div className="my-4 flex justify-center">
          <Tooltip
            content={"Add a Server!"}
            trigger="hover"
            color={isDarkTheme ? "secondary" : "default"}
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
                stroke={isDarkTheme ? "#4c1d95" : "#8b5cf6"}
                strokeWidth={1.5}
              />
            </button>
          </Tooltip>
        </div>
        <div className="flex justify-center">
          <Tooltip
            content={"Join Public Server!"}
            trigger="hover"
            color={isDarkTheme ? "secondary" : "default"}
            placement="rightEnd"
          >
            <button
              className="borderRadiusTransform shaker flex justify-center rounded-2xl bg-zinc-300 p-2 hover:bg-zinc-400 active:bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:active:bg-zinc-800"
              onClick={() => {
                props.currentTabSetter("PublicServers");
                props.setSelectedInnerTab("");
              }}
            >
              <div className="flex h-[40px] w-[40px] items-center justify-center">
                <BullhornIcon
                  height={30}
                  width={30}
                  fill={isDarkTheme ? "#4c1d95" : "#8b5cf6"}
                  strokeWidth={1}
                />
              </div>
            </button>
          </Tooltip>
          {props.currentTab === "PublicServers" ? (
            <span className="absolute mr-20 mt-4 h-4 w-4 rounded-full bg-zinc-200" />
          ) : null}
        </div>
        <div className="mt-4 flex justify-center border-t border-zinc-200 py-4 dark:border-zinc-600">
          <Tooltip
            content={"Bot Services"}
            trigger="hover"
            color={isDarkTheme ? "secondary" : "default"}
            placement="rightEnd"
          >
            <button
              ref={props.botButtonRef}
              className="borderRadiusTransform shaker flex justify-center rounded-2xl bg-zinc-300 p-2 hover:bg-zinc-400 active:bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:active:bg-zinc-800"
              onClick={props.botModalToggle}
            >
              <RobotForApp
                height={40}
                width={40}
                fill={isDarkTheme ? "#4c1d95" : "#8b5cf6"}
              />
            </button>
          </Tooltip>
        </div>
        <div className="flex justify-center p-2 align-bottom">
          <button
            onClick={() => {
              toggleInnerNav();
              setInnerHiddenRotate(!innerHiddenRotate);
            }}
            className={`${innerHiddenRotate ? "rotate-180" : ""}`}
          >
            <DoubleChevrons
              height={24}
              width={24}
              stroke="#f4f4f5"
              strokeWidth={1}
            />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
