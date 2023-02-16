import PencilIcon from "@/src/icons/PencilIcon";
import React, { useState, useRef, useEffect } from "react";
import { Button, Input, Radio, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import axios from "axios";
import { User } from "@prisma/client";
import Resizer from "react-image-file-resizer";

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

async function uploadPicturesToS3(
  id: string,
  type: string,
  ext: string,
  picture: File
) {
  const category = "users";
  const data = await axios
    .get(`/api/s3upload?category=${category}&id=${id}&type=${type}&ext=${ext}`)
    .catch((err) => {
      console.log(err);
    });
  const { uploadURL, key } = data.data;
  const resizedFile = await resizeFile(picture, ext);
  await axios.put(uploadURL, resizedFile).catch((err) => {
    console.log(err);
  });
  return key;
}
const AccountPage = (props: { currentUser: User }) => {
  const [settingsSelction, setSettingsSelction] = useState("User");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [realNameImage, setRealNameImage] = useState<File | null>(null);
  const [realNameImageHolder, setRealNameImageHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [realNamePictureExt, setRealNamePictureExt] = useState<string>();

  const [psuedonymImage, setPsuedonymImage] = useState<File | null>(null);
  const [psuedonymImageHolder, setPsuedonymImageHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [psuedonymPictureExt, setPsuedonymPictureExt] = useState<string>();
  const realName = useRef<HTMLInputElement>(null);
  const psuedonym = useRef<HTMLInputElement>(null);
  const nameMutation = api.users.setUserName.useMutation();
  const psuedonymMutation = api.users.setUserPsuedonym.useMutation();

  const { currentUser } = props;
  const { query } = useRouter();

  const imageMutation = api.users.setUserImage.useMutation();
  const psuedonymImageMutation = api.users.setUserPsuedonymImage.useMutation();

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
        setPsuedonymImage(event.target.files[0]);
        const ext = event.target.files[0].type.split("/")[1];
        setPsuedonymPictureExt(ext);
        const reader = new FileReader();
        reader.onload = () => {
          const str = reader.result;
          setPsuedonymImageHolder(str);
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  };
  const setPsuedonym = () => {
    if (psuedonym.current !== null) {
      psuedonymMutation.mutate(psuedonym.current.value);
    }
  };
  const setRealName = () => {
    if (realName.current !== null) {
      nameMutation.mutate(realName.current.value);
    }
  };

  const updateRealNameImage = async () => {
    const type = "image";
    const ext = realNamePictureExt;
    const id = currentUser.id;
    const key = await uploadPicturesToS3(id, type, ext, realNameImage);
    imageMutation.mutate(key);
    setRealNameImageHolder(null);
    setRealNameImage(null);
    fileInputRef.current!.value = "";
  };

  const updatePsuedonymImage = async () => {
    const type = "psuedonym_image";
    const ext = psuedonymPictureExt;
    const id = currentUser.id;
    const key = await uploadPicturesToS3(id, type, ext, psuedonymImage);
    psuedonymImageMutation.mutate(key);
    setPsuedonymImageHolder(null);
    setPsuedonymImage(null);
    fileInputRef.current!.value = "";
  };

  const changeRealNameUsage = () => {};
  const changeNamePreferance = () => {};

  const renderSettingsSelection = () => {
    if (settingsSelction === "User") {
      return (
        <>
          <div className="my-4">
            <div className="mt-4 underline">{currentUser.email}</div>
            {realNameImageHolder !== null || psuedonymImageHolder !== null ? (
              <div className="absolute z-10 mx-auto ml-36 rounded-lg bg-zinc-200 px-12 py-2 shadow-lg">
                <img
                  src={
                    realNameImageHolder !== null
                      ? (realNameImageHolder as string)
                      : (psuedonymImageHolder as string)
                  }
                  className="mx-auto h-32 w-32 rounded-full"
                />
                <div className="text-center text-zinc-800">
                  Confirm New Image to{" "}
                  {realNameImageHolder !== null ? "Real Name" : "Psuedonym"}?
                </div>
                <div className="-mx-6 flex justify-around py-4">
                  <Button
                    onClick={
                      realNameImageHolder !== null
                        ? updateRealNameImage
                        : updatePsuedonymImage
                    }
                    color={"primary"}
                    auto
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() => {
                      setRealNameImageHolder(null);
                      setRealNameImage(null);
                      fileInputRef.current!.value = "";
                      setPsuedonymImageHolder(null);
                      setPsuedonymImage(null);
                    }}
                    color={"error"}
                    auto
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : null}
            <div className="flex justify-evenly">
              <div>
                <img
                  src={currentUser.image as string}
                  className="h-32 w-32 rounded-full"
                />
                <label
                  htmlFor="uploadRealName"
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
                  id="uploadRealName"
                  onChange={(e) => handleFileInput(e, "realName")}
                  accept="image/png, image/jpeg"
                />
              </div>
              <div>
                <img
                  src={currentUser.psuedonym_image as string}
                  className="h-32 w-32 rounded-full"
                />
                <label
                  htmlFor="uploadPsuedonym"
                  className="absolute -mt-6 h-6 w-6 cursor-pointer rounded-lg bg-zinc-200 hover:bg-zinc-300 active:bg-zinc-400"
                >
                  <span className="mt-1 flex justify-center">
                    <PencilIcon height={14} width={14} color={"#27272a"} />
                  </span>
                </label>
                <input
                  ref={fileInputRef}
                  type={"file"}
                  hidden
                  id="uploadPsuedonym"
                  onChange={(e) => handleFileInput(e, "psuedonym")}
                  accept="image/png, image/jpeg"
                />
              </div>
            </div>
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
                    <span className="mb-4 w-48">
                      <Input labelPlaceholder="Real Name" ref={realName} />
                    </span>
                    <div className="flex flex-row">
                      <div className="w-4">
                        <Button shadow auto onClick={setRealName}>
                          Set
                        </Button>
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
                  </div>
                  <div className="my-4 mx-4 flex flex-col">
                    <span className="mb-4 w-48">
                      <Input labelPlaceholder="Pseudonym" />
                    </span>
                    <div className="flex flex-row">
                      <div className="w-4">
                        <Button
                          shadow
                          auto
                          onClick={setPsuedonym}
                          ref={psuedonym}
                        >
                          Set
                        </Button>
                      </div>
                      <div className="ml-16">
                        Currently:
                        {currentUser.psuedonym ? (
                          <div className="w-24 break-words">
                            {currentUser.psuedonym}
                          </div>
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
            defaultValue={currentUser.name_display_pref}
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
            defaultValue={currentUser.name_display_pref}
            onChange={changeNamePreferance}
          >
            <Tooltip content="No psuedonym is set" placement="top">
              <Radio
                isDisabled={currentUser.psuedonym ? false : true}
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
    <div className="flex h-screen w-full">
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
