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
import { Raleway } from "@next/font/google";
import MenuBars from "@/src/icons/MenuBars";
import Menu from "./Menu";
import LoginModal from "./loginModal";
import { SunIcon } from "@/src/icons/SunIcon";
import { MoonIcon } from "@/src/icons/MoonIcon";
import { Switch, Button, Tooltip, Loading } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ThemeContext from "./ThemeContextProvider";
import useOnClickOutside from "./ClickOutsideHook";
import InfoModalContent from "./InfoModalContent";
import { api } from "../utils/api";
import { Server, Server_Admin, Server_Member, User } from "@prisma/client";

const railway_300 = Raleway({ weight: "300", subsets: ["latin"] });

type UserData = User & {
  servers: Server[];
  memberships: Server_Member[];
  adminships: Server_Admin[];
};

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
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const currentUserReturn = api.users.getCurrentUser.useQuery();

  useEffect(() => {
    if (currentUserReturn.data) setCurrentUser(currentUserReturn.data);
  }, [currentUserReturn]);

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
                    className="fade-in absolute -ml-1 p-2"
                    ref={infoModalRef}
                  >
                    <div className="-ml-40 mt-8 rounded-b-3xl rounded-tr-sm rounded-tl-3xl border border-zinc-500 bg-zinc-200 shadow-xl dark:bg-zinc-900">
                      <div className="p-1">
                        <InfoModalContent isDarkTheme={isDarkTheme} />
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
              {status !== "loading" ? (
                session ? (
                  <>
                    <Tooltip
                      content={"Coming Soon!"}
                      trigger="click"
                      color={"secondary"}
                      placement="bottom"
                    >
                      <li className="z-50 my-auto">
                        {pathname == "/user-settings" ? (
                          <div className="cursor-pointer border-[#171717] pr-4 text-[#171717] underline underline-offset-[6px] dark:border-[#E2E2E2]  dark:text-[#E2E2E2]">
                            User Settings
                          </div>
                        ) : (
                          <div
                            // href="/user-settings"
                            className="cursor-pointer border-[#171717] pr-4 text-[#171717] underline-offset-[6px] hover:underline dark:border-[#E2E2E2]  dark:text-[#E2E2E2]"
                          >
                            User Settings
                          </div>
                        )}
                      </li>
                    </Tooltip>
                    <li className="z-50 my-auto pr-2">
                      <button
                        className="underline-offset-[6px] hover:underline"
                        onClick={() => signOut()}
                      >
                        Sign out
                      </button>
                    </li>
                  </>
                ) : pathname !== "/login" ? (
                  <li className="z-50 my-auto pr-2">
                    <button
                      className="underline-offset-[6px] hover:underline"
                      onClick={loginToggle}
                    >
                      Login / Register
                    </button>
                  </li>
                ) : null
              ) : (
                <div className="my-auto flex pr-2">
                  <Loading size="md" color={"secondary"} />
                  <div className="absolute mt-1 ml-1">
                    {isDarkTheme ? (
                      <Image src={DarkLogo} alt={"logo"} width="24" />
                    ) : (
                      <Image src={LightLogo} alt={"logo"} width="24" />
                    )}
                  </div>
                </div>
              )}
              <li className="mx-2 my-auto text-sm ">
                {status === "authenticated" &&
                (session.user?.name || currentUser?.pseudonym) ? (
                  <Button shadow color="gradient" auto size={"sm"}>
                    <Link href={"/app"} className="text-[#E2E2E2]">
                      Web App
                    </Link>
                  </Button>
                ) : status === "authenticated" ? (
                  <Tooltip
                    content={"Finish account setup!"}
                    placement="bottomStart"
                    color={"secondary"}
                  >
                    <Button shadow color="gradient" auto size={"sm"}>
                      <Link href={"/account-set-up"} className="text-[#E2E2E2]">
                        Web App
                      </Link>
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip
                    content={"Login to use!"}
                    placement="bottomStart"
                    color={"secondary"}
                  >
                    <Button shadow color="gradient" auto size={"sm"}>
                      Web App
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
            setMenuOpen={setMenuOpen}
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
