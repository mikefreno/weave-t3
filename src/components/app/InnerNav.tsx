import AddIcon from "@/src/icons/AddIcon";
import ArrowTrend from "@/src/icons/ArrowTrend";
import BeakerIcon from "@/src/icons/BeakerIcon";
import BooksIcon from "@/src/icons/BooksIcon";
import CameraIcon from "@/src/icons/CameraIcon";
import ClockIcon from "@/src/icons/ClockIcon";
import FlameIcon from "@/src/icons/FlameIcon";
import GamepadIcon from "@/src/icons/GamepadIcon";
import HandWave from "@/src/icons/HandWave";
import HeadphonesIcon from "@/src/icons/HeadphonesIcon";
import PaperPlanes from "@/src/icons/PaperPlanes";
import SearchIcon from "@/src/icons/SearchIcon";
import SettingsIcon from "@/src/icons/SettingsIcon";
import VerifiedIcon from "@/src/icons/VerifiedIcon";
import VinylIcon from "@/src/icons/VinylIcon";
import useOnClickOutside from "@/src/components/ClickOutsideHook";
import CommentsIcon from "@/src/icons/CommentsIcon";
import { Input, Tooltip } from "@nextui-org/react";
import {
  Server,
  Server_Admin,
  Server_Channel,
  Server_Member,
  User,
} from "@prisma/client";
import React, { RefObject, useContext, useRef, useState } from "react";
import ThemeContext from "../ThemeContextProvider";
import CreateChannelModal from "./CreateChannelModal";
import InviteModal from "./InviteModal";
import { api } from "@/src/utils/api";

type ServerIncludingChannel = {
  id: number;
  name: string;
  blurb: string | null;
  logo_url: string | null;
  banner_url: string | null;
  ownerId: string;
  category: string | null;
  channels: Server_Channel[];
};

