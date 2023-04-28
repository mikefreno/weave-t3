import { useContext, useEffect, useRef, useState } from "react";
import Navbar from "@/src/components/Navbar";
import Head from "next/head";
import ThemeContext from "@/src/components/ThemeContextProvider";
import SideNav from "@/src/components/app/SideNav";
import CreateServerModal from "@/src/components/app/CreateServerModal";
import useOnClickOutside from "@/src/components/ClickOutsideHook";
import BotServiceModal from "@/src/components/app/BotServiceModal";
import InnerNav from "@/src/components/app/InnerNav";
import DirectMessageModal from "@/src/components/app/DirectMessageModal";
import PublicServersPages from "@/src/components/app/PublicServersPages";
import DMPages from "@/src/components/app/DMPages";
import AccountPage from "@/src/components/app/AccountPage";
import { useSession } from "next-auth/react";
import { api } from "@/src/utils/api";
import LoadingElement from "@/src/components/loading";
import router from "next/router";
import ServerMainScreen from "@/src/components/app/ServerMainScreen";
import ChatChannel from "@/src/components/app/ChatChannel";
import { Server, Server_Admin, Server_Channel, Server_Member, User } from "@prisma/client";
import LoadingOverlay from "@/src/components/app/LoadingOverlay";
import CreateChannelModal from "@/src/components/app/CreateChannelModal";
import InviteModal from "@/src/components/app/InviteModal";
import ChevronDown from "@/src/icons/ChevronDown";
import UserProfileModal from "@/src/components/app/UserProfileModal";
import { type User as MongoUser } from "@prisma/client/mongo";
import VideoChannel from "@/src/components/app/VideoChannel";
import VoiceChannel from "@/src/components/app/VoiceChannel";
import ServerSettings from "@/src/components/app/ServerSettings";
import DeleteServerConfirmation from "@/src/components/app/DeleteServerConfirmation";

