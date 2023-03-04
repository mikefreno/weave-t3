import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import LightLogo from "@/public/Logo - light.png";
import DarkLogo from "@/public/Logo - dark.png";
import { Nunito, Raleway } from "@next/font/google";
import MenuBars from "@/src/icons/MenuBars";
import Menu from "./Menu";
import LoginModal from "./loginModal";
import { SunIcon } from "@/src/icons/SunIcon";
import { MoonIcon } from "@/src/icons/MoonIcon";
import { Switch, Button, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ThemeContext from "./ThemeContextProvider";
import useOnClickOutside from "./ClickOutsideHook";
import FlipMessageIcon from "../icons/FilpMessage";

const railway_300 = Raleway({ weight: "300", subsets: ["latin"] });

const Navbar = (props: {
  switchRef?: React.RefObject<HTMLDivElement>;
  currentTabSetter?: (tab: string) => void;
  setSelectedInnerTab?: (innerTab: string) => void;
}) => {
  const { setSelectedInnerTab, currentTabSetter } = props;
  const { isDarkTheme, switchDarkTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showingLoginModal, setShowingLoginModal] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const [infoDropdownShowing, setInfoDropdownShowing] = useState(false);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const infoModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname == "/app") {
      if (showingLoginModal) {
        document.getElementById("app-body")?.classList.add("modal-open");
      } else {
        document.getElementById("app-body")?.classList.remove("modal-open");
      }
    } else if (pathname == "/") {
      if (showingLoginModal) {
        document.getElementById("main")?.classList.add("modal-open");
      } else {
        document.getElementById("main")?.classList.remove("modal-open");
      }
    }
  }, [showingLoginModal]);

  useOnClickOutside(
    [menuRef, closeRef, props.switchRef as RefObject<HTMLDivElement>],
    () => {
      setMenuOpen(false);
    }
  );

  useOnClickOutside([infoModalRef, infoButtonRef], () => {
    setInfoDropdownShowing(false);
  });

  useOnClickOutside(
    [loginRef, loginButtonRef, props.switchRef as RefObject<HTMLDivElement>],
    () => {
      setShowingLoginModal(false);
    }
  );

  useEffect(() => {
    rotateBars();
  }, [menuOpen]);

  function rotateBars() {
    if (menuOpen) {
      document.getElementById("LineA")?.classList.add("LineA");
      document.getElementById("LineB")?.classList.add("LineB");
    } else {
      document.getElementById("LineA")?.classList.remove("LineA");
      document.getElementById("LineB")?.classList.remove("LineB");
    }
  }
  function menuToggle() {
    setMenuOpen(!menuOpen);
    rotateBars();
    if (showingLoginModal) {
      loginToggle();
    }
  }
  function loginToggle() {
    setShowingLoginModal(!showingLoginModal);
    if (menuOpen) {
      menuToggle();
    }
  }
  function openLoginRegisterModal() {
    loginToggle();
  }
  const infoDropdownToggle = () => {
    setInfoDropdownShowing(!infoDropdownShowing);
  };

  return (
    <div className="stopIT">
      <nav
        className={`fixed z-50 flex p-2 ${
          pathname !== "/app" ? "w-screen backdrop-blur" : "right-0 rounded-lg"
        }`}
      >
        {pathname == "/app" ? null : (
          <div
            className={`mx-4 my-2 text-[#171717] dark:text-[#E2E2E2] ${railway_300.className} flex flex-1`}
          >
            <Link href={"/"} className="flex">
              <Image
                src={isDarkTheme ? DarkLogo : LightLogo}
                alt="logo"
                width={40}
                height={40}
                className="logoSpinner"
              />
              <span className="mx-2 my-auto text-2xl text-[#171717] dark:text-[#E2E2E2]">
                Weave
              </span>
            </Link>
          </div>
        )}
        <div className="my-auto flex justify-end" style={{ flex: 3 }}>
          <div className={pathname == "/app" ? "hidden" : "hidden md:block"}>
            <ul className="flex text-sm text-[#171717] dark:text-[#E2E2E2]">
              <div
                ref={props.switchRef}
                className={`${pathname == "/" ? "-mr-4" : null} z-50 mt-1`}
              >
                <Switch
                  checked={isDarkTheme}
                  shadow
                  bordered
                  size="md"
                  color="secondary"
                  iconOn={<MoonIcon />}
                  iconOff={<SunIcon />}
                  onChange={switchDarkTheme}
                />
              </div>
              <li className="z-50 my-auto pl-4">
                {pathname == "/" ? null : (
                  <Link
                    href="/"
                    className="border-[#171717] text-[#171717] hover:border-b-2 dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
                  >
                    Home
                  </Link>
                )}
              </li>
              <li className="my-auto flex flex-col">
                <button
                  ref={infoButtonRef}
                  className={`z-50 px-4 underline-offset-[6px] hover:underline ${
                    infoDropdownShowing ? "underline" : null
                  }`}
                  onClick={infoDropdownToggle}
                >
                  Info
                </button>
                {infoDropdownShowing ? (
                  <div
                    className="fade-in absolute mx-auto p-2"
                    ref={infoModalRef}
                  >
                    <div className="mt-8 ml-2 rounded-b-3xl rounded-tr-3xl rounded-tl-sm border border-zinc-500 bg-zinc-900 shadow-xl">
                      <div className="p-1">
                        <Tooltip
                          content={"Coming Soon!"}
                          trigger="click"
                          color={"secondary"}
                          placement="top"
                        >
                          <div className="w-48 p-2">
                            {pathname == "/downloads" ? (
                              <div className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]">
                                <div className="rounded-b rounded-tr-2xl rounded-tl-sm bg-zinc-700 p-2">
                                  <div className="text-lg text-zinc-100">
                                    Downloads
                                  </div>
                                  <p className="text-center text-sm text-zinc-400">
                                    Coming soon
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]">
                                <div className="rounded-b rounded-tr-2xl rounded-tl-sm p-2 hover:bg-zinc-700">
                                  <div className="text-lg text-zinc-100">
                                    Downloads
                                  </div>
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
                                <div className="text-lg text-zinc-100">
                                  Roadmap
                                </div>
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
                                <div className="text-lg text-zinc-100">
                                  Roadmap
                                </div>
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
                                <div className="text-lg text-zinc-100">
                                  What is Weave?
                                </div>
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
                                <div className="text-lg text-zinc-100">
                                  What is Weave?
                                </div>
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
                                <div className="text-lg text-zinc-100">
                                  Why Weave?
                                </div>
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
                                <div className="text-lg text-zinc-100">
                                  Why Weave?
                                </div>
                                <p className="text-center text-sm text-zinc-400">
                                  And how to use
                                </p>
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
              {session ? (
                <>
                  <li className="z-50 my-auto">
                    {pathname == "/user-settings" ? null : (
                      <Link
                        href="/user-settings"
                        className="border-[#171717] pr-4 text-[#171717] underline-offset-[6px] hover:underline dark:border-[#E2E2E2]  dark:text-[#E2E2E2]"
                      >
                        User Settings
                      </Link>
                    )}
                  </li>
                  <li className="z-50 my-auto pr-2">
                    <button
                      className="underline-offset-[6px] hover:underline"
                      onClick={() => signOut()}
                    >
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <li className="z-50 mx-2 my-auto">
                  <button
                    className="underline-offset-[6px] hover:underline"
                    onClick={loginToggle}
                  >
                    Login / Register
                  </button>
                </li>
              )}
              <li className="mx-2 my-auto text-sm ">
                {status === "authenticated" ? (
                  <Button shadow color="gradient" auto size={"sm"}>
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
                    <Button shadow color="gradient" auto size={"sm"}>
                      <Link href={"/"} className="text-[#E2E2E2]">
                        Web App
                      </Link>
                    </Button>
                  </Tooltip>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className={pathname == "/app" ? "my-2" : "my-2 md:hidden"}>
          <div
            className="z-10 my-auto flex justify-end px-4 text-lg"
            ref={props.switchRef}
          >
            <Switch
              checked={isDarkTheme}
              shadow
              bordered
              size="md"
              color="secondary"
              iconOn={<MoonIcon />}
              iconOff={<SunIcon />}
              onChange={switchDarkTheme}
              className="my-auto mr-2"
            />
            {isDarkTheme ? (
              <button onClick={menuToggle} className="my-auto" ref={closeRef}>
                <MenuBars stroke="white" />
              </button>
            ) : (
              <button onClick={menuToggle} className="my-auto" ref={closeRef}>
                <MenuBars stroke="black" />
              </button>
            )}
          </div>
        </div>
        {menuOpen ? (
          <Menu
            openLogin={openLoginRegisterModal}
            menuRef={menuRef}
            session={session}
            status={status}
            isDarkTheme={isDarkTheme}
            currentTabSetter={currentTabSetter}
            setSelectedInnerTab={setSelectedInnerTab}
          />
        ) : null}
      </nav>
      {showingLoginModal ? (
        <LoginModal onClose={loginToggle} loginRef={loginRef} />
      ) : null}
    </div>
  );
};

export default Navbar;
