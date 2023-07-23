import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/home/Footer";
import LightLogo from "@/public/Logo - light.png";
import DarkLogo from "@/public/Logo - dark.png";
import DownloadButton from "@/src/components/home/DownloadButton";
import { useContext, useRef, useState } from "react";
import Head from "next/head";
import Parallax from "@/src/components/home/Parallax";
import Parallax_2 from "@/src/components/home/Parallax_2";
import ThemeContext from "../components/ThemeContextProvider";
import ModalsForSmallScreens from "../components/home/ModalsForSmallScreens";
import StageBanner from "../components/StageBanner";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoginModal from "../components/loginModal";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const switchRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const [showingLoginModal, setShowingLoginModal] = useState<boolean>(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const dependantToggleLogin = () => {
    if (status !== "authenticated") {
      setShowingLoginModal(true);
    }
  };

  function loginToggle() {
    setShowingLoginModal(!showingLoginModal);
  }

  return (
    <div className="bannerBGColor w-screen">
      {showingLoginModal ? <LoginModal onClose={loginToggle} loginRef={loginRef} tooltipRef={tooltipRef} /> : null}
      <div className={isDarkTheme ? "bgColorGradient" : "bgColorGradientLight"} id="body">
        <div id="bottomGradient" className={`${isDarkTheme ? "bottomGradient" : "bottomGradientLight"}`}>
          <Head>
            <title>Weave</title>
            <meta name="description" content="Weave Home | Powerful Group-Chatting Service" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta
              name="keywords"
              content="group chat, productivity, web app, team collaboration, real-time messaging, messaging app, online communication, chat app"
            />
          </Head>
          <StageBanner isDarkTheme={isDarkTheme} />
          <Navbar switchRef={switchRef} />
          <div id="main" className={`${inter.className} stopIT`}>
            <div className={`${isDarkTheme ? "topGradient" : "topGradientLight"}`}>
              <div className="hidden pt-24 md:block">
                <Parallax_2 isDarkTheme={isDarkTheme} />
              </div>
              <div className="relative z-0 flex justify-center pt-28">
                <div className="slow-spin absolute z-0 mt-24">
                  <Image src={isDarkTheme ? DarkLogo : LightLogo} alt="logo" width={240} height={240} className="z-0" />
                </div>
              </div>
              <h1 className="relative z-10 mt-44 bg-zinc-100 bg-opacity-30 text-center text-5xl font-semibold tracking-widest text-zinc-800 backdrop-blur-[5px] dark:text-zinc-300">
                Group Hangouts.
                <br /> Encrypted
              </h1>
              <div className="-z-10 flex justify-center pb-4 pt-24">
                <Button shadow color="gradient" auto size={"lg"} onClick={dependantToggleLogin} className="z-0">
                  {status == "authenticated" ? (
                    <Link href={"/app"} className="text-[#E2E2E2]">
                      Web App
                    </Link>
                  ) : (
                    "Web App"
                  )}
                </Button>
              </div>
              <div className="-z-10 flex justify-center pb-24">
                <DownloadButton />
              </div>
              <div className="px-8 pt-8 text-center tracking-widest text-zinc-800 dark:text-zinc-300">
                <h2 className="text-4xl">For work, gaming or just chatting.</h2>
                <h4 className="text-md">
                  For each use case Weave provides seamless features to focus on what matters.
                </h4>
                <span className="text-2xl">Text or voice,</span>
                <br />
                <span className="text-lg">everything is end-to-end encrypted</span>
              </div>
            </div>
            <div className="hidden md:block">
              <Parallax />
            </div>
            <div className="hidden sm:block md:hidden">
              <ModalsForSmallScreens />
            </div>
          </div>
          <div className="z-0 mx-4 h-screen rounded-lg bg-[url('/app-preview-mobile.jpg')] bg-contain bg-center bg-no-repeat sm:mb-0 sm:bg-cover md:mx-12 md:my-36 md:bg-[url('/app-preview.jpg')] lg:mx-24 lg:rounded-3xl xl:mx-36"></div>
          <div className="mx-12 mb-4 border-b border-zinc-800 dark:border-zinc-300 md:mt-12" />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
