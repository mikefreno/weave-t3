import PencilIcon from "@/src/icons/PencilIcon";
import React, { useState, useRef } from "react";
import { Button, Input, Radio, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const AccountPage = (props: { session: any }) => {
  const [settingsSelction, setSettingsSelction] = useState("User");
  const { session } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(
    null
  );
  const { query } = useRouter();
  const currentUser = api.users.getById.useQuery(session.user.id);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setProfileImage(str);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const sendImageToServer = () => {
    //send
    profileImage;
  };
  const changeRealNameUsage = () => {};
  const changeNamePreferance = () => {};

  const renderSettingsSelection = () => {
    if (settingsSelction === "User") {
      return (
        <>
          <div className="my-4">
            {profileImage !== null ? (
              <div className=" mx-auto ml-36 rounded-lg bg-zinc-200 px-12 py-2 shadow-lg">
                <img
                  src={profileImage as string}
                  className="mx-auto h-32 w-32 rounded-full"
                />
                <div className="text-center text-zinc-800">
                  Confirm New Image?
                </div>
                <div className="-mx-6 flex justify-around py-4">
                  <Button onClick={sendImageToServer} color={"primary"} auto>
                    Confirm
                  </Button>
                  <Button
                    onClick={() => {
                      setProfileImage(null);
                      fileInputRef.current!.value = "";
                    }}
                    color={"error"}
                    auto
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : null}
            <img
              src={session?.user?.image}
              className="h-32 w-32 rounded-full"
            />
            <label
              htmlFor="upload"
              className="absolute  -mt-6 h-6 w-6 cursor-pointer rounded-lg bg-zinc-200 hover:bg-zinc-300 active:bg-zinc-400"
            >
              <span className="mt-1 flex justify-center">
                <PencilIcon height={14} width={14} color={"#27272a"} />
              </span>
            </label>
            <input
              ref={fileInputRef}
              type={"file"}
              hidden
              id="upload"
              onChange={handleFileInput}
              accept="image/png, image/jpeg"
            />
            <div className="mt-2 -ml-2">{session?.user?.email}</div>
          </div>
          <div className="my-4 w-full">
            <div className="flex justify-center">
              <div className="w-full text-center md:w-3/4 lg:w-1/2 ">
                <div>
                  Depending on the community they may require you to use your
                  real name. Others allow you to use a psuedonym.
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="my-4 mx-4 flex flex-col">
                    <span className="w-48">
                      <Input labelPlaceholder="Real Name" />
                    </span>
                    <div className="flex flex-row">
                      <div className="w-4">
                        <Button shadow auto>
                          Set
                        </Button>
                      </div>
                      <div className="ml-16">
                        Currently:
                        {session?.user?.name ? (
                          <div>{session?.user?.name}</div>
                        ) : (
                          <div className="w-24 break-words">None Set</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="my-4 mx-4 flex flex-col">
                    <span className="w-48">
                      <Input labelPlaceholder="Pseudonym" />
                    </span>
                    <div className="flex flex-row">
                      <div className="w-4">
                        <Button shadow auto>
                          Set
                        </Button>
                      </div>
                      <div className="ml-16">
                        Currently:
                        {session?.user?.display_name ? (
                          <div>{currentUser.data?.display_name}</div>
                        ) : (
                          <div className="w-24 break-words">None Set</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    if (settingsSelction === "App") {
      return <div></div>;
    }
    if (settingsSelction === "Privacy") {
      return (
        <div>
          <Radio.Group
            label="Real Name Usage"
            size="sm"
            defaultValue={session?.user?.real_name_usage}
            onChange={changeRealNameUsage}
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
            label="Name Preferance"
            size="sm"
            defaultValue={session?.user?.name_display_pref}
            onChange={changeNamePreferance}
          >
            <Tooltip content="No psuedonym is set" placement="top">
              <Radio
                isDisabled={session?.user?.display_name ? false : true}
                value="psuedonym"
              >
                Prefer Psuedonym
              </Radio>
            </Tooltip>
            <Radio value="real">Prefer Real Name</Radio>
          </Radio.Group>
        </div>
      );
    }
    if (settingsSelction === "Notification") {
      return <div></div>;
    }
    if (settingsSelction === "Accessiblity") {
      return <div></div>;
    }
    if (settingsSelction === "Community") {
      return <div></div>;
    }
    if (settingsSelction === "Other") {
      return (
        <div>
          <hr />
          <div className="danger-zone-bg h-64 w-full rounded-lg  p-4">
            <div className="text-3xl"></div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen w-full ">
      <div id="settings-tabs" className="">
        <div className="w-34 rounded-br-md bg-zinc-400 px-6 py-4 dark:bg-zinc-600">
          <div className="text-xl tracking-wide underline underline-offset-4">
            Settings Menu
          </div>
          <ul className="text-sm">
            <li>
              <button onClick={() => setSettingsSelction("User")}>User</button>
            </li>
            <li>
              <button onClick={() => setSettingsSelction("App")}>App</button>
            </li>
            <li>
              <button onClick={() => setSettingsSelction("Privacy")}>
                Privacy
              </button>
            </li>
            <li>
              <button onClick={() => setSettingsSelction("Notification")}>
                Notification
              </button>
            </li>
            <li>
              <button onClick={() => setSettingsSelction("Accessibility")}>
                Accessiblity
              </button>
            </li>
            <li>
              <button onClick={() => setSettingsSelction("Community")}>
                Community
              </button>
            </li>
            <li>
              <button onClick={() => setSettingsSelction("Other")}>
                Other
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div id="settingsMain" className="mt-24  ml-12">
        <div className="">
          <div className="pb-4 text-3xl underline underline-offset-2">
            {settingsSelction} Settings
          </div>
          {renderSettingsSelection()}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
