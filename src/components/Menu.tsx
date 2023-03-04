import React, { RefObject, useRef, useState } from "react";
import Link from "next/link";
import { Nunito } from "@next/font/google";
import { Button, Tooltip } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import BackArrow from "../icons/BackArrow";
import InfoModalContent from "./InfoModalContent";

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
              <Link
                href="/"
                className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
              >
                <div className="rounded-lg p-2 hover:bg-zinc-700">
                  <div className="px-4 text-center text-lg text-zinc-100">
                    Home
                  </div>
                </div>
              </Link>
            )}
          </li>
          <li className="flex justify-center text-lg">
            <button
              className="w-28 rounded-lg p-2 text-center text-lg text-zinc-100 hover:bg-zinc-700"
              ref={infoButtonRef}
              onClick={infoDropdownToggle}
            >
              Info
            </button>
          </li>
          {session ? (
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
                    className="w-28 rounded-lg py-2 px-4 text-center text-lg text-zinc-800 hover:bg-zinc-700 dark:text-zinc-300"
                  >
                    User Settings
                  </button>
                ) : (
                  <Link href={"/user-settings"}></Link>
                )}
              </li>
              <li className="flex justify-center text-lg">
                <button
                  onClick={() => signOut()}
                  className="w-28 rounded-lg py-2 px-4 text-center text-lg text-zinc-800 hover:bg-zinc-700 dark:text-zinc-300"
                >
                  Sign out
                </button>
              </li>
            </>
          ) : pathname !== "/login" ? (
            <li className="my-auto text-lg">
              <button
                onClick={props.openLogin}
                className="w-28 rounded-lg py-2 px-4 text-center text-lg text-zinc-800 hover:bg-zinc-700 dark:text-zinc-300"
              >
                Login / Register
              </button>
            </li>
          ) : null}
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
                    <Link href={"/"} className="text-[#E2E2E2]">
                      Web App
                    </Link>
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
            className="absolute -mt-7 flex rounded-md px-2 py-1 hover:bg-zinc-600"
            onClick={infoDropdownToggle}
          >
            <BackArrow
              height={24}
              width={24}
              stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
              strokeWidth={1}
            />
            <div className="pl-2">Back</div>
          </button>
          <InfoModalContent />
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
