import React, { useEffect, useState, useRef } from "react";
import Xmark from "@/src/icons/Xmark";
import CheckMark from "@/src/icons/checkMark";
import { Input, Button, Loading, Popover } from "@nextui-org/react";
import Image from "next/image";
import Logo from "@/public/Logo - solid.png";
import Email from "next-auth/providers/email";
import { useSession, signIn, signOut } from "next-auth/react";

function LoginModal({ onClose }: any) {
  const [modalState, setModalState] = useState("login");
  const [loginButtonLoading, setLoginButtonLoading] = useState(false);
  const [registerButtonLoading, setRegisterButtonLoading] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailPassState, setEmailPassState] = useState(false);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null
  );
  const [registerErrorReport, setRegisterErrorReport] = useState("");

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      setFocusedElement(event.target as HTMLElement);
    };
    document.addEventListener("focus", handleFocus, true);
    return () => {
      document.removeEventListener("focus", handleFocus, true);
    };
  }, []);

  function swapModal() {
    if (modalState == "login") {
      setModalState("register");
    } else {
      setModalState("login");
    }
  }
  function loginCall(event: { preventDefault: () => void }) {
    event.preventDefault();
    const email = emailInput;

    fetch("/api/auth/email-login", {
      method: "POST",
      body: JSON.stringify({ EMAIL: email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  async function registerCall(event: { preventDefault: () => void }) {
    event.preventDefault();

    const reqBody = {
      EMAIL: emailInput,
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setRegisterErrorReport(data.message);
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
        <Button
          shadow
          color="gradient"
          auto
          type="submit"
          onClick={loginButtonLoadingToggle}
        >
          Get Link
        </Button>
      );
    }
  }
  function registerButtonLoadingToggle() {
    setLoginButtonLoading(!loginButtonLoading);
  }
  function registerSubmitButton() {
    if (registerButtonLoading) {
      return (
        <Button disabled auto bordered color="gradient" css={{ px: "$13" }}>
          <Loading type="points" size="sm" />
        </Button>
      );
    } else if (emailPassState == false) {
      return (
        <Button shadow color="gradient" auto type="submit">
          Fill out email
        </Button>
      );
    } else {
      return (
        <Button shadow color="gradient" auto type="submit">
          Get Started
        </Button>
      );
    }
  }
  function emailInputHandler(event: any) {
    setEmailInput(event.target.value);
    checkEmailInput();
  }
  function checkEmailInput() {
    const email = emailInput;
    let regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (
      email.length >= 3 &&
      regex.test(email) &&
      email.split("@")[0]!.length > 0
    ) {
      setEmailPassState(true);
    } else {
      setEmailPassState(false);
    }
  }
  if (modalState == "login") {
    return (
      <div className="flex justify-center">
        <div
          className="fade-in dark:text- fixed z-50 mt-32 w-4/5 rounded-lg border-2 border-zinc-400 bg-zinc-200  p-4 text-zinc-800
        shadow-xl dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-200 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/3"
        >
          <div className="-mb-6 pl-2 text-2xl">
            <span className="border-b-2 border-zinc-800">Login</span>
          </div>
          <button className="absolute right-4 -mt-4 w-10" onClick={onClose}>
            <Xmark className="text-zinc-800 dark:text-zinc-200" />
          </button>
          <div className="-mb-12 flex justify-center">
            <Image src={Logo} alt="logo" width={80} height={80} />
          </div>
          <div className="mt-12">
            <form onSubmit={loginCall} className="flex flex-col px-2">
              <div className="flex flex-col py-4">
                <Input
                  id="emailInput"
                  labelPlaceholder="Email"
                  required
                  clearable
                  underlined
                  color="secondary"
                />
              </div>
              <div className="w-min">{loginSubmitButton()}</div>
            </form>
            <div className="flex justify-end">
              <span className="my-auto mr-2 text-sm">Need an account?</span>
              <Button
                color="gradient"
                shadow
                size={"sm"}
                auto
                onClick={swapModal}
              >
                Click Here!
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <div
          className="fade-in dark:text- fixed z-50 mt-32 w-4/5 rounded-lg border-2 border-zinc-400 bg-zinc-200  p-4 text-zinc-800
        shadow-xl dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-200 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/3"
        >
          <div className="-mb-6 pl-2 text-2xl">
            <span className="border-b-2 border-zinc-800">Register</span>
          </div>
          <button className="absolute right-4 -mt-4 w-10" onClick={onClose}>
            <Xmark className="text-zinc-800 dark:text-zinc-200" />
          </button>
          <div className="-mb-12 flex justify-center">
            <Image src={Logo} alt="logo" width={80} height={80} />
          </div>
          <div className="mt-12">
            <form onSubmit={registerCall} className="flex flex-col px-2">
              <div className="flex flex-col py-4">
                <Input
                  id="emailInput"
                  labelPlaceholder="Email"
                  required
                  clearable
                  underlined
                  color="secondary"
                  onKeyUp={emailInputHandler}
                />
                {focusedElement?.id == "emailInput" ? (
                  emailPassState ? (
                    <span className="mx-auto mt-2 -mb-2 flex text-sm text-green-400 md:ml-2">
                      <CheckMark className="mt-0.5 h-4 w-4" /> Looks good!
                    </span>
                  ) : (
                    <span className="mx-auto mt-2 -mb-2 flex text-sm text-red-400 md:ml-2">
                      <Xmark className="mt-0.5 h-4 w-4" />
                      Invalid Email
                    </span>
                  )
                ) : null}
              </div>
              <div className="w-min">{registerSubmitButton()}</div>
            </form>
            {registerErrorReport != "Ok" ? (
              <span className="my-2 flex justify-center text-red-600">
                {registerErrorReport}
              </span>
            ) : (
              <div className="p-4 text-center">
                <div className="text-green-600">Registration Email Sent!</div>
              </div>
            )}
            <div className="flex justify-end">
              <span className="my-auto mr-2 text-sm">
                Already have an account?
              </span>
              <Button
                shadow
                color="gradient"
                size={"sm"}
                auto
                onClick={swapModal}
              >
                Click Here!
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginModal;
