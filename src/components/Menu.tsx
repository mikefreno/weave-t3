import React, { RefObject, useRef, useState } from "react";
import Link from "next/link";
import { Nunito } from "@next/font/google";
import { Button, Loading, Tooltip } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import BackArrow from "../icons/BackArrow";
import InfoModalContent from "./InfoModalContent";
import Image from "next/image";
import LightLogo from "@/public/Logo - light.png";
import DarkLogo from "@/public/Logo - dark.png";

const nunito_200 = Nunito({ weight: "200", subsets: ["latin"] });

const Menu = (props: {
  openLogin: React.MouseEventHandler<HTMLButtonElement>;
  menuRef: RefObject<HTMLDivElement>;
  session: any;
  status: any;
  isDarkTheme: boolean;
  currentTabSetter?: (tab: string) => void;
  setSelectedInnerTab?: (innerTab: string) => void;
  setMenuOpen: (open: boolean) => void;
}) => {
  const pathname = usePathname();
  const {
    session,
    status,
    isDarkTheme,
    currentTabSetter,
    setSelectedInnerTab,
  } = props;
  const [infoDropdownShowing, setInfoDropdownShowing] = useState(false);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const infoModalRef = useRef<HTMLDivElement>(null);

  const infoDropdownToggle = () => {
    setInfoDropdownShowing(!infoDropdownShowing);
  };

  const menuState = () => {
    if (infoDropdownShowing === false) {
      return (
        <ul className="px-1 pb-4 pt-6">
          <li className="pt-2 text-lg">
            {pathname == "/" ? null : (
              <Link href="/">
                <div className="rounded-lg p-2 px-4 text-center text-lg text-zinc-800 hover:bg-purple-400 dark:text-zinc-100 dark:hover:bg-zinc-700">
                  Home
                </div>
              </Link>
            )}
          </li>
          <li className="flex justify-center text-lg">
            <button
              className="w-28 rounded-lg p-2 text-center text-lg text-zinc-800 hover:bg-purple-400 dark:text-zinc-100 dark:hover:bg-zinc-700"
              ref={infoButtonRef}
              onClick={infoDropdownToggle}
            >
              Info
            </button>
          </li>
          {status !== "loading" ? (
            session ? (
              <>
                <li className="flex justify-center text-lg">
                  {pathname === "/app" &&
                  setSelectedInnerTab &&
                  currentTabSetter ? (
                    <button
                      onClick={() => {
                        currentTabSetter("DMS");
                        setSelectedInnerTab("AccountOverview");
                        props.setMenuOpen(false);
                      }}
                      className="text-zinc-800hover:bg-purple-400 w-28 rounded-lg px-4 py-2 text-center text-lg hover:bg-purple-400 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      User Settings
                    </button>
                  ) : // ) : pathname === "/user-settings" ? null : (
                  //   <Tooltip
                  //     content={"Coming Soon!"}
                  //     placement="bottomStart"
                  //     color={"secondary"}
                  //   >
                  //     <div className="w-28 rounded-lg px-4 py-2 text-center text-lg text-zinc-800 hover:bg-purple-400 dark:text-zinc-300 dark:hover:bg-zinc-700">
                  //       User Settings
                  //     </div>
                  //   </Tooltip>
                  null}
                </li>
                <li className="flex justify-center text-lg">
                  <button
                    onClick={() => signOut()}
                    className="w-28 rounded-lg px-4 py-2 text-center text-lg text-zinc-800 hover:bg-purple-400 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : pathname !== "/login/redirect" ? (
              <li className="my-auto text-lg">
                <button
                  onClick={props.openLogin}
                  className="w-28 rounded-lg px-4 py-2 text-center text-lg text-zinc-800 hover:bg-purple-400 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Login / Register
                </button>
              </li>
            ) : null
          ) : (
            <div className="my-auto flex justify-center pr-2">
              <Loading size="lg" color={"secondary"} />
              <div className="absolute mt-1">
                {isDarkTheme ? (
                  <Image src={DarkLogo} alt={"logo"} width="36" />
                ) : (
                  <Image src={LightLogo} alt={"logo"} width="36" />
                )}
              </div>
            </div>
          )}
          {pathname == "/app" ? null : (
            <li className="mt-4 flex justify-center pt-2 text-lg">
              {status == "authenticated" ? (
                <Button shadow color="gradient" auto size={"md"}>
                  <Link href={"/app"} className="text-[#E2E2E2]">
                    Web App
                  </Link>
                </Button>
              ) : (
                <Tooltip
                  content={"Login to use!"}
                  placement="bottomStart"
                  color={"secondary"}
                >
                  <Button shadow color="gradient" auto size={"md"}>
                    Web App
                  </Button>
                </Tooltip>
              )}
            </li>
          )}
        </ul>
      );
    } else {
      return (
        <ul className="pt-8">
          <button
            className="absolute -mt-7 flex rounded-full px-2 py-1 hover:bg-purple-400 dark:hover:bg-zinc-700"
            onClick={infoDropdownToggle}
          >
            <div className="pl-2">Back</div>
            <div className="my-auto rotate-180">
              <BackArrow
                height={24}
                width={24}
                stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                strokeWidth={1}
              />
            </div>
          </button>
          <InfoModalContent isDarkTheme={isDarkTheme} />
        </ul>
      );
    }
  };
  return (
    <div
      id="menu"
      ref={props.menuRef}
      className={`fade-in absolute right-4 top-2 z-[100] mr-2 ${
        pathname === "/app" ? "" : "md:hidden"
      }`}
    >
      <div
        className={`${nunito_200} rounded-b-3xl rounded-tl-3xl rounded-tr-sm border border-zinc-400 bg-zinc-200 shadow-xl dark:border-zinc-500 dark:bg-zinc-900`}
      >
        {menuState()}
      </div>
    </div>
  );
};

export default Menu;
