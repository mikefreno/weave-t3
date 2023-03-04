import React, { RefObject, useRef, useState } from "react";
import Link from "next/link";
import { Nunito } from "@next/font/google";
import { Button, Tooltip } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import BackArrow from "../icons/BackArrow";

const nunito_200 = Nunito({ weight: "200", subsets: ["latin"] });

const Menu = (props: {
  openLogin: React.MouseEventHandler<HTMLButtonElement>;
  menuRef: RefObject<HTMLDivElement>;
  session: any;
  status: any;
  isDarkTheme: boolean;
  currentTabSetter?: (tab: string) => void;
  setSelectedInnerTab?: (innerTab: string) => void;
}) => {
  const pathname = usePathname();
  const { session, status, isDarkTheme } = props;
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
                {pathname === "/app" ? (
                  <button
                    onClick={() => {
                      props.currentTabSetter("DMS");
                      props.setSelectedInnerTab("AccountOverview");
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
                className="hover:bg-zinc-7000 w-28 rounded-lg p-2 text-center text-lg text-zinc-100"
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
        <ul className="pb-4 pt-8">
          <button className="absolute -mt-7 flex" onClick={infoDropdownToggle}>
            <BackArrow
              height={24}
              width={24}
              stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
              strokeWidth={1}
            />
            <div className="pl-2">Back</div>
          </button>
          <Tooltip
            content={"Coming Soon!"}
            trigger="click"
            color={"secondary"}
            placement="top"
          >
            <div className="w-48 p-2">
              {pathname == "/downloads" ? (
                <div className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]">
                  <div className="rounded-b rounded-tl-2xl rounded-tr-sm bg-zinc-700 p-2">
                    <div className="text-lg text-zinc-100">Downloads</div>
                    <p className="text-center text-sm text-zinc-400">
                      Coming soon
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]">
                  <div className="rounded-b rounded-tl-2xl rounded-tr-sm p-2 hover:bg-zinc-700">
                    <div className="text-lg text-zinc-100">Downloads</div>
                    <p className="text-center text-sm text-zinc-400">
                      Coming soon
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Tooltip>
          <div className="w-48 p-2">
            {pathname == "/roadmap" ? (
              <Link
                href="/roadmap"
                className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
              >
                <div className="rounded bg-zinc-700 p-2">
                  <div className="text-lg text-zinc-100">Roadmap</div>
                  <p className="text-center text-sm text-zinc-400">
                    See whats coming to Weave
                  </p>
                </div>
              </Link>
            ) : (
              <Link
                href="/roadmap"
                className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
              >
                <div className="rounded p-2 hover:bg-zinc-700">
                  <div className="text-lg text-zinc-100">Roadmap</div>
                  <p className="text-center text-sm text-zinc-400">
                    See what's coming to Weave next!
                  </p>
                </div>
              </Link>
            )}
          </div>
          <div className="w-48 p-2">
            {pathname == "/what-is-weave" ? (
              <Link
                href="/what-is-weave"
                className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
              >
                <div className="rounded rounded-t rounded-br-2xl bg-zinc-700 p-2">
                  <div className="text-lg text-zinc-100">What is Weave?</div>
                  <p className="text-center text-sm text-zinc-400">
                    An explainer
                  </p>
                </div>
              </Link>
            ) : (
              <Link
                href="/what-is-weave"
                className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
              >
                <div className="rounded p-2 hover:bg-zinc-700">
                  <div className="text-lg text-zinc-100">What is Weave?</div>
                  <p className="text-center text-sm text-zinc-400">
                    An explainer
                  </p>
                </div>
              </Link>
            )}
          </div>
          <div className="w-48 p-2">
            {pathname == "/why-weave" ? (
              <Link
                href="/why-weave"
                className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
              >
                <div className="rounded- rounded-t-sm rounded-br-2xl bg-zinc-700 p-2">
                  <div className="text-lg text-zinc-100">Why Weave?</div>
                  <p className="text-center text-sm text-zinc-400">
                    And how to use
                  </p>
                </div>
              </Link>
            ) : (
              <Link
                href="/why-weave"
                className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
              >
                <div className="rounded-b-3xl rounded-t-sm p-2 hover:bg-zinc-700">
                  <div className="text-lg text-zinc-100">Why Weave?</div>
                  <p className="text-center text-sm text-zinc-400">
                    And how to use
                  </p>
                </div>
              </Link>
            )}
          </div>
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
