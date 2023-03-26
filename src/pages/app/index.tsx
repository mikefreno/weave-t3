import React, { useContext, useEffect, useRef, useState } from "react";
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
import InnerNavOverlay from "@/src/components/app/InnerNavOverlay";
import AccountPage from "@/src/components/app/AccountPage";
import { useSession } from "next-auth/react";
import { api } from "@/src/utils/api";
import LoadingElement from "@/src/components/loading";
import router from "next/router";
import ServerMainScreen from "@/src/components/app/ServerMainScreen";
import ChannelMain from "@/src/components/app/ChatChannel";
import {
  Server,
  Server_Admin,
  Server_Channel,
  Server_Member,
  User,
} from "@prisma/client";
import LoadingOverlay from "@/src/components/app/LoadingOverlay";
import VoiceChannel from "@/src/components/app/VoiceChannel";
import DoubleChevrons from "@/src/icons/DoubleChevrons";

const App = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const [serverModalShowing, setServerModalShowing] = useState(false);
  const [botModalShowing, setBotModalShowing] = useState(false);
  const { data: session, status } = useSession();
  const [microphoneState, setMicrophoneState] = useState(false);
  const [audioState, setAudioState] = useState(true);
  const [currentTab, setCurrentTab] = useState("DMS");
  const [selectedInnerTab, setSelectedInnerTab] = useState("AccountOverview");
  const [selectedInnerTabID, setSelectedInnerTabID] = useState<number>(0);
  const [directMessageModalShowing, setDirectMessageModalShowing] =
    useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());

  const switchRef = useRef<HTMLDivElement>(null);
  const serverModalRef = useRef<HTMLDivElement>(null);

  const serverButtonRef = useRef<HTMLButtonElement>(null);
  const botModalRef = useRef<HTMLDivElement>(null);
  const botButtonRef = useRef<HTMLButtonElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const directMessageButtonRef = useRef<HTMLButtonElement>(null);
  const directMessageModalRef = useRef<HTMLDivElement>(null);
  const [selectedChannel, setSelectedChannel] = useState<Server_Channel | null>(
    null
  );
  const [loadingOverlayShowing, setLoadingOverlayShowing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [source, setSource] = useState<MediaStreamAudioSourceNode | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const currentUserReturn = api.users.getCurrentUser.useQuery();
  const [currentUser, setCurrentUser] = useState<
    User & {
      servers: Server[];
      memberships: Server_Member[];
      adminships: Server_Admin[];
    }
  >();

  const usersServers = api.server.getAllCurrentUserServers.useQuery();

  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(
      "wss://ho6sto5l50.execute-api.us-east-1.amazonaws.com/prod"
    );
    socket.onopen = () => {
      console.log("Socket opened");
    };
    setSocket(socket);

    return () => {
      socket?.close();
    };
  }, []);

  useEffect(() => {
    setCurrentUser(currentUserReturn.data!);
  }, [currentUserReturn]);

  const triggerUserRefresh = async () => {
    await currentUserReturn.refetch();
  };

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, []);

  useOnClickOutside([directMessageModalRef, directMessageButtonRef], () => {
    setDirectMessageModalShowing(false);
  });

  useOnClickOutside([serverModalRef, serverButtonRef], () => {
    setServerModalShowing(false);
  });

  function dmModalToggle() {
    setDirectMessageModalShowing(!directMessageModalShowing);
  }

  function currentTabSetter(id: string) {
    setCurrentTab(id);
  }
  const loadingOverlaySetter = (boolean: boolean) => {
    setLoadingOverlayShowing(boolean);
  };
  const serverRefetch = () => {
    usersServers.refetch();
  };
  useEffect(() => {
    document.getElementById("html")?.classList.add("scrollDisabled");
    document
      .getElementById("body")
      ?.setAttribute("class", "bg-zinc-300 dark:bg-zinc-700");
  }, []);

  useEffect(() => {
    if (serverModalShowing || botModalShowing || directMessageModalShowing) {
      document.getElementById("app-body")?.classList.add("modal-open");
    } else {
      document.getElementById("app-body")?.classList.remove("modal-open");
    }
  }, [serverModalShowing, botModalShowing, directMessageModalShowing]);

  // useEffect(() => {
  //   const storedValue = localStorage.getItem("microphoneState");
  //   if (storedValue === "true") {
  //     setMicrophoneState(true);
  //   }
  // }, []);

  const microphoneToggle = async () => {
    if (microphoneState) {
      turnOffMicrophone();
      setMicrophoneState(false);
    } else {
      const res = await requestMicrophoneAccess();
      if (res) {
        setMicrophoneState(true);
      }
    }
  };

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(stream);
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      return true;
    } catch (err) {
      console.error("Error accessing microphone:", err);
      return false;
    }
  };

  useEffect(() => {
    loadAudioWorklet();
  }, []);

  const loadAudioWorklet = async () => {
    console.log("start worklet attempt");
    if (window.AudioWorklet) {
      const audioContext = new AudioContext();
      await audioContext.audioWorklet.addModule("/audio-processor.js");
      console.log("worklet started");
      setAudioContext(audioContext);
    }
  };

  const turnOffMicrophone = () => {
    if (stream) {
      // Stop all tracks in the MediaStream
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  useEffect(() => {
    return () => {
      document.getElementById("html")?.classList.remove("scrollDisabled");
    };
  }, []);

  const audioToggle = () => {
    // localStorage.setItem("audioState", (!audioState).toString());
    setAudioState(!audioState);
  };

  useOnClickOutside([botModalRef, botButtonRef, switchRef], () =>
    setBotModalShowing(false)
  );

  function serverModalToggle() {
    setServerModalShowing(!serverModalShowing);
  }

  function botModalToggle() {
    setBotModalShowing(!botModalShowing);
  }
  if (currentUser === undefined || currentUser === null) {
    setTimeout(() => {
      if (status == "unauthenticated") {
        router.push("/login");
      }
    }, 1000);
    return <LoadingElement isDarkTheme={isDarkTheme} />;
  }
  const refreshUserServers = async () => {
    await usersServers.refetch();
  };

  const fullscreenToggle = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-700">
      <Head>
        <title> Web App | Weave</title>
        <meta name="description" content="Weave's Web App" />
      </Head>
      <Navbar
        switchRef={switchRef}
        currentTabSetter={currentTabSetter}
        setSelectedInnerTab={setSelectedInnerTab}
      />
      <div id="app-body" className="flex h-screen w-screen">
        <div
          className={`${
            fullscreen ? "-translate-x-72" : ""
          } transform transition-all duration-500 ease-in-out`}
        >
          <div id="outer-nav" className="flex">
            <SideNav
              setSelectedChannel={setSelectedChannel}
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
            />
          </div>
          <div id="inner-nav" className="ml-20">
            <InnerNav
              botModalToggle={botModalToggle}
              botButtonRef={botButtonRef}
              serverModalToggle={serverModalToggle}
              serverButtonRef={serverButtonRef}
              currentTabSetter={currentTabSetter}
              setSelectedInnerTab={setSelectedInnerTab}
              refreshUserServers={refreshUserServers}
              currentTab={currentTab}
              directMessageButtonRef={directMessageButtonRef}
              dmModalToggle={dmModalToggle}
              selectedInnerTab={selectedInnerTab}
              setSelectedInnerTabID={setSelectedInnerTabID}
              currentUser={currentUser}
              selectedInnerTabID={selectedInnerTabID}
              setSelectedChannel={setSelectedChannel}
              selectedChannel={selectedChannel}
              loadingOverlaySetter={loadingOverlaySetter}
              serverRefetch={serverRefetch}
              timestamp={timestamp}
              usersServers={usersServers.data as any}
            />
            <InnerNavOverlay
              setSelectedInnerTab={setSelectedInnerTab}
              currentUser={currentUser}
              microphoneState={microphoneState}
              microphoneToggle={microphoneToggle}
              audioState={audioState}
              audioToggle={audioToggle}
              currentTabSetter={currentTabSetter}
              timestamp={timestamp}
            />
          </div>
        </div>
        <div
          className={`absolute z-[100] mt-14 transform transition-all duration-500 ease-in-out ${
            fullscreen ? "ml-0" : "ml-44 md:ml-72"
          }`}
        >
          <button onClick={fullscreenToggle}>
            {fullscreen ? (
              <div className="rotate-180 transform transition-all duration-500 ease-in-out">
                <DoubleChevrons
                  height={36}
                  width={36}
                  stroke={isDarkTheme ? "#fafafa" : "#18181b"}
                  strokeWidth={1}
                />
              </div>
            ) : (
              <div className="transform transition-all duration-300 ease-in-out">
                <DoubleChevrons
                  height={36}
                  width={36}
                  stroke={isDarkTheme ? "#fafafa" : "#18181b"}
                  strokeWidth={1}
                />
              </div>
            )}
          </button>
        </div>
        <div
          id="center-page"
          ref={scrollableRef}
          className={
            !fullscreen
              ? `ml-24 flex-1 transform transition-all duration-500 ease-in-out md:ml-52`
              : "-ml-20 flex-1 transform transition-all duration-500 ease-in-out"
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
              />
            </div>
          ) : null}
          {currentTab === "server" && usersServers ? (
            selectedChannel !== null ? (
              selectedChannel.type == "text" ? (
                <ChannelMain
                  selectedChannel={selectedChannel}
                  currentUser={currentUser}
                  socket={socket as WebSocket}
                  setSocket={setSocket}
                  fullscreen={fullscreen}
                />
              ) : (
                <VoiceChannel
                  selectedChannel={selectedChannel}
                  currentUser={currentUser}
                  socket={socket as WebSocket}
                  setSocket={setSocket}
                  microphoneState={microphoneState}
                  audioState={audioState}
                  audioToggle={audioToggle}
                  microphoneToggle={microphoneToggle}
                  stream={stream}
                  audioContext={audioContext}
                  fullscreen={fullscreen}
                />
              )
            ) : (
              <ServerMainScreen
                usersServers={usersServers.data}
                selectedInnerTabID={selectedInnerTabID}
              />
            )
          ) : null}
        </div>
        {loadingOverlayShowing ? (
          <LoadingOverlay isDarkTheme={isDarkTheme} />
        ) : null}
      </div>
      <div>
        {serverModalShowing ? (
          <CreateServerModal
            refreshUserServers={refreshUserServers}
            serverModalToggle={serverModalToggle}
            serverModalRef={serverModalRef}
          />
        ) : null}
        {botModalShowing ? (
          <BotServiceModal
            botModalRef={botModalRef}
            botModalToggle={botModalToggle}
          />
        ) : null}
        {directMessageModalShowing ? (
          <DirectMessageModal directMessageModalRef={directMessageModalRef} />
        ) : null}
      </div>
    </div>
  );
};

export default App;
