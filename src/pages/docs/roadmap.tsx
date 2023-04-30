import Footer from "@/src/components/home/Footer";
import Navbar from "@/src/components/Navbar";
import ThemeContext from "@/src/components/ThemeContextProvider";
import DoubleChevrons from "@/src/icons/DoubleChevrons";
import Head from "next/head";
import React, { useContext, useEffect, useRef, useState } from "react";

const RoadMap = () => {
  const { isDarkTheme } = useContext(ThemeContext);

  const [showingAside, setShowingAside] = useState(true);
  const switchRef = useRef<HTMLDivElement>(null);

  const toggleNav = () => {
    setShowingAside(!showingAside);
  };

  useEffect(() => {
    const handleClick = (e: any) => {
      e.preventDefault();
      document.querySelector(e.target.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener("click", handleClick);
    });

    return () => {
      anchors.forEach((anchor) => {
        anchor.removeEventListener("click", handleClick);
      });
    };
  }, []);

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900">
      <Head>
        <title>Roadmap | Weave</title>
        <meta name="description" content="Weave's Roadmap" />
      </Head>
      <Navbar switchRef={switchRef} />
      <div className="container pt-20">
        <aside
          id="side"
          className={`${
            showingAside
              ? "fixed h-screen w-[30vw] transform flex-col border-r border-zinc-900 pt-2 transition-all duration-700 ease-in-out dark:border-zinc-200 md:w-[20vw] md:px-4 xl:w-[15vw]"
              : "fixed h-screen w-[30vw] -translate-x-full transform flex-col border-r border-zinc-900 pt-2 transition-all duration-700 ease-in-out dark:border-zinc-200 md:w-[20vw] md:px-4 xl:w-[15vw]"
          } `}
        >
          <div className="pl-2 text-xl font-semibold underline underline-offset-4">
            <a href="#top" className="cursor-pointer text-zinc-900 dark:text-zinc-100">
              Roadmap Overview
            </a>
          </div>
          <ul>
            <li className="hvr-move-right">
              <a
                href="#core"
                className="cursor-pointer text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                Core Features
              </a>
            </li>
            <li className="hvr-move-right">
              <a
                href="#UI"
                className="cursor-pointer text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                User Interface
              </a>
            </li>
            <li className="hvr-move-right">
              <a
                href="#useraccount"
                className="cursor-pointer text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                User / Account
              </a>
            </li>
            <li className="hvr-move-right">
              <a
                href="#server"
                className="cursor-pointer text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                Servers
              </a>
            </li>
            <li className="hvr-move-right">
              <a
                href="#bots"
                className="cursor-pointer text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                Bots
              </a>
            </li>
            <li className="hvr-move-right">
              <a
                href="#bots"
                className="cursor-pointer text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                Misc
              </a>
            </li>
          </ul>
        </aside>
        <div
          className={
            showingAside
              ? "fixed w-[30vw] translate-x-full transform transition-all duration-500 ease-in-out md:w-[20vw] xl:w-[15vw]"
              : "fixed w-[30vw] transition-all duration-500 ease-in-out md:w-[20vw] xl:w-[15vw]"
          }
        >
          <button
            className={
              showingAside
                ? "transform transition-all duration-500 ease-in-out"
                : "rotate-180 transform transition-all duration-500 ease-in-out"
            }
            onClick={toggleNav}
          >
            <DoubleChevrons height={36} width={36} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1} />
          </button>
        </div>
        <div id="top" className="absolute -mt-20" />
        <div
          id="content"
          className={`${
            showingAside ? "ml-[30vw] md:ml-[20vw] xl:ml-[15vw]" : null
          } scrollXDisabled transition-margin overflow-y-scroll px-6 text-zinc-900 duration-300 ease-in-out dark:text-zinc-100 md:px-10 lg:px-16`}
        >
          <div className="pt-16">
            <div className="text-3xl font-semibold tracking-wider">Weave Roadmap</div>
            <p className="pt-12 tracking-wide">
              This page is to outline the vision and progress of Weave. Broken down into the sections on the right, this
              roadmap will go over the various features planned and in development. Each feature will be labeled in the
              following way:{" "}
            </p>
            <ul className="">
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>
                <div className="pl-2"> indicates the feature is launched</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">indicates the feature is in active development</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-transparent pt-1"></div>{" "}
                <div className="pl-2">indicates the feature is planned</div>
              </li>
            </ul>
            <p className="pt-2 tracking-wide">
              Everything is subject to change, feature that are launched may be unlaunched, and features in development
              may be axed at any given time. Feel free to reach out on the github repo at{" "}
              <a href="https://github.com/MikeFreno/weave-t3" className="hover:underline">
                https://github.com/MikeFreno/weave-t3{" "}
              </a>{" "}
              or by email at <span className="underline underline-offset-2">michael@freno.me</span>
            </p>
          </div>
          <div id="core" className="absolute -mt-20"></div>
          <div className="pt-16">
            <div className="text-2xl font-semibold tracking-wider">Core Features</div>
            <p className="pt-12 tracking-wide">The main feature of the app.</p>
            <ul className="">
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>
                <div className="pl-2">Chat Channels</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>
                <div className="pl-2">Voice Channels</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>
                <div className="pl-2">Video Channels</div>
              </li>
            </ul>
          </div>
          <div id="UI" className="absolute -mt-20"></div>
          <div className="pt-16">
            <div className="text-2xl font-semibold tracking-wider">User Interface</div>
            <p className="pt-12 tracking-wide">
              These features are mainly in reference to the way the app looks, and the way that you as a user interact
              with it
            </p>
            <ul className="">
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>{" "}
                <div className="pl-2">Mobile experience improvements to web app</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>{" "}
                <div className="pl-2">Mobile experience improvements to front-page</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-transparent pt-1"></div>{" "}
                <div className="pl-2">
                  Accessibility improvements (catch all for blindness, color blindness support, font-size changes, etc.)
                </div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Real name vs Pseudonym Preference</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Real name usage alerts</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-transparent pt-1"></div>{" "}
                <div className="pl-2">Availability indicators on user icon</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Show user on comment icon click/hover</div>
              </li>
            </ul>
          </div>
          <div id="useraccount" className="absolute -mt-20"></div>
          <div className="pt-16">
            <div className="text-2xl font-semibold tracking-wider">User / Account</div>
            <p className="pt-12 tracking-wide">These features regard your control over your account</p>
            <ul className="">
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>{" "}
                <div className="pl-2">Getting Google authentication enabled</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>{" "}
                <div className="pl-2">Multiple auth methods for one account, such as Email, and Google</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>{" "}
                <div className="pl-2">Account Deletion</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Friends</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Direct Messaging</div>
              </li>
            </ul>
          </div>
          <div id="server" className="absolute -mt-20"></div>
          <div className="pt-16">
            <div className="text-2xl font-semibold tracking-wider">Server</div>
            <p className="pt-12 tracking-wide">These features regard how servers function</p>
            <ul className="">
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Message Link Preview</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Message Attachments</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>{" "}
                <div className="pl-2">Message Reactions</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Code Blocks in Messages</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-transparent pt-1"></div>{" "}
                <div className="pl-2">
                  Syntactical Highlighting in code blocks - language will need to be declared for this
                </div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-transparent pt-1"></div>{" "}
                <div className="pl-2">Server Aesthetics defined by owner / admin</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>{" "}
                <div className="pl-2">Server Admin</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-transparent pt-1"></div>{" "}
                <div className="pl-2">Server Templates</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Channel Deletion</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Real name vs Pseudonym Preferences</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>{" "}
                <div className="pl-2">Public Server Listing</div>
              </li>
            </ul>
          </div>
          <div id="bots" className="absolute -mt-20"></div>
          <div className="pt-16">
            <div className="text-2xl font-semibold tracking-wider">Bots</div>
            <p className="pt-12 tracking-wide">These features regard the usage of bots</p>
            <ul className="">
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-transparent pt-1"></div>{" "}
                <div className="pl-2">Pre-made Bots</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-transparent pt-1"></div>{" "}
                <div className="pl-2">User defined bots</div>
              </li>
            </ul>
          </div>
          <div id="misc" className="absolute -mt-20"></div>
          <div className="pt-16">
            <div className="text-2xl font-semibold tracking-wider">Miscellaneous</div>
            <p className="pt-12 tracking-wide">
              These features don&apos;t neatly fall into any of the previous categories
            </p>
            <ul className="">
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>{" "}
                <div className="pl-2">User Search</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Server Search</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Desktop App</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Mobile Apps</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-transparent pt-1"></div>{" "}
                <div className="pl-2">Usage Statistics</div>
              </li>
              <li className="flex">
                <div className="absolute my-auto -ml-2 mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>{" "}
                <div className="pl-2">Privacy Policy Documentation</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className={`${
          showingAside ? "ml-[30vw] md:ml-[20vw] xl:ml-[15vw]" : null
        } mb-4 mt-12 border-b border-zinc-800 dark:border-zinc-300`}
      />
      <Footer />
    </div>
  );
};

export default RoadMap;
