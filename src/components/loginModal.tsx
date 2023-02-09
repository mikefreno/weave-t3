import React, { useEffect, useState, useRef, useContext } from "react";
import Xmark from "@/src/icons/Xmark";
import CheckMark from "@/src/icons/checkMark";
import { Input, Button, Loading, Popover, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import LightLogo from "@/public/Logo - light.png";
import DarkLogo from "@/public/Logo - dark.png";
import Email from "next-auth/providers/email";
import { useSession, signIn, signOut } from "next-auth/react";
import ThemeContext from "./ThemeContextProvider";
import GoogleLogo from "../icons/GoogleLogo";
import GitHub from "../icons/GitHub";

const LoginModal = (props: {
  onClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
  loginRef: React.LegacyRef<HTMLDivElement> | undefined;
}) => {
  const [loginButtonLoading, setLoginButtonLoading] = useState(false);
  const [registerButtonLoading, setRegisterButtonLoading] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailPassState, setEmailPassState] = useState(false);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null
  );
  const [registerErrorReport, setRegisterErrorReport] = useState("");
  const { isDarkTheme } = useContext(ThemeContext);
  const emailLoginInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      setFocusedElement(event.target as HTMLElement);
    };
    document.addEventListener("focus", handleFocus, true);
    return () => {
      document.removeEventListener("focus", handleFocus, true);
    };
  }, []);

  function emailLogin(event: { preventDefault: () => void }) {
    loginButtonLoadingToggle();
    event.preventDefault();
    if (emailLoginInputRef.current) {
      const email = emailLoginInputRef.current.value;
      signIn("email", { email, callbackUrl: "/account-set-up" });
    }
  }

  function loginButtonLoadingToggle() {
    setLoginButtonLoading(!loginButtonLoading);
  }
  function loginSubmitButton() {
    if (loginButtonLoading) {
      return (
        <Button disabled auto bordered color="gradient" css={{ px: "$13" }}>
          <Loading type="points" size="sm" />
        </Button>
      );
    } else {
      return (
        <Button shadow color="gradient" auto type="submit">
          Get Link
        </Button>
      );
    }
  }

  return (
    <div ref={props.loginRef} className="flex justify-center">
      <div
        className="fade-in dark:text- fixed z-50 mt-32 w-4/5 rounded-lg border-2 border-zinc-400 bg-zinc-200  p-4 text-zinc-800
        shadow-xl dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-200 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/3"
      >
        <div className="-mb-6 pl-2 text-2xl">
          <span className="border-b-2 border-zinc-800">Login / Register</span>
        </div>
        <button className="absolute right-4 -mt-4 w-10" onClick={props.onClose}>
          <Xmark className="text-zinc-800 dark:text-zinc-200" />
        </button>
        <div className="-mb-12 flex justify-center">
          <Image
            src={isDarkTheme ? DarkLogo : LightLogo}
            alt="logo"
            width={80}
            height={80}
          />
        </div>
        <div className="mt-12">
          <form onSubmit={emailLogin} className="flex flex-col px-2">
            <div className="flex flex-col py-4">
              <Input
                id="emailInput"
                ref={emailLoginInputRef}
                labelPlaceholder="Email"
                required
                clearable
                underlined
                color="secondary"
              />
            </div>
            <div className="w-min">{loginSubmitButton()}</div>
          </form>
          <div className="my-2">
            <div className="mb-4 text-center">Or</div>
            <div className="-mx-2 mb-4 flex justify-around">
              <button
                className="flex flex-row rounded bg-zinc-100 px-4 py-2 text-black hover:bg-zinc-300 active:bg-zinc-400"
                onClick={() => {
                  signIn("google", { callbackUrl: "/account-set-up" }).catch(
                    console.log
                  );
                }}
              >
                Sign in with Google
                <span className="ml-4 -mr-2">
                  <GoogleLogo height={24} width={24} />
                </span>
              </button>
              <button
                className="flex flex-row rounded bg-zinc-600 px-4 py-2 text-white hover:bg-zinc-700 active:bg-zinc-900"
                onClick={() => {
                  signIn("github", { callbackUrl: "/account-set-up" }).catch(
                    console.log
                  );
                }}
              >
                Sign in with Github
                <span className="ml-4 -mr-2">
                  <GitHub height={24} width={24} fill={"white"} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
