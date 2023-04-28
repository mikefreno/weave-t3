import AddIcon from "@/src/icons/AddIcon";
import ArrowTrend from "@/src/icons/ArrowTrend";
import BeakerIcon from "@/src/icons/BeakerIcon";
import BooksIcon from "@/src/icons/BooksIcon";
import CameraIcon from "@/src/icons/CameraIcon";
import ClockIcon from "@/src/icons/ClockIcon";
import FlameIcon from "@/src/icons/FlameIcon";
import GamepadIcon from "@/src/icons/GamepadIcon";
import HandWave from "@/src/icons/HandWave";
import PaperPlanes from "@/src/icons/PaperPlanes";
import SearchIcon from "@/src/icons/SearchIcon";
import SettingsIcon from "@/src/icons/SettingsIcon";
import VerifiedIcon from "@/src/icons/VerifiedIcon";
import VinylIcon from "@/src/icons/VinylIcon";
import useOnClickOutside from "@/src/components/ClickOutsideHook";
import CommentsIcon from "@/src/icons/CommentsIcon";
import { Input, Tooltip } from "@nextui-org/react";
import { Server, Server_Admin, Server_Channel, Server_Member, User } from "@prisma/client";
import React, { MouseEventHandler, RefObject, useContext, useRef, useState } from "react";
import ThemeContext from "../ThemeContextProvider";
import { api } from "@/src/utils/api";
import SideNavSmallScreen from "./SideNavSmallScreen";
import Search from "./Search";

import { type Server as MongoServer, type User as MongoUser } from "@prisma/client/mongo";
import VideoCamIcon from "@/src/icons/VideoCamIcon";
import SpeakerOn from "@/src/icons/SpeakerOn";
import SpeakerOff from "@/src/icons/SpeakerOff";
import MicIcon from "@/src/icons/MicIcon";
import MicSlashIcon from "@/src/icons/MicSlashIcon";

type ServerIncludingChannel = {
  id: number;
  name: string;
  blurb: string | null;
  logo_url: string | null;
  type: string;
  banner_url: string | null;
  unlisted: boolean;
  ownerId: string;
  category: string;
  channels: Server_Channel[];
};

interface InnerNavProps {
  serverModalToggle: MouseEventHandler<HTMLButtonElement>;
  botButtonRef: RefObject<HTMLButtonElement>;
  serverButtonRef: RefObject<HTMLButtonElement>;
  timestamp: number;
  currentTabSetter(id: string): void;
  currentTab: string;
  directMessageButtonRef: RefObject<HTMLButtonElement>;
  dmModalToggle: React.MouseEventHandler<HTMLButtonElement>;
  selectedInnerTab: string;
  innerTabSetter: (tab: string) => void;
  usersServers: ServerIncludingChannel[];
  selectedInnerTabID: number;
  selectedChannel: Server_Channel | null;
  channelSetter: (input: Server_Channel | null) => void;
  refreshUserServers: any;
  botModalToggle: MouseEventHandler<HTMLButtonElement>;
  setSelectedInnerTabID: (id: number) => void;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
  loadingOverlaySetter: (boolean: boolean) => void;
  serverRefetch: () => Promise<void>;
  socket: WebSocket | null;
  createChannelToggle: () => void;
  createChannelButtonRef: RefObject<HTMLButtonElement>;
  inviteModalToggle: () => void;
  inviteModalButtonRef: RefObject<HTMLButtonElement>;
  serverSetter: (server: Server) => void;
  userSelect: (input: MongoUser) => void;
  currentTabSetter: (id: string) => void;
  microphoneState: boolean;
  microphoneToggle: any;
  audioState: boolean;
  audioToggle: any;
  serverSettingsToggle: () => void;
}

