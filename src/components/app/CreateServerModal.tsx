import AddIcon from "@/src/icons/AddIcon";
import BackArrow from "@/src/icons/BackArrow";
import BriefcaseIcon from "@/src/icons/BriefcaseIcon";
import ClipboardIcon from "@/src/icons/ClipboardIcon";
import GamepadIcon from "@/src/icons/GamepadIcon";
import LongArrow from "@/src/icons/LongArrow";
import SelectChevron from "@/src/icons/SelectChevron";
import StackedBoxesIcon from "@/src/icons/StackedBoxesIcon";
import Xmark from "@/src/icons/Xmark";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Button, Checkbox, Input } from "@nextui-org/react";
import React, { RefObject, useContext, useRef, useState } from "react";
import ThemeContext from "../ThemeContextProvider";
import FileUpload from "./FileUpload";

const CreateServerModal = (props: {
  serverModalRef: RefObject<HTMLDivElement>;
  serverModalToggle: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const { isDarkTheme } = useContext(ThemeContext);
  const [specifiedTemplate, setSpecifiedTemplate] = useState("selector");
  const [serverPublic, setServerPublic] = useState(false);
  const [serverType, setServerType] = useState("");

  const templateSetter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSpecifiedTemplate(event.currentTarget.id);
  };
  const joinServerRequest = (event: any) => {
    event.preventDefault();
  };
  const createServerRequest = (event: any) => {
    event.preventDefault();
  };
  const handleServerTypeChange = (event: any) => {
    setServerType(event.target.value);
  };

  if (specifiedTemplate === "selector") {
    return (
      <div id="modal" className="fixed">
        <div className="modal-offset absolute flex h-screen w-screen items-center justify-center">
          <div
            ref={props.serverModalRef}
            id="serverModalContent"
            className="fade-in -mt-24 w-3/4 rounded-xl bg-zinc-400 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
          >
            <div className="flex w-full justify-between">
              <button onClick={props.serverModalToggle}>
                <Xmark className={"w-10"} />
              </button>
              <div className="flex">
                <span className="my-auto mr-4">Joining a server?</span>
                <span className="animate-left-right mr my-auto">
                  <LongArrow
                    height={30}
                    width={30}
                    stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                    strokeWidth={1}
                  />
                </span>
                <button id="add" onClick={templateSetter}>
                  <AddIcon
                    height={36}
                    width={36}
                    stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </div>
            <div className="py-4 text-center text-2xl">Create a Server</div>
            <button
              id="Generic"
              onClick={templateSetter}
              className="m-4 mx-auto flex w-4/5 rounded-xl bg-zinc-200 p-4 hover:bg-zinc-300 active:bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:active:bg-zinc-900"
            >
              <ClipboardIcon
                height={20}
                width={20}
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                strokeWidth={1.5}
              />
              <div className="mx-auto text-lg">Generic Server</div>
            </button>
            <div className="py-2 text-center text-xl">Server Templates</div>
            <button
              id="Work"
              onClick={templateSetter}
              className="m-4 mx-auto flex w-4/5 rounded-xl bg-blue-500 p-4 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800"
            >
              <BriefcaseIcon
                height={20}
                width={20}
                stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                strokeWidth={1}
              />
              <div className="mx-auto text-lg">
                Work centric
                <div className="text-sm">
                  Start with text channels, real names enforced and others
                  security features enabled.
                </div>
              </div>
            </button>
            <button
              id="Gaming"
              onClick={templateSetter}
              className="m-4 mx-auto flex w-4/5 rounded-xl bg-emerald-500 p-4  hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:active:bg-emerald-800"
            >
              <GamepadIcon
                height={24}
                width={24}
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
              />
              <div className="mx-auto text-lg">
                Gaming Centric
                <div className="text-sm">
                  Text, and voice channels. Currently playing tooltips and
                  in-game overalys.
                </div>
              </div>
            </button>
            <button
              id="Stacked"
              onClick={templateSetter}
              className="m-4 mx-auto flex w-4/5 rounded-xl bg-violet-500 p-4 hover:bg-violet-600 active:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700 dark:active:bg-violet-800"
            >
              <StackedBoxesIcon
                height={24}
                width={24}
                color={isDarkTheme ? "#e4e4e7" : "#27272a"}
              />
              <div className="mx-auto text-lg">
                Fully Stacked
                <div className="text-sm">
                  Start with text channels, voice channels, and a bunch of
                  commonly used settings.
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  } else if (specifiedTemplate == "add") {
    return (
      <div className="fixed">
        <div className="modal-offset absolute flex h-screen w-screen items-center justify-center">
          <div
            ref={props.serverModalRef}
            id="serverModalContent"
            className="fade-in -mt-24 w-3/4 rounded-xl bg-zinc-400 p-12 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
          >
            <div className="flex w-full justify-between">
              <button id="selector" onClick={templateSetter}>
                <BackArrow
                  height={30}
                  width={30}
                  stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                  strokeWidth={1}
                />
              </button>
            </div>
            <div className="text-center text-2xl">Join a server</div>
            <form onSubmit={joinServerRequest}>
              <div className="mt-12 mb-4">
                <div className="flex justify-center">
                  <Input
                    clearable
                    size="xl"
                    labelPlaceholder="Enter invite link or code!"
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    auto
                    shadow
                    css={{
                      backgroundColor: "#6d28d9",
                    }}
                  >
                    Join in!
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="fixed">
        <div className="modal-offset absolute flex h-screen w-screen items-center justify-center">
          <div
            ref={props.serverModalRef}
            id="serverModalContent"
            className="fade-in -mt-24 w-3/4 rounded-xl bg-zinc-400 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
          >
            <div className="flex w-full justify-between">
              <button id="selector" onClick={templateSetter}>
                <BackArrow
                  height={30}
                  width={30}
                  stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                  strokeWidth={1}
                />
              </button>
            </div>
            <div className="flex justify-center text-2xl">
              {specifiedTemplate} Template
            </div>
            <form onSubmit={createServerRequest}>
              <div className="flex flex-col items-center pt-12">
                <Input
                  id="serverName"
                  clearable
                  size="xl"
                  labelPlaceholder="Desired Server Name"
                />
                <Checkbox
                  className="my-4"
                  id="publicSet"
                  isSelected={serverPublic}
                  onChange={() => setServerPublic(!serverPublic)}
                >
                  Make Public?
                </Checkbox>
                {serverPublic ? (
                  <div className="relative">
                    <select
                      id="ServerSelect"
                      className="custom-select mb-4 rounded-xl border-zinc-300 bg-zinc-900"
                      onChange={handleServerTypeChange}
                      defaultValue={""}
                    >
                      <option value="" disabled>
                        Select Server Type
                      </option>
                      <option value="Finance & Economics">
                        Finance & Economics
                      </option>
                      <option value="Music">Music</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Education">Education</option>
                      <option value="Science & Technology">
                        Science & Technology
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                ) : null}
                {serverType === "Other" ? (
                  <div className="mx-12 mb-6 text-center">
                    Your server will not be listed under any category, it will
                    only be found by searching directly
                  </div>
                ) : null}
                <div className="mx-12 flex">
                  <div className="mx-8 flex flex-1 flex-col">
                    <div className="text-center">Server Logo (optional)</div>
                    <FileUpload />
                  </div>
                  <div className="mx-8 flex flex-1 flex-col">
                    <div className="text-center">Server Banner (optional)</div>
                    <FileUpload />
                  </div>
                </div>
                <div className="pb-6 pt-2">
                  Logo / Banner can be uploaded at any time
                </div>
                <div>
                  <Button color={"gradient"} size={"lg"}>
                    Create!
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};
export default CreateServerModal;
