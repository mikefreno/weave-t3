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
import ServerMainScreen from "@/src/components/app/SeverMainScreen";
import ChannelMain from "@/src/components/app/ChannelMain";
import { Server_Channel } from "@prisma/client";

const index = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const [serverModalShowing, setServerModalShowing] = useState(false);
  const [botModalShowing, setBotModalShowing] = useState(false);
  const { data: session, status } = useSession();
  const [microphoneState, setMicrophoneState] = useState(false);
  const [audioState, setAudioState] = useState(true);
  const [currentTab, setCurrentTab] = useState("DMS");
  const [selectedInnerTab, setSelectedInnerTab] = useState("");
  const [selectedInnerTabID, setSelectedInnerTabID] = useState<number>(0);
  const [direcMessageModalShowing, setDirecMessageModalShowing] =
    useState(false);

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

  const currentUser = api.users.getCurrentUser.useQuery().data;

  const usersServers = api.server.getAllCurrentUserServers.useQuery();

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, []);

  useOnClickOutside([directMessageModalRef, directMessageButtonRef], () => {
    setDirecMessageModalShowing(false);
  });

  useOnClickOutside([serverModalRef, serverButtonRef], () => {
    setServerModalShowing(false);
  });

  function dmModalToggle() {
    setDirecMessageModalShowing(!direcMessageModalShowing);
  }

  function currentTabSetter(id: string) {
    setCurrentTab(id);
  }

  useEffect(() => {
    document.getElementById("html")?.classList.add("scollDisabled");
    document
      .getElementById("body")
      ?.setAttribute("class", "bg-zinc-300 dark:bg-zinc-700");
  }, []);

  useEffect(() => {
    if (serverModalShowing || botModalShowing || direcMessageModalShowing) {
      document.getElementById("app-body")?.classList.add("modal-open");
    } else {
      document.getElementById("app-body")?.classList.remove("modal-open");
    }
  }, [serverModalShowing, botModalShowing, direcMessageModalShowing]);

  useEffect(() => {
    const storedValue = localStorage.getItem("microphoneState");
    if (storedValue === "true") {
      setMicrophoneState(true);
    }
  }, []);

  const microphoneToggle = () => {
    localStorage.setItem("microphoneState", (!microphoneState).toString());
    setMicrophoneState(!microphoneState);
  };
  useEffect(() => {
    const storedValue = localStorage.getItem("audioState");
    if (storedValue === "false") {
      setAudioState(false);
    }
  }, []);

  const audioToggle = () => {
    localStorage.setItem("audioState", (!audioState).toString());
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
  const refreshUserData = async () => {
    await usersServers.refetch();
  };

  return (
    <div className="bg-zinc-300 dark:bg-zinc-700">
      <Head>
        <title> Web App | Weave</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar switchRef={switchRef} />
      <div id="app-body" className="flex h-screen w-screen">
        <div id="outer-nav" className="w-20">
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
          />
        </div>
        <div id="inner-nav" className="w-52">
          <InnerNav
            refreshUserData={refreshUserData}
            currentTab={currentTab}
            directMessageButtonRef={directMessageButtonRef}
            dmModalToggle={dmModalToggle}
            selectedInnerTab={selectedInnerTab}
            setSelectedInnerTab={setSelectedInnerTab}
            currentUser={currentUser}
            selectedInnerTabID={selectedInnerTabID}
            usersServers={usersServers?.data}
            setSelectedChannel={setSelectedChannel}
            selectedChannel={selectedChannel}
          />
          <InnerNavOverlay
            setSelectedInnerTab={setSelectedInnerTab}
            currentUser={currentUser}
            microphoneState={microphoneState}
            microphoneToggle={microphoneToggle}
            audioState={audioState}
            audioToggle={audioToggle}
          />
        </div>
        <div id="center-page" ref={scrollableRef} className="flex-1">
          {selectedInnerTab === "AccountOverview" ? <AccountPage /> : null}

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
              <PublicServersPages selectedInnerTab={selectedInnerTab} />
            </div>
          ) : null}
          {currentTab === "server" && usersServers ? (
            selectedChannel !== null ? (
              <ChannelMain selectedChannel={selectedChannel} />
            ) : (
              <ServerMainScreen
                usersServers={usersServers?.data}
                selectedInnerTabID={selectedInnerTabID}
              />
            )
          ) : null}
        </div>
      </div>
      <div>
        {serverModalShowing ? (
          <CreateServerModal
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
        {direcMessageModalShowing ? (
          <DirectMessageModal directMessageModalRef={directMessageModalRef} />
        ) : null}
      </div>
    </div>
  );
};

export default index;
