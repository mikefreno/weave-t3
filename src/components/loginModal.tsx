import React, { useEffect, useState, useRef, useContext } from "react";
import Xmark from "@/src/icons/Xmark";
import { Input, Button, Loading, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import LightLogo from "@/public/Logo - light.png";
import DarkLogo from "@/public/Logo - dark.png";
import { signIn } from "next-auth/react";
import ThemeContext from "./ThemeContextProvider";
import GoogleLogo from "../icons/GoogleLogo";
import GitHub from "../icons/GitHub";
import axios from "axios";
import { useRouter } from "next/router";
import InfoIcon from "../icons/InfoIcon";

const LoginModal = (props: {
  onClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
  loginRef: React.LegacyRef<HTMLDivElement> | undefined;
}) => {
  const [loginButtonLoading, setLoginButtonLoading] = useState(false);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null
  );
  const { isDarkTheme } = useContext(ThemeContext);
  const emailLoginInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter().route;

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      setFocusedElement(event.target as HTMLElement);
    };
    document.addEventListener("focus", handleFocus, true);
    return () => {
      document.removeEventListener("focus", handleFocus, true);
    };
  }, []);

  async function emailLogin(event: { preventDefault: () => void }) {
    loginButtonLoadingToggle();
    event.preventDefault();
    if (emailLoginInputRef.current) {
      const email = emailLoginInputRef.current.value;
      const response = await axios.get(`/api/userCheck?email=${email}`);
      if (response.status == 204) {
        signIn("email", { email, callbackUrl: "/account-set-up" });
      } else {
        signIn("email", { email });
      }
    }
    loginButtonLoadingToggle();
  }
  async function googleLogin() {
    signIn("google", { callbackUrl: "/api/providerUserCreationCheck" }).catch(
      console.log
    );
  }
  async function githubLogin() {
    signIn("github", { callbackUrl: "/api/providerUserCreationCheck" }).catch(
      console.log
    );
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
        className="fade-in dark:text- fixed z-40 mt-32 w-4/5 rounded-lg border-2 border-zinc-400 bg-zinc-200 p-4 text-zinc-800
        shadow-xl dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-200 sm:w-3/4 md:w-3/5 lg:w-2/5"
      >
        <div className="absolute z-50 -mb-6 max-w-[25vw] pl-2 text-2xl">
          {router == "/login" ? "Login" : "Login / Register"}
        </div>
        {router == "/login" ? null : (
          <button
            className="absolute right-4 -mt-2 w-10"
            onClick={props.onClose}
          >
            <Xmark className="text-zinc-800 dark:text-zinc-200" />
          </button>
        )}
        <div className="z-0 -mb-12 flex justify-center">
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
            <div className="absolute ml-[100px] mt-[70px]">
              <Tooltip
                css={{ width: "180px", textAlign: "center" }}
                content={
                  "Weave uses a password-less login system, to login/register you will receive a link in you're email"
                }
              >
                <InfoIcon height={16} width={16} fill={"#9333ea"} />
              </Tooltip>
            </div>
          </form>
          <div className="my-2">
            <div className="rule-around mb-4 text-center">Or</div>
            <div className="-mx-2 mb-4 flex justify-around">
              <button
                className="flex flex-row rounded bg-zinc-100 px-4 py-2 text-black hover:bg-zinc-300 active:bg-zinc-400"
                onClick={googleLogin}
              >
                Sign in with Google
                <span className="my-auto ml-4 -mr-2">
                  <GoogleLogo height={24} width={24} />
                </span>
              </button>
              <div className="px-4"></div>
              <button
                className="flex flex-row rounded bg-zinc-600 px-4 py-2 text-white hover:bg-zinc-700 active:bg-zinc-900"
                onClick={githubLogin}
              >
                Sign in with Github
                <span className="my-auto ml-4 -mr-2">
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