const InnerNav = (props: InnerNavProps) => {
  const {
    currentTabSetter,
    currentTab,
    selectedInnerTab,
    innerTabSetter,
    currentUser,
    selectedChannel,
    selectedInnerTabID,
    usersServers,
    loadingOverlaySetter,
    serverRefetch,
    timestamp,
    setSelectedInnerTabID,
    channelSetter,
    socket,
    createChannelToggle,
    createChannelButtonRef,
    inviteModalToggle,
    inviteModalButtonRef,
    serverSetter,
  } = props;
  const { isDarkTheme } = useContext(ThemeContext);
  //state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("Recent");
  const [userSearchData, setUserSearchData] = useState<MongoUser[] | null>(null);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  //ref
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  //trpc (api)
  const deleteUserFromServer = api.server.deleteUserFromServer.useMutation();
  const getUserSearchData = api.searchRouter.getMongoUsers.useMutation();

  //click outside hook
  useOnClickOutside([searchInputRef, searchResultsRef], () => {
    setShowSearch(false);
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  const leaveServerAlert = async () => {
    const confirmed = window.confirm("Are you sure you want to leave the server?");
    if (confirmed) {
      loadingOverlaySetter(true);
      await deleteUserFromServer.mutateAsync(selectedInnerTabID);
      await serverRefetch();
      loadingOverlaySetter(false);
    }
  };

  const loadUserSearchData = async () => {
    if (!userSearchData) {
      const res: MongoUser[] | null = await getUserSearchData.mutateAsync();
      if (res) {
        setUserSearchData(res);
      } else {
        console.log("error retrieving user search data");
      }
    }
  };

  const currentTabRender = () => {
    if (currentTab == "DMS") {
      return (
        <>
          <div className="px-2 pt-2">
            <Input
              ref={searchInputRef}
              aria-label="search input"
              type="search"
              className="w-24 text-xs"
              placeholder="Search..."
              value={searchTerm}
              onFocus={() => {
                loadUserSearchData();
                setShowSearch(true);
              }}
              onChange={(event) => setSearchTerm(event.target.value)}
              contentLeft={<SearchIcon height={12} width={12} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} />}
            />
            {showSearch && userSearchData && searchTerm.length > 2 ? (
              <div className="flex justify-center">
                <div className="fixed w-48 " ref={searchResultsRef}>
                  <Search userInput={searchTerm} select={props.userSelect} userData={userSearchData} />
                </div>
              </div>
            ) : null}
          </div>
          <div className="">
            <button
              className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
                selectedInnerTab == "friends"
                  ? "bg-purple-200 dark:bg-purple-500"
                  : "hover:bg-purple-300 dark:hover:bg-zinc-700"
              }`}
              onClick={() => innerTabSetter("friends")}
            >
              <span className="my-auto">
                <HandWave height={24} width={24} color={isDarkTheme ? "#e4e4e7" : "#27272a"} />
              </span>
              <span className="mx-auto">Friends</span>
            </button>
            <button
              className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
                selectedInnerTab == "requests"
                  ? "bg-purple-200 dark:bg-purple-500"
                  : "hover:bg-purple-300 dark:hover:bg-zinc-700"
              }`}
              onClick={() => innerTabSetter("requests")}
            >
              <span className="my-auto">
                <PaperPlanes height={24} width={24} color={isDarkTheme ? "#e4e4e7" : "#27272a"} />
              </span>
              <span className="mx-auto">Requests</span>
            </button>
            <hr className="my-4 h-[2px]" />
            <div className="my-4 flex justify-evenly">
              <Tooltip
                content={"Sort by most frequent"}
                trigger="hover"
                color={isDarkTheme ? "secondary" : "default"}
                placement="bottom"
                css={{ width: "5rem" }}
              >
                <button onClick={() => setSortType("Frequency")}>
                  <FlameIcon
                    height={18}
                    width={18}
                    stroke={
                      sortType == "Frequency"
                        ? isDarkTheme
                          ? "#ef4444"
                          : "#b91c1c"
                        : isDarkTheme
                        ? "#e4e4e7"
                        : "#27272a"
                    }
                    strokeWidth={1.5}
                  />
                </button>
              </Tooltip>
              <Tooltip
                content={"Sort by most recent"}
                trigger="hover"
                color={isDarkTheme ? "secondary" : "default"}
                placement="bottom"
                css={{ width: "5rem" }}
              >
                <button onClick={() => setSortType("Recent")}>
                  <ClockIcon
                    height={18}
                    width={18}
                    stroke={
                      sortType == "Recent" ? (isDarkTheme ? "#0284c7" : "#0369a1") : isDarkTheme ? "#e4e4e7" : "#27272a"
                    }
                    strokeWidth={1.5}
                  />
                </button>
              </Tooltip>
            </div>
            <div className="flex justify-center">
              <span>Direct Messages</span>
              <button
                ref={props.directMessageButtonRef}
                className="my-auto mt-1 pl-2 md:pl-4"
                onClick={props.dmModalToggle}
              >
                <AddIcon height={18} width={18} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1.5} />
              </button>
            </div>
            <div id="Direct-Message-List"></div>
          </div>
        </>
      );
    } else if (currentTab == "PublicServers") {
      return (
        <>
          <span className="justify-left flex pl-4 pt-4 text-xl font-bold">Public Servers</span>
          <form onSubmit={handleSubmit} className="mx-2 py-4">
            <Input
              aria-label="search input"
              type="search"
              className="w-24 text-xs"
              placeholder="Search..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              contentLeft={<SearchIcon height={12} width={12} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} />}
            />
          </form>
          <button
            className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
              selectedInnerTab == "Made By Weave"
                ? "bg-purple-200 dark:bg-purple-500"
                : "hover:bg-purple-300 dark:hover:bg-zinc-700"
            }`}
            onClick={() => innerTabSetter("Made By Weave")}
          >
            <span className="my-auto -ml-2">
              <VerifiedIcon height={24} width={24} color="#5b21b6" />
            </span>
            <span className="mx-auto">Made By Weave</span>
          </button>
          <hr className="my-4 h-[2px]" />
          <button
            className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
              selectedInnerTab == "Science & Technology"
                ? "bg-purple-200 dark:bg-purple-500"
                : "hover:bg-purple-300 dark:hover:bg-zinc-700"
            }`}
            onClick={() => innerTabSetter("Science & Technology")}
          >
            <span className="my-auto">
              <BeakerIcon height={24} width={24} color={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1.5} />
            </span>
            <span className="mx-auto">Science & Technology</span>
          </button>
          <button
            className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
              selectedInnerTab == "Education"
                ? "bg-purple-200 dark:bg-purple-500"
                : "hover:bg-purple-300 dark:hover:bg-zinc-700"
            }`}
            onClick={() => innerTabSetter("Education")}
          >
            <span className="my-auto">
              <BooksIcon height={24} width={24} color={isDarkTheme ? "#e4e4e7" : "#27272a"} />
            </span>
            <span className="mx-auto">Education</span>
          </button>
          <button
            className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
              selectedInnerTab == "Gaming"
                ? "bg-purple-200 dark:bg-purple-500"
                : "hover:bg-purple-300 dark:hover:bg-zinc-700"
            }`}
            onClick={() => innerTabSetter("Gaming")}
          >
            <span className="my-auto">
              <GamepadIcon height={30} width={30} color={isDarkTheme ? "#e4e4e7" : "#27272a"} />
            </span>
            <span className="mx-auto">Gaming</span>
          </button>
          <button
            className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
              selectedInnerTab == "Entertainment"
                ? "bg-purple-200 dark:bg-purple-500"
                : "hover:bg-purple-300 dark:hover:bg-zinc-700"
            }`}
            onClick={() => innerTabSetter("Entertainment")}
          >
            <span className="my-auto">
              <CameraIcon height={24} width={24} color={isDarkTheme ? "#e4e4e7" : "#27272a"} />
            </span>
            <span className="mx-auto pl-2">Entertainment</span>
          </button>
          <button
            className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
              selectedInnerTab == "Music"
                ? "bg-purple-200 dark:bg-purple-500"
                : "hover:bg-purple-300 dark:hover:bg-zinc-700"
            }`}
            onClick={() => innerTabSetter("Music")}
          >
            <span className="my-auto">
              <VinylIcon height={24} width={24} color={isDarkTheme ? "#e4e4e7" : "#27272a"} />
            </span>
            <span className="mx-auto">Music</span>
          </button>
          <button
            className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
              selectedInnerTab == "Finance & Economics"
                ? "bg-purple-200 dark:bg-purple-500"
                : "hover:bg-purple-300 dark:hover:bg-zinc-700"
            }`}
            onClick={() => innerTabSetter("Finance & Economics")}
          >
            <span className="my-auto">
              <ArrowTrend height={24} width={24} color={isDarkTheme ? "#e4e4e7" : "#27272a"} />
            </span>
            <span className="mx-auto">Finance & Economics</span>
          </button>
        </>
      );
    } else if (currentTab == "server") {
      return (
        <>
          <button
            className="justify-left flex pl-4 pt-4 text-xl font-bold"
            onClick={() => {
              channelSetter(null);
              props.serverSettingsToggle();
            }}
          >
            {selectedInnerTab}
          </button>
          <div className="p-4">
            {/* if user is owner or admin  */}
            <button
              className="logoSpinner"
              onClick={() => {
                channelSetter(null);
                props.serverSettingsToggle();
              }}
            >
              <SettingsIcon height={24} width={24} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1} />
            </button>
            {/* end */}
            <div>
              <div>
                <div>
                  {(() => {
                    const filteredChannels = usersServers
                      .find((server) => server.id === props.selectedInnerTabID)
                      ?.channels.filter((channel) => channel.type === "text");

                    return filteredChannels && filteredChannels.length === 0 ? null : (
                      <div className="pb-4">
                        <div className="rule-around -mx-4 text-center text-sm">Text Channels</div>
                        {filteredChannels?.map((channel) => (
                          <div className="my-2" key={channel.id}>
                            <button
                              onClick={() => channelSetter(channel)}
                              className={`flex h-10 w-full rounded-md border border-zinc-300 bg-zinc-100 px-2 hover:bg-zinc-200 active:bg-zinc-300 ${
                                selectedChannel?.id == channel.id
                                  ? "dark:border-purple-600"
                                  : "border-zinc-300 dark:border-zinc-600"
                              } dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-700`}
                            >
                              <span className="my-auto">
                                <CommentsIcon
                                  height={24}
                                  width={24}
                                  strokeWidth={0.5}
                                  color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                                />
                              </span>
                              <div className="my-auto ml-4 text-left">{channel.name}</div>
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                <div>
                  {(() => {
                    const filteredChannels = usersServers
                      .find((server) => server.id === props.selectedInnerTabID)
                      ?.channels.filter((channel) => channel.type === "audio");

                    return filteredChannels && filteredChannels.length === 0 ? null : (
                      <div className="pb-4">
                        <div className="rule-around -mx-4 text-center text-sm">Audio Channels</div>
                        {filteredChannels?.map((channel) => (
                          <div className="my-2" key={channel.id}>
                            <button
                              onClick={() => channelSetter(channel)}
                              className={`flex h-10 w-full rounded-md border border-zinc-300 bg-zinc-100 px-2 hover:bg-zinc-200 active:bg-zinc-300 ${
                                selectedChannel?.id == channel.id
                                  ? "dark:border-purple-600"
                                  : "border-zinc-300 dark:border-zinc-600"
                              } dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-700`}
                            >
                              <span className="my-auto">
                                <SpeakerOn
                                  height={24}
                                  width={24}
                                  stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                                  strokeWidth={0.5}
                                />
                              </span>
                              <div className="my-auto ml-4 text-left">{channel.name}</div>
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                <div>
                  {(() => {
                    const filteredChannels = usersServers
                      .find((server) => server.id === props.selectedInnerTabID)
                      ?.channels.filter((channel) => channel.type === "video");

                    return filteredChannels && filteredChannels.length === 0 ? null : (
                      <div className="pb-4">
                        <div className="rule-around -mx-4 text-center text-sm">Video Channels</div>
                        {filteredChannels?.map((channel) => (
                          <div className="my-2" key={channel.id}>
                            <button
                              onClick={() => channelSetter(channel)}
                              className={`flex h-10 w-full rounded-md border border-zinc-300 bg-zinc-100 px-2 hover:bg-zinc-200 active:bg-zinc-300 ${
                                selectedChannel?.id == channel.id
                                  ? "dark:border-purple-600"
                                  : "border-zinc-300 dark:border-zinc-600"
                              } dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-700`}
                            >
                              <span className="my-auto">
                                <VideoCamIcon
                                  height={24}
                                  width={24}
                                  strokeWidth={0.5}
                                  color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                                />
                              </span>
                              <div className="my-auto ml-4 text-left">{channel.name}</div>
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                <button
                  onClick={createChannelToggle}
                  className="flex underline-offset-2 hover:underline"
                  ref={createChannelButtonRef}
                >
                  <div>Create Channel</div>
                  <div className="my-auto">
                    <AddIcon height={16} width={16} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={2} />
                  </div>
                </button>
              </div>
            </div>
            {/* depends on server settings */}
            <button
              className="flex underline-offset-2 hover:underline"
              onClick={inviteModalToggle}
              ref={inviteModalButtonRef}
            >
              <div>Invite Someone</div>
              <span className="my-auto">
                <AddIcon height={16} width={16} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={2} />
              </span>
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="fixed h-screen w-44 transform border-r border-zinc-700 bg-purple-400 dark:border-zinc-500 dark:bg-zinc-800 md:ml-0 md:w-52">
      <SideNavSmallScreen
        isDarkTheme={isDarkTheme}
        currentTabSetter={currentTabSetter}
        innerTabSetter={innerTabSetter}
        currentUser={currentUser}
        timestamp={timestamp}
        usersServers={usersServers}
        setSelectedInnerTabID={setSelectedInnerTabID}
        channelSetter={channelSetter}
        serverModalToggle={props.serverModalToggle}
        botButtonRef={props.botButtonRef}
        serverButtonRef={props.serverButtonRef}
        botModalToggle={props.botModalToggle}
        selectedInnerTabID={props.selectedInnerTabID}
        currentTab={props.currentTab}
        serverSetter={serverSetter}
      />
      {currentTabRender()}
      <div className="fixed bottom-0 -ml-20 hidden w-44 border-r border-zinc-700 bg-purple-900 text-zinc-200 dark:border-zinc-500 dark:bg-zinc-900 md:ml-0 md:block md:w-52">
        <div className="flex justify-between">
          <div className="flex justify-start">
            <div className="flex flex-row p-2">
              <div className="flex items-center">
                {currentUser?.image ? (
                  <button
                    onClick={() => {
                      innerTabSetter("AccountOverview");
                      props.currentTabSetter("DMS");
                    }}
                  >
                    <img src={`${currentUser.image}?t=${timestamp}`} className="stopIT h-10 w-10 rounded-full" />
                  </button>
                ) : (
                  <button
                    className="h-8 w-8 rounded-full border border-zinc-200 bg-zinc-600"
                    onClick={() => {
                      innerTabSetter("AccountOverview");
                      props.currentTabSetter("DMS");
                    }}
                  >
                    {currentUser?.name?.split(" ")[0]?.charAt(0)} {currentUser?.name?.split(" ")[1]?.charAt(0)}
                  </button>
                )}
              </div>
              <div className="my-auto flex flex-1 flex-col pl-3">
                {currentUser.name ? (
                  <div className="">
                    <button
                      className="flex text-left"
                      onClick={() => {
                        innerTabSetter("AccountOverview");
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
                        innerTabSetter("AccountOverview");
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
                <SpeakerOn height={16} width={16} stroke={"#e4e4e7"} strokeWidth={1.5} />
              ) : (
                <SpeakerOff height={16} width={16} stroke={"#e4e4e7"} strokeWidth={1.5} />
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
    </div>
  );
};

export default InnerNav;
