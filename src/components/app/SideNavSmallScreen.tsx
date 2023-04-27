import AddIcon from "@/src/icons/AddIcon";
import BullhornIcon from "@/src/icons/BullhornIcon";
import ChevronDown from "@/src/icons/ChevronDown";
import RobotForApp from "@/src/icons/RobotForApp";
import { Raleway } from "next/font/google";
import { Tooltip } from "@nextui-org/react";
import { Server, Server_Admin, Server_Channel, Server_Member, User } from "@prisma/client";
import { RefObject, useRef, useState } from "react";
import useOnClickOutside from "@/src/components/ClickOutsideHook";

const raleway = Raleway({ weight: "400", subsets: ["latin"] });

const SideNavSmallScreen = (props: {
  isDarkTheme: boolean;
  currentTabSetter(id: string): void;
  innerTabSetter: (tab: string) => void;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
  serverButtonRef: RefObject<HTMLButtonElement>;
  botButtonRef: RefObject<HTMLButtonElement>;
  botModalToggle: any;
  usersServers: Server[] | undefined;
  timestamp: number;
  selectedInnerTabID: number;
  currentTab: string;
  setSelectedInnerTabID: (id: number) => void;
  channelSetter: (input: Server_Channel | null) => void;
  serverModalToggle: any;
  serverSetter: (server: Server) => void;
}) => {
  const {
    isDarkTheme,
    currentTabSetter,
    innerTabSetter,
    currentUser,
    timestamp,
    currentTab,
    selectedInnerTabID,
    usersServers,
    setSelectedInnerTabID,
    channelSetter,
    serverModalToggle,
    botModalToggle,
    serverSetter,
    botButtonRef,
  } = props;
  const [navDropDownShowing, setNavDropDownShowing] = useState(false);
  const navDropdownRef = useRef<HTMLDivElement>(null);
  const navDropdownButton = useRef<HTMLButtonElement>(null);

  useOnClickOutside([navDropdownRef, navDropdownButton], () => {
    setNavDropDownShowing(false);
  });

  const botModalTrigger = () => {
    botModalToggle();
    setNavDropDownShowing(false);
  };
  const serverModalTrigger = () => {
    serverModalToggle();
    setNavDropDownShowing(false);
  };

  return (
    <div className="md:hidden">
      <div className="flex justify-center">
        <button
          ref={navDropdownButton}
          className="z-[60] mt-2 flex rounded bg-purple-200 px-4 py-2 hover:bg-purple-300 active:bg-purple-400 dark:bg-zinc-900 dark:hover:bg-zinc-700 dark:active:bg-zinc-600"
          onClick={() => setNavDropDownShowing(!navDropDownShowing)}
        >
          <div className="my-auto pr-1">
            <ChevronDown height={20} width={20} stroke={isDarkTheme ? "#f4f4f5" : "#27272a"} strokeWidth={1} />
          </div>
          <div className="my-auto">Navigation</div>
        </button>
        {navDropDownShowing ? (
          <div className="stopIT fade-in absolute z-50 h-screen overflow-y-scroll px-8 backdrop-blur">
            <div
              ref={navDropdownRef}
              className="z-[100] mb-4 mt-16 w-28 rounded-lg bg-purple-700 shadow-2xl dark:bg-zinc-900 md:hidden"
            >
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
                      currentTabSetter("DMS");
                      innerTabSetter("AccountOverview");
                    }}
                  >
                    <img
                      src={
                        currentUser.image
                          ? `${currentUser.image}?t=${timestamp}`
                          : currentUser.pseudonym_image
                          ? `${currentUser.pseudonym_image}?t=${timestamp}`
                          : ""
                      }
                      alt="logo"
                      className="stopIT h-14 w-14 rounded-full"
                    />
                  </button>
                </Tooltip>
              </div>
              <div id="joined-server-list">
                <div id="users-owned-servers">
                  <div className="flex flex-col items-center border-b border-zinc-200 py-2 dark:border-zinc-600">
                    {usersServers?.map((server: Server) => (
                      <div className="py-2" key={server.id}>
                        {selectedInnerTabID == server.id && currentTab == "server" ? (
                          <span className="absolute -ml-3 -mt-1 h-4 w-4 rounded-full bg-purple-200" />
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
                              innerTabSetter(server.name);
                              setSelectedInnerTabID(server.id);
                              serverSetter(server);
                              currentTabSetter("server");
                              channelSetter(null);
                              setNavDropDownShowing(false);
                            }}
                          >
                            {server.logo_url ? (
                              <div className="shaker">
                                <img
                                  src={`${server.logo_url}?t=${timestamp}`}
                                  alt={`${server.name} logo`}
                                  className="h-16 w-16 rounded-full"
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
                <div className="flex justify-center py-4">
                  <Tooltip
                    content={"Add a Server!"}
                    trigger="hover"
                    color={isDarkTheme ? "secondary" : "default"}
                    placement="rightEnd"
                  >
                    <button
                      ref={props.serverButtonRef}
                      className="borderRadiusTransform shaker flex justify-center rounded-2xl border border-zinc-600 bg-zinc-300 p-2 hover:bg-zinc-400 active:bg-zinc-500 dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:active:bg-zinc-900"
                      onClick={serverModalTrigger}
                    >
                      <AddIcon height={48} width={48} stroke={isDarkTheme ? "#9333ea" : "#8b5cf6"} strokeWidth={1} />
                    </button>
                  </Tooltip>
                </div>
                <div className="flex justify-center">
                  {currentTab === "PublicServers" ? (
                    <span className="absolute -mt-1 ml-1 mr-20 h-4 w-4 rounded-full bg-zinc-200" />
                  ) : null}
                  <Tooltip
                    content={"Join Public Server!"}
                    trigger="hover"
                    color={isDarkTheme ? "secondary" : "default"}
                    placement="rightEnd"
                  >
                    <button
                      className="borderRadiusTransform shaker flex justify-center rounded-2xl border border-zinc-600 bg-zinc-300 p-4 hover:bg-zinc-400 active:bg-zinc-500 dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:active:bg-zinc-900"
                      onClick={() => {
                        currentTabSetter("PublicServers");
                        innerTabSetter("");
                        setNavDropDownShowing(false);
                      }}
                    >
                      <BullhornIcon
                        height={32}
                        width={32}
                        fill={isDarkTheme ? "#9333ea" : "#8b5cf6"}
                        strokeWidth={1.5}
                      />
                    </button>
                  </Tooltip>
                </div>
                <div className="mt-4 flex justify-center border-t border-zinc-200 py-4 dark:border-zinc-600">
                  <Tooltip
                    content={"Bot Services"}
                    trigger="hover"
                    color={isDarkTheme ? "secondary" : "default"}
                    placement="rightEnd"
                  >
                    <button
                      ref={botButtonRef}
                      className="borderRadiusTransform shaker flex justify-center rounded-2xl border border-zinc-600 bg-zinc-300 p-2 hover:bg-zinc-400 active:bg-zinc-500 dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:active:bg-zinc-900"
                      onClick={botModalTrigger}
                    >
                      <RobotForApp height={48} width={48} fill={isDarkTheme ? "#9333ea" : "#8b5cf6"} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SideNavSmallScreen;