const App = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const { data: session, status } = useSession();
  //state
  const [serverModalShowing, setServerModalShowing] = useState(false);
  const [botModalShowing, setBotModalShowing] = useState(false);
  const [microphoneState, setMicrophoneState] = useState(false);
  const [audioState, setAudioState] = useState(true);
  const [currentTab, setCurrentTab] = useState("DMS");
  const [selectedInnerTab, setSelectedInnerTab] = useState("AccountOverview");
  const [selectedInnerTabID, setSelectedInnerTabID] = useState<number>(0);
  const [directMessageModalShowing, setDirectMessageModalShowing] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [selectedChannel, setSelectedChannel] = useState<Server_Channel | null>(null);
  const UserProfileModalRef = useRef<HTMLDivElement>(null);
  const [searchedUser, setSearchedUser] = useState<MongoUser | null>(null);
  const [loadingOverlayShowing, setLoadingOverlayShowing] = useState(false);
  const [inviteModalShowing, setInviteModalShowing] = useState(false);
  const [createChannelModalShowing, setCreateChannelModalShowing] = useState(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<
    User & {
      servers: Server[];
      memberships: Server_Member[];
      adminships: Server_Admin[];
    }
  >();
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [privilegeLevel, setPrivilegeLevel] = useState<"admin" | "member" | "owner">();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [deletionConfirmationShowing, setDeletionConfirmationShowing] = useState<boolean>(false);
  const [ownerConfirmedDeletion, setOwnerConfirmedDeletion] = useState<boolean>(false);
  const [serverSettingsPane, setServerSettingsPane] = useState<boolean>(false);
  //refs
  const socketRef = useRef<WebSocket | null>(null);
  const switchRef = useRef<HTMLDivElement>(null);
  const serverModalRef = useRef<HTMLDivElement>(null);
  const serverButtonRef = useRef<HTMLButtonElement>(null);
  const botModalRef = useRef<HTMLDivElement>(null);
  const botButtonRef = useRef<HTMLButtonElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const directMessageButtonRef = useRef<HTMLButtonElement>(null);
  const directMessageModalRef = useRef<HTMLDivElement>(null);
  const inviteModalButtonRef = useRef<HTMLButtonElement>(null);
  const inviteModalRef = useRef<HTMLDivElement>(null);
  const createChannelButtonRef = useRef<HTMLButtonElement>(null);
  const createChannelRef = useRef<HTMLDivElement>(null);
  const deletionServerButtonRef = useRef<HTMLButtonElement>(null);
  const deleteConfirmationModalRef = useRef<HTMLDivElement>(null);

  //trpc (api) hooks
  const usersServers = api.server.getAllCurrentUserServers.useQuery();
  const currentUserReturn = api.users.getCurrentUser.useQuery();
  const currentUserServerPrivilegeMutation = api.server.getUserPrivilegeLevel.useMutation();

  //click outside hooks
  useOnClickOutside([UserProfileModalRef], () => {
    setSearchedUser(null);
  });
  useOnClickOutside([inviteModalRef, inviteModalButtonRef], () => {
    setInviteModalShowing(false);
  });
  useOnClickOutside([createChannelRef, createChannelButtonRef], () => {
    setCreateChannelModalShowing(false);
  });

  useOnClickOutside([directMessageModalRef, directMessageButtonRef], () => {
    setDirectMessageModalShowing(false);
  });

  useOnClickOutside([serverModalRef, serverButtonRef], () => {
    setServerModalShowing(false);
  });
  useOnClickOutside([botModalRef, botButtonRef, switchRef], () => setBotModalShowing(false));
  useOnClickOutside([deletionServerButtonRef, deleteConfirmationModalRef], () => {
    setDeletionConfirmationShowing(false);
  });

  //socket management
  useEffect(() => {
    if (!socketRef.current) {
      const newSocket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET as string);
      socketRef.current = newSocket;
      setSocket(newSocket);
    }
    if (socket) {
      socket.onopen = () => {
        console.log("Socket opened");
      };
      socket.onclose = () => {
        if (socket?.readyState !== WebSocket.OPEN) {
          socketRef.current = null;
          setSocket(null);
        }
      };

      return () => {
        socket?.close();
      };
    }
  }, [socket]);

  const socketUserUpdate = () => {
    socket?.send(
      JSON.stringify({
        senderID: currentUser?.id,
        updateType: "user",
      })
    );
  };

  const socketChannelUpdate = async () => {
    socket?.send(
      JSON.stringify({
        senderID: currentUser?.id,
        channelID: selectedChannel?.id,
        updateType: "channel",
      })
    );
  };

  useEffect(() => {
    if (currentUserReturn.data) {
      setCurrentUser(currentUserReturn.data);
    }
  }, [currentUserReturn]);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN && currentUser) {
      if (selectedChannel) {
        socketChannelUpdate();
      } else {
        socketUserUpdate();
      }
    }
  }, [socket, currentUser]);

  useEffect(() => {
    socketChannelUpdate();
  }, [selectedChannel]);

  //other useEffects
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    document.getElementById("html")?.classList.add("scrollDisabled");
  }, []);

  useEffect(() => {
    if (serverModalShowing || botModalShowing || directMessageModalShowing) {
      document.getElementById("app-body")?.classList.add("modal-open");
    } else {
      document.getElementById("app-body")?.classList.remove("modal-open");
    }
  }, [serverModalShowing, botModalShowing, directMessageModalShowing]);

  useEffect(() => {
    return () => {
      document.getElementById("html")?.classList.remove("scrollDisabled");
    };
  }, []);

  useEffect(() => {
    privilegeSetter();
  }, [selectedServer]);

  //refreshers
  const refreshUserServers = async () => {
    await usersServers.refetch();
  };
  const serverRefetch = async () => {
    await usersServers.refetch();
  };
  const triggerUserRefresh = async () => {
    await currentUserReturn.refetch();
  };

  //toggles
  const fullscreenToggle = () => {
    setFullscreen(!fullscreen);
  };
  const userProfileModalToggle = () => {
    setSearchedUser(null);
  };
  const inviteModalToggle = () => {
    setInviteModalShowing(!inviteModalShowing);
  };
  const createChannelToggle = () => {
    setCreateChannelModalShowing(!createChannelModalShowing);
  };
  const serverModalToggle = () => {
    setServerModalShowing(!serverModalShowing);
  };

  const botModalToggle = () => {
    setBotModalShowing(!botModalShowing);
  };
  function dmModalToggle() {
    setDirectMessageModalShowing(!directMessageModalShowing);
  }
  const audioToggle = () => {
    setAudioState(!audioState);
  };
  const microphoneToggle = async () => {
    setMicrophoneState(!microphoneState);
  };
  const serverDeletionToggle = async () => {
    setDeletionConfirmationShowing(!deletionConfirmationShowing);
  };
  const serverSettingsToggle = () => {
    setServerSettingsPane(!serverSettingsPane);
  };

  //setters
  const serverSetter = async (server: Server) => {
    setSelectedServer(server);
  };
  const channelSetter = (input: Server_Channel | null) => {
    setSelectedChannel(input);
  };
  const innerTabSetter = (input: string) => {
    setSelectedInnerTab(input);
  };
  const privilegeSetter = async () => {
    if (selectedServer) {
      const thisPrivilegeLevel = await currentUserServerPrivilegeMutation.mutateAsync(selectedServer.id);
      setPrivilegeLevel(thisPrivilegeLevel);
    }
  };
  const userSelect = (user: MongoUser) => {
    setSearchedUser(user);
  };
  function currentTabSetter(id: string) {
    setCurrentTab(id);
  }
  const loadingOverlaySetter = (boolean: boolean) => {
    setLoadingOverlayShowing(boolean);
  };
  //cron triggers
  const startDeletionCountdown = async () => {};
  //auth check
  if (currentUser === undefined || currentUser === null) {
    setTimeout(() => {
      if (status == "unauthenticated") {
        router.push("/login/redirect");
      }
    }, 1000);
    return <LoadingElement isDarkTheme={isDarkTheme} />;
  }

  return (
    <div className="select-none bg-zinc-100 dark:bg-zinc-700">
      <Head>
        <title> Web App | Weave</title>
        <meta name="description" content="Weave's Web App" />
      </Head>
      <Navbar switchRef={switchRef} currentTabSetter={currentTabSetter} setSelectedInnerTab={setSelectedInnerTab} />
      <div id="app-body" className={`flex h-screen w-screen`}>
        <div className={`${fullscreen ? "-translate-x-72" : ""} transform transition-all duration-500 ease-in-out`}>
          <div id="outer-nav" className="flex">
            <SideNav
              channelSetter={channelSetter}
              serverModalToggle={serverModalToggle}
              serverButtonRef={serverButtonRef}
              botModalToggle={botModalToggle}
              botButtonRef={botButtonRef}
              currentTab={currentTab}
              currentTabSetter={currentTabSetter}
              setSelectedInnerTab={setSelectedInnerTab}
              currentUser={currentUser}
              setSelectedInnerTabID={setSelectedInnerTabID}
              usersServers={usersServers.data}
              selectedInnerTabID={selectedInnerTabID}
              timestamp={timestamp}
              serverSetter={serverSetter}
            />
          </div>
          <div id="inner-nav" className="md:ml-20">
            <InnerNav
              serverSetter={serverSetter}
              botModalToggle={botModalToggle}
              botButtonRef={botButtonRef}
              serverModalToggle={serverModalToggle}
              serverButtonRef={serverButtonRef}
              currentTabSetter={currentTabSetter}
              innerTabSetter={innerTabSetter}
              refreshUserServers={refreshUserServers}
              currentTab={currentTab}
              directMessageButtonRef={directMessageButtonRef}
              dmModalToggle={dmModalToggle}
              selectedInnerTab={selectedInnerTab}
              setSelectedInnerTabID={setSelectedInnerTabID}
              currentUser={currentUser}
              selectedInnerTabID={selectedInnerTabID}
              channelSetter={channelSetter}
              selectedChannel={selectedChannel}
              loadingOverlaySetter={loadingOverlaySetter}
              serverRefetch={serverRefetch}
              timestamp={timestamp}
              usersServers={usersServers.data as any}
              socket={socket}
              createChannelToggle={createChannelToggle}
              createChannelButtonRef={createChannelButtonRef}
              inviteModalToggle={inviteModalToggle}
              inviteModalButtonRef={inviteModalButtonRef}
              userSelect={userSelect}
              microphoneState={microphoneState}
              microphoneToggle={microphoneToggle}
              audioState={audioState}
              audioToggle={audioToggle}
              serverSettingsToggle={serverSettingsToggle}
            />
          </div>
        </div>
        <div
          className={`fixed bottom-20 z-[100] transform transition-all duration-700 ease-in-out ${
            selectedChannel?.type === "video" ? "" : "md:hidden"
          } ${fullscreen ? "-ml-2" : "ml-40 pl-2 md:ml-64 md:pl-6"}`}
        >
          <button onClick={fullscreenToggle}>
            {fullscreen ? (
              <div className="-rotate-90 transform transition-all duration-500 ease-in-out">
                <ChevronDown height={44} width={44} stroke={isDarkTheme ? "#fafafa" : "#18181b"} strokeWidth={1} />
              </div>
            ) : (
              <div className="rotate-90 transform transition-all duration-300 ease-in-out">
                <ChevronDown height={44} width={44} stroke={isDarkTheme ? "#fafafa" : "#18181b"} strokeWidth={1} />
              </div>
            )}
          </button>
        </div>
        <div
          id="center-page"
          ref={scrollableRef}
          className={
            !fullscreen
              ? `ml-44 flex-1 transform transition-all duration-500 ease-in-out md:ml-52`
              : "flex-1 transform transition-all duration-500 ease-in-out md:-ml-20"
          }
        >
          {selectedInnerTab === "AccountOverview" ? (
            <AccountPage
              triggerUserRefresh={triggerUserRefresh}
              currentUser={currentUser}
              setTimestamp={setTimestamp}
              timestamp={timestamp}
            />
          ) : null}

          {currentTab == "DMS" && selectedInnerTab !== "AccountOverview" ? (
            <div className="">
              <DMPages selectedInnerTab={selectedInnerTab} />
            </div>
          ) : null}
          {currentTab === "PublicServers" &&
          (selectedInnerTab === "Finance & Economics" ||
            selectedInnerTab === "Music" ||
            selectedInnerTab === "Entertainment" ||
            selectedInnerTab === "Gaming" ||
            selectedInnerTab === "Education" ||
            selectedInnerTab === "Science & Technology" ||
            selectedInnerTab === "Made By Weave") ? (
            <div className="">
              <PublicServersPages
                selectedInnerTab={selectedInnerTab}
                refreshUserServers={refreshUserServers}
                fullscreen={fullscreen}
              />
            </div>
          ) : null}
          {currentTab === "server" && usersServers ? (
            selectedChannel !== null ? (
              selectedChannel.type === "text" ? (
                <ChatChannel
                  selectedChannel={selectedChannel}
                  currentUser={currentUser}
                  socket={socket}
                  fullscreen={fullscreen}
                />
              ) : selectedChannel.type === "video" ? (
                <VideoChannel
                  selectedChannel={selectedChannel}
                  currentUser={currentUser}
                  socket={socket}
                  microphoneState={microphoneState}
                  audioState={audioState}
                  audioToggle={audioToggle}
                  microphoneToggle={microphoneToggle}
                  fullscreen={fullscreen}
                  socketChannelUpdate={socketChannelUpdate}
                />
              ) : selectedChannel.type === "voice" ? (
                <VoiceChannel
                  selectedChannel={selectedChannel}
                  currentUser={currentUser}
                  socket={socket}
                  microphoneState={microphoneState}
                  audioState={audioState}
                  audioToggle={audioToggle}
                  microphoneToggle={microphoneToggle}
                  fullscreen={fullscreen}
                  socketChannelUpdate={socketChannelUpdate}
                />
              ) : null
            ) : serverSettingsPane ? (
              <ServerSettings
                privilegeLevel={privilegeLevel}
                server={selectedServer}
                deletionServerButtonRef={deletionServerButtonRef}
                serverDeletionToggle={serverDeletionToggle}
              />
            ) : (
              <ServerMainScreen
                usersServers={usersServers.data}
                selectedInnerTabID={selectedInnerTabID}
                selectedServer={selectedServer}
              />
            )
          ) : null}
        </div>
        {loadingOverlayShowing ? <LoadingOverlay isDarkTheme={isDarkTheme} /> : null}
      </div>
      <div>
        {serverModalShowing ? (
          <CreateServerModal
            refreshUserServers={refreshUserServers}
            serverModalToggle={serverModalToggle}
            serverModalRef={serverModalRef}
          />
        ) : null}
        {botModalShowing ? <BotServiceModal botModalRef={botModalRef} botModalToggle={botModalToggle} /> : null}
        {directMessageModalShowing ? <DirectMessageModal directMessageModalRef={directMessageModalRef} /> : null}
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
            refreshUserServers={refreshUserServers}
            isDarkTheme={isDarkTheme}
            createChannelToggle={createChannelToggle}
            selectedInnerTabID={selectedInnerTabID}
            createChannelRef={createChannelRef}
          />
        ) : null}
        {searchedUser ? (
          <UserProfileModal
            userProfileModalToggle={userProfileModalToggle}
            user={searchedUser}
            UserProfileModalRef={UserProfileModalRef}
          />
        ) : null}
        {deletionConfirmationShowing ? (
          <div>
            <DeleteServerConfirmation
              setOwnerConfirmedDeletion={setOwnerConfirmedDeletion}
              deleteConfirmationModalRef={deleteConfirmationModalRef}
              serverDeletionToggle={serverDeletionToggle}
              serverName={selectedServer?.name}
              serverId={selectedServer?.id}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;
