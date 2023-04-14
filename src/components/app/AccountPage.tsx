import PencilIcon from "@/src/icons/PencilIcon";
import React, {
  useState,
  useRef,
  useContext,
  Dispatch,
  useEffect,
} from "react";
import { Button, Input, Loading, Radio, Tooltip } from "@nextui-org/react";
import { api } from "../../utils/api";
import axios from "axios";
import { Server, Server_Admin, Server_Member, User } from "@prisma/client";
import Resizer from "react-image-file-resizer";
import ThemeContext from "../ThemeContextProvider";
import useOnClickOutside from "@/src/components/ClickOutsideHook";
import ChevronDown from "@/src/icons/ChevronDown";

const resizeFile = (file: File, extension: string) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      200,
      200,
      extension,
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

const AccountPage = (props: {
  setTimestamp: Dispatch<React.SetStateAction<number>>;
  timestamp: number;
  triggerUserRefresh: () => Promise<void>;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
}) => {
  const { triggerUserRefresh, currentUser, timestamp, setTimestamp } = props;
  const { isDarkTheme } = useContext(ThemeContext);
  const [settingsSelection, setSettingsSelection] = useState("User");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [realNameImage, setRealNameImage] = useState<File | null>(null);
  const [realNameImageHolder, setRealNameImageHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [realNamePictureExt, setRealNamePictureExt] = useState<string>();

  const [pseudonymImage, setPseudonymImage] = useState<File | null>(null);
  const [pseudonymImageHolder, setPseudonymImageHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [pseudonymPictureExt, setPseudonymPictureExt] = useState<string>();
  const realName = useRef<HTMLInputElement>(null);
  const pseudonym = useRef<HTMLInputElement>(null);
  const nameMutation = api.users.setUserName.useMutation();
  const pseudonymMutation = api.users.setUserPseudonym.useMutation();
  const [realNameSetLoading, setRealNameSetLoading] = useState(false);
  const [pseudonymSetLoading, setPseudonymSetLoading] = useState(false);
  const [imageConfirmLoading, setImageConfirmLoading] = useState(false);
  const [showingSettingsMenu, setShowingSettingsMenu] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const settingMenuRef = useRef<HTMLDivElement>(null);

  const imageMutation = api.users.setUserImage.useMutation();
  const pseudonymImageMutation = api.users.setUserPseudonymImage.useMutation();
  const deleteUser = api.users.deleteUser.useMutation();
  const s3TokenMutation = api.misc.returnS3Token.useMutation();

  useOnClickOutside([settingMenuRef], () => {
    setShowingSettingsMenu(false);
  });

  const handleFileInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    to_set: string
  ) => {
    if (to_set === "realName") {
      if (event.target.files && event.target.files[0]) {
        setRealNameImage(event.target.files[0]);
        const ext = event.target.files[0].type.split("/")[1];
        setRealNamePictureExt(ext);
        const reader = new FileReader();
        reader.onload = () => {
          const str = reader.result;
          setRealNameImageHolder(str);
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    } else {
      if (event.target.files && event.target.files[0]) {
        setPseudonymImage(event.target.files[0]);
        const ext = event.target.files[0].type.split("/")[1];
        setPseudonymPictureExt(ext);
        const reader = new FileReader();
        reader.onload = () => {
          const str = reader.result;
          setPseudonymImageHolder(str);
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  };
  const setPseudonym = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setPseudonymSetLoading(true);
    if (pseudonym.current !== null) {
      await pseudonymMutation.mutateAsync(pseudonym.current.value);
      await triggerUserRefresh();
      pseudonym.current.value = "";
      setPseudonymSetLoading(false);
    }
  };
  const setRealName = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setRealNameSetLoading(true);
    if (realName.current !== null) {
      await nameMutation.mutateAsync(realName.current.value);
      await triggerUserRefresh();
      realName.current.value = "";
      setRealNameSetLoading(false);
    }
  };

  const updateRealNameImage = async () => {
    setImageConfirmLoading(true);
    const type = "image";
    const ext = realNamePictureExt as string;
    const id = currentUser.id as string;
    const s3TokenReturn = await s3TokenMutation.mutateAsync({
      id: id,
      type: type,
      ext: ext,
      category: "users",
    });

    const resizedFile = await resizeFile(realNameImage as File, ext);

    await axios.put(s3TokenReturn.uploadURL, resizedFile).catch((err) => {
      console.log(err);
    });

    await imageMutation.mutateAsync(s3TokenReturn.key);
    await triggerUserRefresh();
    setTimestamp(Date.now());
    setRealNameImageHolder(null);
    setRealNameImage(null);
    fileInputRef.current!.value = "";
    setImageConfirmLoading(false);
  };

  const updatePseudonymImage = async () => {
    setImageConfirmLoading(true);
    const type = "pseudonym_image";
    const ext = pseudonymPictureExt as string;
    const id = currentUser.id as string;
    const s3TokenReturn = await s3TokenMutation.mutateAsync({
      id: id,
      type: type,
      ext: ext,
      category: "users",
    });

    const resizedFile = await resizeFile(pseudonymImage as File, ext);

    await axios.put(s3TokenReturn.uploadURL, resizedFile).catch((err) => {
      console.log(err);
    });
    await pseudonymImageMutation.mutateAsync(s3TokenReturn.key);
    await triggerUserRefresh();
    setTimestamp(Date.now());
    setPseudonymImageHolder(null);
    setPseudonymImage(null);
    fileInputRef.current!.value = "";
    setImageConfirmLoading(false);
  };

  const deleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      deleteUser.mutate();
    }
  };
  const toggleSettingsMenu = async () => {
    setShowingSettingsMenu(!showingSettingsMenu);
    topRef?.current?.scrollIntoView({ behavior: "smooth" });
  };
  // const changeRealNameUsage = () => {};
  // const changeNamePreference = () => {};

  const renderSettingsSelection = () => {
    if (settingsSelection === "User") {
      return (
        <>
          <div className="my-4">
            <div className="my-4 underline">{currentUser.email}</div>
            {realNameImageHolder !== null || pseudonymImageHolder !== null ? (
              <div className="absolute z-10 mx-auto ml-36 rounded-lg bg-zinc-200 px-12 py-2 shadow-lg">
                <img
                  src={
                    realNameImageHolder !== null
                      ? (realNameImageHolder as string)
                      : (pseudonymImageHolder as string)
                  }
                  className="mx-auto h-32 w-32 rounded-full"
                />
                <div className="text-center text-zinc-800">
                  Confirm New Image to{" "}
                  {realNameImageHolder !== null ? "Real Name" : "Pseudonym"}?
                </div>
                <div className="-mx-6 flex justify-around py-4">
                  {imageConfirmLoading ? (
                    <Button disabled auto bordered>
                      <Loading type="points" size="sm" />
                    </Button>
                  ) : (
                    <Button
                      onClick={
                        realNameImageHolder !== null
                          ? updateRealNameImage
                          : updatePseudonymImage
                      }
                      color={"primary"}
                      auto
                    >
                      Confirm
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setRealNameImageHolder(null);
                      setRealNameImage(null);
                      fileInputRef.current!.value = "";
                      setPseudonymImageHolder(null);
                      setPseudonymImage(null);
                    }}
                    color={"error"}
                    auto
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : null}
            <div className="flex flex-col justify-evenly md:flex-row">
              <div className="mx-auto flex flex-col">
                <div className="mx-auto">
                  <img
                    src={`${
                      currentUser.image
                        ? currentUser.image
                        : currentUser.pseudonym_image
                    }?t=${timestamp}`}
                    className="h-32 w-32 rounded-full"
                  />
                  <label
                    htmlFor="uploadRealName"
                    className="z-50 -mt-4 flex h-6 w-6 cursor-pointer rounded-lg bg-zinc-700 hover:bg-zinc-800 active:bg-zinc-900 dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:active:bg-zinc-400"
                  >
                    <span className="mx-auto mt-1 flex">
                      <PencilIcon
                        height={14}
                        width={14}
                        color={isDarkTheme ? "#27272a" : "#f4f4f5"}
                      />
                    </span>
                  </label>
                  <input
                    ref={fileInputRef}
                    type={"file"}
                    hidden
                    id="uploadRealName"
                    onChange={(e) => handleFileInput(e, "realName")}
                    accept="image/png, image/jpeg"
                  />
                  <div className="flex justify-center pt-2 text-sm italic">
                    Real Name image
                  </div>
                </div>
                <div className="mx-4 my-4 flex flex-col">
                  <form onSubmit={setRealName}>
                    <div className="mb-4 w-48 pt-4">
                      <Input
                        labelPlaceholder="Real Name"
                        ref={realName}
                        status={isDarkTheme ? "default" : "secondary"}
                        aria-label="name input"
                      />
                    </div>
                    <div className="flex flex-row">
                      <div className="w-4">
                        {realNameSetLoading ? (
                          <Button disabled auto bordered>
                            <Loading type="points" size="sm" />
                          </Button>
                        ) : (
                          <Button shadow auto type="submit" color={"secondary"}>
                            Set
                          </Button>
                        )}
                      </div>
                      <div className="ml-16">
                        Currently:
                        {currentUser.name ? (
                          <div>{currentUser.name}</div>
                        ) : (
                          <div className="w-24 break-words">None Set</div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="mx-auto flex flex-col pt-8 md:pt-0">
                <div className="mx-auto">
                  <img
                    src={`${
                      currentUser.pseudonym_image
                        ? currentUser.pseudonym_image
                        : currentUser.image
                    }?t=${timestamp}`}
                    className={`h-32 w-32 rounded-full ${
                      isDarkTheme ? "bg-zinc-800" : "bg-zinc-50"
                    }`}
                  />
                  <label
                    htmlFor="uploadPseudonym"
                    className="z-50 -mt-4 flex h-6 w-6 cursor-pointer rounded-lg bg-zinc-700 hover:bg-zinc-800 active:bg-zinc-900 dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:active:bg-zinc-400"
                  >
                    <span className="mx-auto mt-1 flex">
                      <PencilIcon
                        height={14}
                        width={14}
                        color={isDarkTheme ? "#27272a" : "#f4f4f5"}
                      />
                    </span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type={"file"}
                    hidden
                    id="uploadPseudonym"
                    onChange={(e) => handleFileInput(e, "pseudonym")}
                    accept="image/png, image/jpeg"
                  />
                  <div className="flex justify-center pt-2 text-sm italic">
                    Pseudonym image
                  </div>
                </div>
                <div className="mx-4 my-4 flex flex-col">
                  <form onSubmit={setPseudonym}>
                    <div className="mb-4 w-48 pt-4">
                      <Input
                        labelPlaceholder="Pseudonym"
                        ref={pseudonym}
                        status={isDarkTheme ? "default" : "secondary"}
                        aria-label="pseudonym input"
                      />
                    </div>
                    <div className="flex flex-row">
                      <div className="w-4">
                        {pseudonymSetLoading ? (
                          <Button disabled auto bordered>
                            <Loading type="points" size="sm" />
                          </Button>
                        ) : (
                          <Button shadow auto type="submit" color={"secondary"}>
                            Set
                          </Button>
                        )}
                      </div>
                      <div className="ml-16">
                        Currently:
                        {currentUser.pseudonym ? (
                          <div className="w-24 break-words">
                            {currentUser.pseudonym}
                          </div>
                        ) : (
                          <div className="w-24 break-words italic">
                            None Set
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4 w-full">
            <div className="flex justify-center">
              <div className="w-full text-center md:w-3/4 lg:w-1/2 ">
                <div>
                  Depending on the community they may require you to use your
                  real name. Others allow you to use a pseudonym.
                </div>
                <div className="mt-4 flex justify-center"></div>
              </div>
            </div>
          </div>
        </>
      );
    }
    if (settingsSelection === "App") {
      return <div></div>;
    }
    if (settingsSelection === "Privacy") {
      return (
        <div>
          <Radio.Group
            label="Real Name Usage"
            size="sm"
            defaultValue={currentUser.name_display_pref}
            // onChange={changeRealNameUsage}
          >
            <Radio value="ask">
              Ask for every community - you can change in community settings tab
            </Radio>
            <Radio value="never">
              Never allow real name <br />
              (this will block you from joining communities where real names are
              enforced)
            </Radio>
            <Radio value="always">Always allow use</Radio>
          </Radio.Group>
          <hr className="my-4" />
          <Radio.Group
            label="Name Preference"
            size="sm"
            defaultValue={currentUser.name_display_pref}
            // onChange={changeNamePreference}
          >
            <Tooltip content="No pseudonym is set" placement="top">
              <Radio
                isDisabled={currentUser.pseudonym ? false : true}
                value="pseudonym"
              >
                Prefer Pseudonym
              </Radio>
            </Tooltip>
            <Radio value="real">Prefer Real Name</Radio>
          </Radio.Group>
        </div>
      );
    }
    if (settingsSelection === "Notification") {
      return <div></div>;
    }
    if (settingsSelection === "Accessibility") {
      return <div></div>;
    }
    if (settingsSelection === "Community") {
      return <div></div>;
    }
    if (settingsSelection === "Other") {
      return (
        <div className="">
          <div className="danger-zone-bg w-full rounded-lg p-4">
            <div className="text-3xl">
              <Button color={"error"} onClick={deleteAccount}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-screen w-full overflow-y-scroll bg-zinc-200 dark:bg-zinc-700 md:flex">
      <div id="settings-tabs flex" ref={settingMenuRef}>
        <div className="fixed z-[10000] flex w-full flex-row px-4 py-4 text-xl tracking-wide underline underline-offset-4 md:w-fit">
          <div className="flex">
            <button
              className="z-50 flex md:cursor-default"
              onClick={toggleSettingsMenu}
            >
              <div className="flex">Settings Menu</div>
              <div
                className={`${
                  showingSettingsMenu ? "rotate-180" : ""
                } my-auto flex transform transition-all duration-700 ease-in-out md:hidden`}
              >
                <ChevronDown
                  height={30}
                  width={30}
                  stroke={isDarkTheme ? "#fafafa" : "#18181b"}
                  strokeWidth={1}
                />
              </div>
            </button>
          </div>
        </div>
        <div
          className={`fixed z-[1000] rounded-br-2xl bg-purple-200 px-6 py-4 pr-10 transition-all duration-500 ease-in-out dark:bg-zinc-800 md:relative ${
            showingSettingsMenu ? "" : "-translate-y-full md:translate-y-0"
          }`}
        >
          <ul
            className={`${
              showingSettingsMenu ? "" : "-translate-y-[100%] md:translate-y-0"
            } transform pt-6 transition-all duration-700 ease-in-out`}
          >
            <li className="hvr-move-right">
              <button
                onClick={() => {
                  setSettingsSelection("User");
                  toggleSettingsMenu();
                }}
                className={`${
                  settingsSelection === "User" ? "underline" : ""
                }  underline-offset-4`}
              >
                User
              </button>
            </li>
            <li className="hvr-move-right">
              <button
                onClick={() => {
                  setSettingsSelection("App");
                  toggleSettingsMenu();
                }}
                className={`${
                  settingsSelection === "App" ? "underline" : ""
                }  underline-offset-4`}
              >
                App
              </button>
            </li>
            <li className="hvr-move-right">
              <button
                onClick={() => {
                  setSettingsSelection("Privacy");
                  toggleSettingsMenu();
                }}
                className={`${
                  settingsSelection === "Privacy" ? "underline" : ""
                }  underline-offset-4`}
              >
                Privacy
              </button>
            </li>
            <li className="hvr-move-right">
              <button
                onClick={() => {
                  setSettingsSelection("Notification");
                  toggleSettingsMenu();
                }}
                className={`${
                  settingsSelection === "Notification" ? "underline" : ""
                }  underline-offset-4`}
              >
                Notification
              </button>
            </li>
            <li className="hvr-move-right">
              <button
                onClick={() => {
                  setSettingsSelection("Accessibility");
                  toggleSettingsMenu();
                }}
                className={`${
                  settingsSelection === "Accessibility" ? "underline" : ""
                }  underline-offset-4`}
              >
                Accessibility
              </button>
            </li>
            <li className="hvr-move-right">
              <button
                onClick={() => {
                  setSettingsSelection("Community");
                  toggleSettingsMenu();
                }}
                className={`${
                  settingsSelection === "Community" ? "underline" : ""
                }  underline-offset-4`}
              >
                Community
              </button>
            </li>
            <li className="hvr-move-right">
              <button
                onClick={() => {
                  setSettingsSelection("Other");
                  toggleSettingsMenu();
                }}
                className={`${
                  settingsSelection === "Other" ? "underline" : ""
                }  underline-offset-4`}
              >
                Other
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div id="settingsMain" className="flex px-6 pt-20 md:pt-24">
        <div className="">
          <div className="pb-4 text-3xl underline underline-offset-2">
            {settingsSelection} Settings
          </div>
          {renderSettingsSelection()}
        </div>
      </div>
    </div>
  );
};
export default AccountPage;