const InnerNav = (props: {
  currentTab: string;
  directMessageButtonRef: RefObject<HTMLButtonElement>;
  dmModalToggle: React.MouseEventHandler<HTMLButtonElement>;
  selectedInnerTab: string;
  setSelectedInnerTab: any;
  usersServers: ServerIncludingChannel[];
  selectedInnerTabID: number;
  selectedChannel: Server_Channel | null;
  setSelectedChannel: any;
  refreshUserServers: any;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
}) => {
  const {
    currentTab,
    selectedInnerTab,
    setSelectedInnerTab,
    currentUser,
    selectedChannel,
    selectedInnerTabID,
    usersServers,
  } = props;
  const { isDarkTheme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("Recent");

  const [inviteModalShowing, setInviteModalShowing] = useState(false);
  const [createChannelModalShowing, setCreateChannelModalShowing] =
    useState(false);

  const inviteModalButtonRef = useRef<HTMLButtonElement>(null);
  const inviteModalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([inviteModalRef, inviteModalButtonRef], () => {
    setInviteModalShowing(false);
  });
  const createChannelButtonRef = useRef<HTMLButtonElement>(null);
  const createChannelRef = useRef<HTMLDivElement>(null);
  const deleteUser = api.server.deleteUserFromServer.useMutation({});

  useOnClickOutside([createChannelRef, createChannelButtonRef], () => {
    setCreateChannelModalShowing(false);
  });

  const thisServer = usersServers.find(
    (server) => server.id === props.selectedInnerTabID
  );

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Perform your search logic here
  };
  const inviteModalToggle = () => {
    setInviteModalShowing(!inviteModalShowing);
  };
  const createChannelToggle = () => {
    setCreateChannelModalShowing(!createChannelModalShowing);
  };
  const leaveServerAlert = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave the server?"
    );
    if (confirmed) {
      await deleteUser.mutateAsync(thisServer.id);
    }
  };

  if (currentTab == "DMS") {
    return (
      <div className="fixed h-screen w-52 border-l border-r border-zinc-700 bg-zinc-500 dark:border-zinc-500 dark:bg-zinc-800">
        <form onSubmit={handleSubmit} className="mx-2 py-4">
          <Input
            type="search"
            className="w-24 text-xs"
            placeholder="Search..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            contentLeft={
              <SearchIcon
                height={12}
                width={12}
                stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
              />
            }
          />
        </form>
        <div className="">
          <button
            className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
              selectedInnerTab == "friends"
                ? "bg-zinc-400 dark:bg-zinc-500"
                : "hover:bg-zinc-600 dark:hover:bg-zinc-700"
            }`}
            onClick={() => setSelectedInnerTab("friends")}
          >
            <span className="my-auto">
              <HandWave
                height={24}
                width={24}
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
              />
            </span>
            <span className="mx-auto">Friends</span>
          </button>
          <button
            className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
              selectedInnerTab == "requests"
                ? "bg-zinc-400 dark:bg-zinc-500"
                : "hover:bg-zinc-600 dark:hover:bg-zinc-700"
            }`}
            onClick={() => setSelectedInnerTab("requests")}
          >
            <span className="my-auto">
              <PaperPlanes
                height={24}
                width={24}
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
              />
            </span>
            <span className="mx-auto">Requests</span>
          </button>
          <hr className="my-4 h-[2px]" />
          <div className="my-4 flex justify-evenly">
            <Tooltip
              content={"Sort by most frequent"}
              trigger="hover"
              color={"secondary"}
              placement="bottom"
              css={{ width: "min-content" }}
            >
              <button onClick={() => setSortType("Frequency")}>
                <FlameIcon
                  height={18}
                  width={18}
                  stroke={
                    sortType == "Frequency"
                      ? "#dc2626"
                      : isDarkTheme
                      ? "#e4e4e7"
                      : "#27272a"
                  }
                  strokeWidth={1.5}
                />
              </button>
            </Tooltip>
            <Tooltip
              content={"Sort by most recent messages"}
              trigger="hover"
              color={"secondary"}
              placement="bottom"
              css={{ width: "min-content" }}
            >
              <button onClick={() => setSortType("Recent")}>
                <ClockIcon
                  height={18}
                  width={18}
                  stroke={
                    sortType == "Recent"
                      ? "#0284c7"
                      : isDarkTheme
                      ? "#e4e4e7"
                      : "#27272a"
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
              className="my-auto ml-6 mt-1"
              onClick={props.dmModalToggle}
            >
              <AddIcon
                height={18}
                width={18}
                stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                strokeWidth={1.5}
              />
            </button>
          </div>
          <div id="Direct-Message-List"></div>
        </div>
      </div>
    );
  } else if (currentTab == "PublicServers") {
    return (
      <div className="fixed h-screen w-52 border-r border-l border-zinc-700 bg-zinc-500 dark:border-zinc-500 dark:bg-zinc-800">
        <span className="justify-left flex pl-4 pt-4 text-xl font-bold">
          Public Servers
        </span>
        <form onSubmit={handleSubmit} className="mx-2 py-4">
          <Input
            type="search"
            className="w-24 text-xs"
            placeholder="Search..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            contentLeft={
              <SearchIcon
                height={12}
                width={12}
                stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
              />
            }
          />
        </form>
        <button
          className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
            selectedInnerTab == "Made By Weave"
              ? "bg-zinc-400 dark:bg-zinc-500"
              : "hover:bg-zinc-600 dark:hover:bg-zinc-700"
          }`}
          onClick={() => setSelectedInnerTab("Made By Weave")}
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
              ? "bg-zinc-400 dark:bg-zinc-500"
              : "hover:bg-zinc-600 dark:hover:bg-zinc-700"
          }`}
          onClick={() => setSelectedInnerTab("Science & Technology")}
        >
          <span className="my-auto">
            <BeakerIcon
              height={24}
              width={24}
              color={isDarkTheme ? "#e4e4e7" : "#27272a"}
              strokeWidth={1.5}
            />
          </span>
          <span className="mx-auto">Science & Technology</span>
        </button>
        <button
          className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
            selectedInnerTab == "Education"
              ? "bg-zinc-400 dark:bg-zinc-500"
              : "hover:bg-zinc-600 dark:hover:bg-zinc-700"
          }`}
          onClick={() => setSelectedInnerTab("Education")}
        >
          <span className="my-auto">
            <BooksIcon
              height={24}
              width={24}
              color={isDarkTheme ? "#e4e4e7" : "#27272a"}
            />
          </span>
          <span className="mx-auto">Education</span>
        </button>
        <button
          className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
            selectedInnerTab == "Gaming"
              ? "bg-zinc-400 dark:bg-zinc-500"
              : "hover:bg-zinc-600 dark:hover:bg-zinc-700"
          }`}
          onClick={() => setSelectedInnerTab("Gaming")}
        >
          <span className="my-auto">
            <GamepadIcon
              height={30}
              width={30}
              color={isDarkTheme ? "#e4e4e7" : "#27272a"}
            />
          </span>
          <span className="mx-auto">Gaming</span>
        </button>
        <button
          className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
            selectedInnerTab == "Entertainment"
              ? "bg-zinc-400 dark:bg-zinc-500"
              : "hover:bg-zinc-600 dark:hover:bg-zinc-700"
          }`}
          onClick={() => setSelectedInnerTab("Entertainment")}
        >
          <span className="my-auto">
            <CameraIcon
              height={24}
              width={24}
              color={isDarkTheme ? "#e4e4e7" : "#27272a"}
            />
          </span>
          <span className="mx-auto pl-2">Entertainment</span>
        </button>
        <button
          className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
            selectedInnerTab == "Music"
              ? "bg-zinc-400 dark:bg-zinc-500"
              : "hover:bg-zinc-600 dark:hover:bg-zinc-700"
          }`}
          onClick={() => setSelectedInnerTab("Music")}
        >
          <span className="my-auto">
            <VinylIcon
              height={24}
              width={24}
              color={isDarkTheme ? "#e4e4e7" : "#27272a"}
            />
          </span>
          <span className="mx-auto">Music</span>
        </button>
        <button
          className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
            selectedInnerTab == "Finance & Economics"
              ? "bg-zinc-400 dark:bg-zinc-500"
              : "hover:bg-zinc-600 dark:hover:bg-zinc-700"
          }`}
          onClick={() => setSelectedInnerTab("Finance & Economics")}
        >
          <span className="my-auto">
            <ArrowTrend
              height={24}
              width={24}
              color={isDarkTheme ? "#e4e4e7" : "#27272a"}
            />
          </span>
          <span className="mx-auto">Finance & Economics</span>
        </button>
      </div>
    );
  } else if (currentTab == "server") {
    return (
      <div>
        <div className="fixed h-screen w-52 border-r border-l border-zinc-700 bg-zinc-500 dark:border-zinc-500 dark:bg-zinc-800">
          <button
            className="justify-left flex pl-4 pt-4 text-xl font-bold"
            onClick={() => {
              props.setSelectedChannel(null);
            }}
          >
            {selectedInnerTab}
          </button>
          <div className="p-4">
            {/* if user is owner or admin  */}
            <button className="logoSpinner ">
              <SettingsIcon
                height={24}
                width={24}
                stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                strokeWidth={1}
              />
            </button>
            {/* end */}
            <div>
              <div>
                {thisServer?.channels.map((channel) => (
                  <div className="my-2" key={channel.id}>
                    <button
                      onClick={() => {
                        props.setSelectedChannel(channel);
                      }}
                      className={`flex h-12 w-full rounded-md border border-zinc-300 bg-zinc-100 px-4 hover:bg-zinc-200 active:bg-zinc-300 ${
                        selectedChannel?.id == channel.id
                          ? "dark:border-purple-600"
                          : "border-zinc-300 dark:border-zinc-600"
                      } dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-700`}
                    >
                      {channel.type == "voice" ? (
                        <span className="my-auto">
                          <HeadphonesIcon
                            height={24}
                            width={24}
                            color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                          />
                        </span>
                      ) : (
                        <span className="my-auto">
                          <CommentsIcon
                            height={24}
                            width={24}
                            strokeWidth={0.5}
                            color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                          />
                        </span>
                      )}
                      <div className="my-auto ml-4">{channel.name}</div>
                    </button>
                  </div>
                ))}

                <button
                  onClick={createChannelToggle}
                  className="flex underline-offset-2 hover:underline"
                  ref={createChannelButtonRef}
                >
                  <div>Create Channel</div>
                  <div className="my-auto">
                    <AddIcon
                      height={16}
                      width={16}
                      stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                      strokeWidth={2}
                    />
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
                <AddIcon
                  height={16}
                  width={16}
                  stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                  strokeWidth={2}
                />
              </span>
            </button>
            <button
              className="flex underline-offset-2 hover:underline"
              onClick={leaveServerAlert}
              ref={inviteModalButtonRef}
            >
              <div>Leave Server</div>
              <span className="my-auto"></span>
            </button>
          </div>
        </div>
        {inviteModalShowing ? (
          <InviteModal
            isDarkTheme={isDarkTheme}
            inviteModalToggle={inviteModalToggle}
            selectedInnerTabID={selectedInnerTabID}
            selectedInnerTab={selectedInnerTab}
            inviteModalRef={inviteModalRef}
          />
        ) : null}
        {createChannelModalShowing ? (
          <CreateChannelModal
            refreshUserServers={props.refreshUserServers}
            isDarkTheme={isDarkTheme}
            createChannelToggle={createChannelToggle}
            selectedInnerTabID={selectedInnerTabID}
            createChannelRef={createChannelRef}
          />
        ) : null}
      </div>
    );
  } else {
    return <></>;
  }
};

export default InnerNav;
