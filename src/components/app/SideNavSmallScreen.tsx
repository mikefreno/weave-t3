import AddIcon from "@/src/icons/AddIcon";
import BullhornIcon from "@/src/icons/BullhornIcon";
import ChevronDown from "@/src/icons/ChevronDown";
import RobotForApp from "@/src/icons/RobotForApp";
import { Raleway, Nunito } from "next/font/google";
import { Switch, Tooltip } from "@nextui-org/react";
import { Server, Server_Admin, Server_Channel, Server_Member, User } from "@prisma/client";
import { RefObject, useContext, useEffect, useRef, useState } from "react";
import useOnClickOutside from "@/src/components/ClickOutsideHook";
import { MoonIcon } from "@/src/icons/MoonIcon";
import { SunIcon } from "@/src/icons/SunIcon";
import ThemeContext from "../ThemeContextProvider";
import Link from "next/link";
import { signOut } from "next-auth/react";
import BackArrow from "@/src/icons/BackArrow";
import InfoModalContent from "../InfoModalContent";

const raleway = Raleway({ weight: "400", subsets: ["latin"] });
const nunito_200 = Nunito({ weight: "200", subsets: ["latin"] });

const SideNavSmallScreen = (props: {
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
  serverID: number | undefined;
  currentTab: string;
  channelSetter: (input: Server_Channel | null) => void;
  serverModalToggle: any;
  serverSetter: (server: Server) => void;
}) => {
  const {
    currentTabSetter,
    innerTabSetter,
    currentUser,
    timestamp,
    currentTab,
    usersServers,
    channelSetter,
    serverModalToggle,
    botModalToggle,
    serverSetter,
    botButtonRef,
  } = props;
  const { isDarkTheme, switchDarkTheme } = useContext(ThemeContext);
  const [navDropDownShowing, setNavDropDownShowing] = useState(false);
  const [infoDropdownShowing, setInfoDropdownShowing] = useState(false);
  const [showingDocs, setShowingDocs] = useState<boolean>(false);
  const [menuShowing, setMenuShowing] = useState<boolean>(false);
  const navDropdownRef = useRef<HTMLDivElement>(null);
  const navDropdownButton = useRef<HTMLButtonElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside([navDropdownRef, navDropdownButton], () => {
    setNavDropDownShowing(false);
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!menuShowing) {
      timer = setTimeout(() => {
        setInfoDropdownShowing(false);
        setShowingDocs(false);
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [menuShowing]);

  const botModalTrigger = () => {
    botModalToggle();
    setNavDropDownShowing(false);
  };
  const serverModalTrigger = () => {
    serverModalToggle();
    setNavDropDownShowing(false);
  };
  const toggleMenu = () => {
    setMenuShowing(!menuShowing);
  };

  const infoDropdownToggle = () => {
    setInfoDropdownShowing(!infoDropdownShowing);
  };
  const docsToggle = () => {
    setShowingDocs(!showingDocs);
  };

  return (
    <div className="md:hidden">
      <button
        ref={navDropdownButton}
        className="absolute z-[1000] ml-2 mt-3 flex rounded bg-purple-200 px-4 py-2 hover:bg-purple-300 active:bg-purple-400 dark:bg-zinc-900 dark:hover:bg-zinc-700 dark:active:bg-zinc-600"
        onClick={() => setNavDropDownShowing(!navDropDownShowing)}
      >
        <div className="my-auto pr-1">
          <ChevronDown height={20} width={20} stroke={isDarkTheme ? "#f4f4f5" : "#27272a"} strokeWidth={1} />
        </div>
        <div className="my-auto">Navigation</div>
      </button>
      <div className="flex justify-center">
        {navDropDownShowing ? (
          <div className="stopIT fade-in scrollXDisabled absolute z-50 h-screen overflow-y-scroll px-8 backdrop-blur">
            <div
              ref={navDropdownRef}
              className="mb-4 w-28 rounded-lg bg-purple-700 shadow-2xl dark:bg-zinc-900 md:hidden"
            >
              <div className="mt-16 flex justify-center border-b border-zinc-200 py-4 dark:border-zinc-600">
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
                      setNavDropDownShowing(false);
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
                        {props.serverID == server.id && currentTab == "server" ? (
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
                        innerTabSetter("Made By Weave");
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
        <div className="absolute bottom-8 z-40 flex w-full justify-evenly pr-4">
          <div>
            <button onClick={toggleMenu} className="">
              <div className={`${menuShowing ? "rotate-90" : "-rotate-90"} transition-all duration-500 ease-in-out`}>
                <ChevronDown height={44} width={44} stroke={isDarkTheme ? "white" : "black"} strokeWidth={1} />
              </div>
            </button>
          </div>
          <div className="my-auto pr-4">
            <Switch
              checked={isDarkTheme}
              shadow
              bordered
              size="md"
              color="secondary"
              iconOn={<MoonIcon />}
              iconOff={<SunIcon />}
              onChange={switchDarkTheme}
            />
          </div>
        </div>
        <div
          className={`absolute bottom-8 z-30 transition-all duration-500 ${menuShowing ? "" : "-translate-x-[120%]"} `}
        >
          <div
            className={`${nunito_200} -ml-6 rounded-r-2xl border border-zinc-400 bg-zinc-50 shadow-xl dark:border-zinc-500 dark:bg-zinc-900`}
          >
            <ul className="pb-8 pl-2">
              {!infoDropdownShowing ? (
                <>
                  <li className="pt-2 text-lg">
                    <Link href="/">
                      <div className="rounded-lg p-2 px-4 text-center text-lg text-zinc-800 active:bg-purple-400 dark:text-zinc-100 dark:active:bg-zinc-700">
                        Home
                      </div>
                    </Link>
                  </li>
                  <li className="flex justify-center text-lg">
                    <button
                      className="w-28 rounded-lg p-2 text-center text-lg text-zinc-800 active:bg-purple-400 dark:text-zinc-100 dark:active:bg-zinc-700"
                      ref={infoButtonRef}
                      onClick={infoDropdownToggle}
                    >
                      Info
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut()}
                      className="w-28 rounded-lg px-4 py-2 text-center text-lg text-zinc-800 active:bg-purple-400 dark:text-zinc-300 dark:active:bg-zinc-700"
                    >
                      Sign out
                    </button>
                  </li>
                </>
              ) : showingDocs ? (
                <div className="z-[100]">
                  <button className="-ml-2 flex rounded-full px-2 py-1 pb-4" onClick={docsToggle}>
                    <div className="my-auto">
                      <BackArrow height={24} width={24} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1} />
                    </div>
                    <div className="pl-2">Back</div>
                  </button>
                  <div className="pb-4 pl-4">
                    <li className="w-[8.5rem]">
                      <div className="rounded active:bg-purple-400 dark:active:bg-zinc-700">
                        <div className="text-lg text-zinc-800 dark:text-zinc-100">Roadmap</div>
                        <p className="max-w-[7rem] px-0.5 text-center text-sm text-zinc-600 dark:text-zinc-400">
                          See whats coming
                        </p>
                      </div>
                    </li>
                    <li className="w-[8.5rem]">
                      <Tooltip content={"Coming Soon!"} trigger="click" color={"secondary"} placement="bottom">
                        <div className="rounded active:bg-purple-400 dark:active:bg-zinc-700">
                          <div className="text-lg text-zinc-800 dark:text-zinc-100">API & Bots</div>
                          <p className="max-w-[7rem] px-0.5 text-center text-sm text-zinc-600 dark:text-zinc-400">
                            Get more from Weave
                          </p>
                        </div>
                      </Tooltip>
                    </li>
                    <li className="w-[8.5rem]">
                      <Link href="/docs/privacy-policy">
                        <div className="rounded hover:bg-purple-400 dark:hover:bg-zinc-700">
                          <div className="text-lg text-zinc-800 dark:text-zinc-100">Privacy Policy</div>
                          <p className="max-w-[7rem] px-0.5 text-center text-sm text-zinc-600 dark:text-zinc-400">
                            See how we gather and handle your data
                          </p>
                        </div>
                      </Link>
                    </li>
                    <li className="w-[8.5rem]">
                      <Link href="/docs/terms-of-service">
                        <div className="rounded hover:bg-purple-400 dark:hover:bg-zinc-700">
                          <div className="text-lg text-zinc-800 dark:text-zinc-100">Terms of Service</div>
                          <p className="max-w-[7rem] px-0.5 text-center text-sm text-zinc-600 dark:text-zinc-400">
                            Check out the ToS
                          </p>
                        </div>
                      </Link>
                    </li>
                  </div>
                </div>
              ) : (
                <div className="z-[100]">
                  <button className="-ml-2 flex rounded-full px-2 py-1 pb-4" onClick={infoDropdownToggle}>
                    <div className="my-auto">
                      <BackArrow height={24} width={24} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1} />
                    </div>
                    <div className="pl-2">Back</div>
                  </button>
                  <div className="pb-4 pl-4">
                    <li className="w-[8.5rem]">
                      <Tooltip content={"Coming Soon!"} trigger="click" color={"secondary"} placement="bottom">
                        <div className="rounded hover:bg-purple-400 dark:hover:bg-zinc-700">
                          <div className="text-lg text-zinc-800 dark:text-zinc-100">Downloads</div>
                          <p className="max-w-[7rem] px-0.5 text-center text-sm text-zinc-600 dark:text-zinc-400">
                            Coming soon
                          </p>
                        </div>
                      </Tooltip>
                    </li>
                    <li className="w-[8.5rem]">
                      <Link href="/docs/what-is-weave">
                        <div className="rounded hover:bg-purple-400 dark:hover:bg-zinc-700">
                          <div className="text-lg text-zinc-800 dark:text-zinc-100">What is Weave?</div>
                          <p className="max-w-[7rem] px-0.5 text-center text-sm text-zinc-600 dark:text-zinc-400">
                            An explainer
                          </p>
                        </div>
                      </Link>
                    </li>
                    <li className="w-[8.5rem]">
                      <Link href="/contact">
                        <div className="rounded hover:bg-purple-400 dark:hover:bg-zinc-700">
                          <div className="text-lg text-zinc-800 dark:text-zinc-100">Contact</div>
                          <p className="max-w-[7rem] px-0.5 text-center text-sm text-zinc-600 dark:text-zinc-400">
                            Question or comment? Reach out!
                          </p>
                        </div>
                      </Link>
                    </li>
                    <li className="w-[8.5rem]">
                      <button onClick={docsToggle} className="rounded hover:bg-purple-400 dark:hover:bg-zinc-700">
                        <div className="text-left text-lg text-zinc-800 dark:text-zinc-100">Docs</div>
                        <p className="max-w-[7rem] px-0.5 text-center text-sm text-zinc-600 dark:text-zinc-400">
                          API, Bots, Terms of Service, and more
                        </p>
                      </button>
                    </li>
                  </div>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavSmallScreen;
